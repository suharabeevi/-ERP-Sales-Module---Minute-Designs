const Invoice = require('../models/Invoice');
const SalesOrder = require('../models/SalesOrder');
const Item = require('../models/Item');
const itemService = require('./itemService');
const { v4: uuidv4 } = require('uuid');

const invoiceService = {
  // Create invoice from sales order
  async createInvoiceFromOrder(orderId) {
    try {
      const order = await SalesOrder.findById(orderId);
      if (!order) {
        throw new Error('Sales order not found');
      }

      if (order.status !== 'approved') {
        throw new Error('Only approved orders can be converted to invoice');
      }

      if (order.status === 'invoiced') {
        throw new Error('Invoice already created for this order');
      }

      const invoiceNumber = `INV-${Date.now()}-${uuidv4().substring(0, 8)}`;

      // Check stock availability again before creating invoice
      for (const item of order.items) {
        const stock = await itemService.getItemStock(item.itemId);
        if (stock < item.quantity) {
          throw new Error(
            `Insufficient stock for ${item.itemName}. Available: ${stock}`
          );
        }
      }

      // Create invoice
      const invoice = new Invoice({
        invoiceNumber,
        salesOrderId: order._id,
        items: order.items,
        subtotal: order.subtotal,
        tax: order.tax,
        grandTotal: order.grandTotal,
        status: 'unpaid',
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        deliveryAddress: order.deliveryAddress,
        notes: order.notes,
        invoiceDate: new Date(),
      });

      await invoice.save();

      // Reduce stock for each item
      for (const item of order.items) {
        await itemService.reduceStock(item.itemId, item.quantity);
      }

      // Update sales order status
      order.status = 'invoiced';
      await order.save();

      return invoice;
    } catch (error) {
      throw error;
    }
  },

  // Get all invoices
  async getAllInvoices(filters = {}) {
    try {
      const query = {};
      if (filters.status) {
        query.status = filters.status;
      }
      if (filters.search) {
        query.$or = [
          { invoiceNumber: { $regex: filters.search, $options: 'i' } },
          { customerName: { $regex: filters.search, $options: 'i' } },
        ];
      }
      return await Invoice.find(query)
        .populate('salesOrderId', 'orderNumber')
        .sort({ createdAt: -1 });
    } catch (error) {
      throw error;
    }
  },

  // Get invoice by ID
  async getInvoiceById(invoiceId) {
    try {
      return await Invoice.findById(invoiceId).populate('salesOrderId');
    } catch (error) {
      throw error;
    }
  },

  // Get invoice by invoice number
  async getInvoiceByNumber(invoiceNumber) {
    try {
      return await Invoice.findOne({ invoiceNumber }).populate('salesOrderId');
    } catch (error) {
      throw error;
    }
  },

  // Update invoice status based on payment
  async updateInvoiceStatus(invoiceId) {
    try {
      const invoice = await Invoice.findById(invoiceId);
      if (!invoice) {
        throw new Error('Invoice not found');
      }

      // Calculate total paid from receipts
      const Receipt = require('../models/Receipt');
      const receipts = await Receipt.find({ invoiceId: invoice._id });
      const totalPaid = receipts.reduce((sum, receipt) => sum + receipt.amountPaid, 0);

      if (totalPaid >= invoice.grandTotal) {
        invoice.status = 'paid';
      } else if (totalPaid > 0) {
        invoice.status = 'partial';
      } else {
        invoice.status = 'unpaid';
      }

      await invoice.save();
      return invoice;
    } catch (error) {
      throw error;
    }
  },

  // Delete invoice (only if unpaid)
  async deleteInvoice(invoiceId) {
    try {
      const invoice = await Invoice.findById(invoiceId);
      if (!invoice) {
        throw new Error('Invoice not found');
      }

      if (invoice.status !== 'unpaid') {
        throw new Error('Cannot delete paid or partial invoices');
      }

      return await Invoice.findByIdAndDelete(invoiceId);
    } catch (error) {
      throw error;
    }
  },
};

module.exports = invoiceService;

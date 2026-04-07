const Receipt = require('../models/Receipt');
const Invoice = require('../models/Invoice');
const invoiceService = require('./invoiceService');
const { v4: uuidv4 } = require('uuid');

const receiptService = {
  // Create receipt for payment
  async createReceipt(receiptData) {
    try {
      const invoice = await Invoice.findById(receiptData.invoiceId);
      if (!invoice) {
        throw new Error('Invoice not found');
      }

      if (receiptData.amountPaid <= 0) {
        throw new Error('Amount paid must be greater than 0');
      }

      const receiptNumber = `RCP-${Date.now()}-${uuidv4().substring(0, 8)}`;

      const receipt = new Receipt({
        receiptNumber,
        invoiceId: receiptData.invoiceId,
        amountPaid: receiptData.amountPaid,
        paymentMethod: receiptData.paymentMethod,
        paymentDate: receiptData.paymentDate || new Date(),
        notes: receiptData.notes,
        referenceNumber: receiptData.referenceNumber,
      });

      await receipt.save();

      // Update invoice status
      await invoiceService.updateInvoiceStatus(receiptData.invoiceId);

      return receipt;
    } catch (error) {
      throw error;
    }
  },

  // Get all receipts
  async getAllReceipts(filters = {}) {
    try {
      const query = {};
      if (filters.search) {
        query.$or = [
          { receiptNumber: { $regex: filters.search, $options: 'i' } },
          { referenceNumber: { $regex: filters.search, $options: 'i' } },
        ];
      }
      if (filters.paymentMethod) {
        query.paymentMethod = filters.paymentMethod;
      }
      return await Receipt.find(query)
        .populate('invoiceId', 'invoiceNumber customerName')
        .sort({ createdAt: -1 });
    } catch (error) {
      throw error;
    }
  },

  // Get receipt by ID
  async getReceiptById(receiptId) {
    try {
      return await Receipt.findById(receiptId);
    } catch (error) {
      throw error;
    }
  },

  // Get receipts for invoice
  async getReceiptsByInvoice(invoiceId) {
    try {
      return await Receipt.find({ invoiceId }).sort({ createdAt: -1 });
    } catch (error) {
      throw error;
    }
  },

  // Delete receipt
  async deleteReceipt(receiptId) {
    try {
      const receipt = await Receipt.findById(receiptId);
      if (!receipt) {
        throw new Error('Receipt not found');
      }

      await Receipt.findByIdAndDelete(receiptId);

      // Update invoice status
      await invoiceService.updateInvoiceStatus(receipt.invoiceId);

      return receipt;
    } catch (error) {
      throw error;
    }
  },

  // Get total paid for invoice
  async getTotalPaidForInvoice(invoiceId) {
    try {
      const receipts = await Receipt.find({ invoiceId });
      return receipts.reduce((sum, receipt) => sum + receipt.amountPaid, 0);
    } catch (error) {
      throw error;
    }
  },
};

module.exports = receiptService;

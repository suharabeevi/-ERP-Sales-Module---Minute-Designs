const SalesOrder = require('../models/SalesOrder');
const Item = require('../models/Item');
const { v4: uuidv4 } = require('uuid');

const salesOrderService = {
  // Create a new sales order
  async createSalesOrder(orderData) {
    try {
      // Generate unique order number
      const orderNumber = `SO-${Date.now()}-${uuidv4().substring(0, 8)}`;

      // Validate items and calculate totals
      let subtotal = 0;
      const processedItems = [];

      for (const item of orderData.items) {
        const itemDoc = await Item.findById(item.itemId);
        if (!itemDoc) {
          throw new Error(`Item ${item.itemId} not found`);
        }

        // Check if enough stock available
        if (itemDoc.currentStock < item.quantity) {
          throw new Error(
            `Insufficient stock for ${itemDoc.name}. Available: ${itemDoc.currentStock}`
          );
        }

        const itemTotal = itemDoc.price * item.quantity;
        subtotal += itemTotal;

        processedItems.push({
          itemId: itemDoc._id,
          itemName: itemDoc.name,
          sku: itemDoc.sku,
          quantity: item.quantity,
          price: itemDoc.price,
          total: itemTotal,
        });
      }

      const tax = subtotal * 0.1; // 10% tax
      const grandTotal = subtotal + tax;

      const salesOrder = new SalesOrder({
        orderNumber,
        items: processedItems,
        subtotal,
        tax,
        grandTotal,
        status: 'pending',
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        customerPhone: orderData.customerPhone,
        deliveryAddress: orderData.deliveryAddress,
        notes: orderData.notes,
      });

      await salesOrder.save();
      return salesOrder;
    } catch (error) {
      throw error;
    }
  },

  // Get all sales orders
  async getAllSalesOrders(filters = {}) {
    try {
      const query = {};
      if (filters.status) {
        query.status = filters.status;
      }
      if (filters.search) {
        query.$or = [
          { orderNumber: { $regex: filters.search, $options: 'i' } },
          { customerName: { $regex: filters.search, $options: 'i' } },
        ];
      }
      return await SalesOrder.find(query)
        .populate('items.itemId', 'name sku price')
        .sort({ createdAt: -1 });
    } catch (error) {
      throw error;
    }
  },

  // Get sales order by ID
  async getSalesOrderById(orderId) {
    try {
      return await SalesOrder.findById(orderId).populate(
        'items.itemId',
        'name sku price'
      );
    } catch (error) {
      throw error;
    }
  },

  // Approve sales order
  async approveSalesOrder(orderId) {
    try {
      const order = await SalesOrder.findById(orderId);
      if (!order) {
        throw new Error('Sales order not found');
      }

      if (order.status !== 'pending') {
        throw new Error('Only pending orders can be approved');
      }

      order.status = 'approved';
      await order.save();
      return order;
    } catch (error) {
      throw error;
    }
  },

  // Update sales order
  async updateSalesOrder(orderId, updateData) {
    try {
      return await SalesOrder.findByIdAndUpdate(orderId, updateData, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      throw error;
    }
  },

  // Cancel sales order
  async cancelSalesOrder(orderId) {
    try {
      const order = await SalesOrder.findById(orderId);
      if (!order) {
        throw new Error('Sales order not found');
      }

      if (order.status === 'invoiced') {
        throw new Error('Cannot cancel invoiced orders');
      }

      order.status = 'cancelled';
      await order.save();
      return order;
    } catch (error) {
      throw error;
    }
  },

  // Delete sales order
  async deleteSalesOrder(orderId) {
    try {
      return await SalesOrder.findByIdAndDelete(orderId);
    } catch (error) {
      throw error;
    }
  },
};

module.exports = salesOrderService;

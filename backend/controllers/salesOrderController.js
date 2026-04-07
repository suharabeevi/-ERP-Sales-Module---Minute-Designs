const salesOrderService = require('../services/salesOrderService');

const salesOrderController = {
  // Create sales order
  async createSalesOrder(req, res) {
    try {
      const { items, customerName, customerEmail, customerPhone, deliveryAddress, notes } = req.body;

      if (!items || items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'At least one item is required',
        });
      }

      const order = await salesOrderService.createSalesOrder({
        items,
        customerName,
        customerEmail,
        customerPhone,
        deliveryAddress,
        notes,
      });

      res.status(201).json({
        success: true,
        message: 'Sales order created successfully',
        data: order,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Get all sales orders
  async getAllSalesOrders(req, res) {
    try {
      const filters = {
        status: req.query.status,
        search: req.query.search,
      };
      const orders = await salesOrderService.getAllSalesOrders(filters);

      res.status(200).json({
        success: true,
        data: orders,
        count: orders.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Get sales order by ID
  async getSalesOrderById(req, res) {
    try {
      const { id } = req.params;
      const order = await salesOrderService.getSalesOrderById(id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Sales order not found',
        });
      }

      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Approve sales order
  async approveSalesOrder(req, res) {
    try {
      const { id } = req.params;
      const order = await salesOrderService.approveSalesOrder(id);

      res.status(200).json({
        success: true,
        message: 'Sales order approved successfully',
        data: order,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Update sales order
  async updateSalesOrder(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const order = await salesOrderService.updateSalesOrder(id, updateData);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Sales order not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Sales order updated successfully',
        data: order,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Cancel sales order
  async cancelSalesOrder(req, res) {
    try {
      const { id } = req.params;
      const order = await salesOrderService.cancelSalesOrder(id);

      res.status(200).json({
        success: true,
        message: 'Sales order cancelled successfully',
        data: order,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Delete sales order
  async deleteSalesOrder(req, res) {
    try {
      const { id } = req.params;
      const order = await salesOrderService.deleteSalesOrder(id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Sales order not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Sales order deleted successfully',
        data: order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};

module.exports = salesOrderController;

const invoiceService = require('../services/invoiceService');

const invoiceController = {
  // Create invoice from sales order
  async createInvoiceFromOrder(req, res) {
    try {
      const { salesOrderId } = req.body;

      if (!salesOrderId) {
        return res.status(400).json({
          success: false,
          message: 'Sales order ID is required',
        });
      }

      const invoice = await invoiceService.createInvoiceFromOrder(salesOrderId);

      res.status(201).json({
        success: true,
        message: 'Invoice created successfully',
        data: invoice,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Get all invoices
  async getAllInvoices(req, res) {
    try {
      const filters = {
        status: req.query.status,
        search: req.query.search,
      };
      const invoices = await invoiceService.getAllInvoices(filters);

      res.status(200).json({
        success: true,
        data: invoices,
        count: invoices.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Get invoice by ID
  async getInvoiceById(req, res) {
    try {
      const { id } = req.params;
      const invoice = await invoiceService.getInvoiceById(id);

      if (!invoice) {
        return res.status(404).json({
          success: false,
          message: 'Invoice not found',
        });
      }

      res.status(200).json({
        success: true,
        data: invoice,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Get invoice by invoice number
  async getInvoiceByNumber(req, res) {
    try {
      const { invoiceNumber } = req.params;
      const invoice = await invoiceService.getInvoiceByNumber(invoiceNumber);

      if (!invoice) {
        return res.status(404).json({
          success: false,
          message: 'Invoice not found',
        });
      }

      res.status(200).json({
        success: true,
        data: invoice,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Delete invoice
  async deleteInvoice(req, res) {
    try {
      const { id } = req.params;
      const invoice = await invoiceService.deleteInvoice(id);

      if (!invoice) {
        return res.status(404).json({
          success: false,
          message: 'Invoice not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Invoice deleted successfully',
        data: invoice,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
};

module.exports = invoiceController;

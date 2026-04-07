const receiptService = require('../services/receiptService');

const receiptController = {
  // Create receipt
  async createReceipt(req, res) {
    try {
      const { invoiceId, amountPaid, paymentMethod, paymentDate, notes, referenceNumber } = req.body;

      if (!invoiceId || !amountPaid || !paymentMethod) {
        return res.status(400).json({
          success: false,
          message: 'Invoice ID, amount paid, and payment method are required',
        });
      }

      if (amountPaid <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Amount paid must be greater than 0',
        });
      }

      const receipt = await receiptService.createReceipt({
        invoiceId,
        amountPaid,
        paymentMethod,
        paymentDate,
        notes,
        referenceNumber,
      });

      res.status(201).json({
        success: true,
        message: 'Receipt created successfully',
        data: receipt,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Get all receipts
  async getAllReceipts(req, res) {
    try {
      const filters = {
        search: req.query.search,
        paymentMethod: req.query.paymentMethod,
      };
      const receipts = await receiptService.getAllReceipts(filters);

      res.status(200).json({
        success: true,
        data: receipts,
        count: receipts.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Get receipt by ID
  async getReceiptById(req, res) {
    try {
      const { id } = req.params;
      const receipt = await receiptService.getReceiptById(id);

      if (!receipt) {
        return res.status(404).json({
          success: false,
          message: 'Receipt not found',
        });
      }

      res.status(200).json({
        success: true,
        data: receipt,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Get receipts for invoice
  async getReceiptsByInvoice(req, res) {
    try {
      const { invoiceId } = req.params;
      const receipts = await receiptService.getReceiptsByInvoice(invoiceId);

      res.status(200).json({
        success: true,
        data: receipts,
        count: receipts.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Delete receipt
  async deleteReceipt(req, res) {
    try {
      const { id } = req.params;
      const receipt = await receiptService.deleteReceipt(id);

      if (!receipt) {
        return res.status(404).json({
          success: false,
          message: 'Receipt not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Receipt deleted successfully',
        data: receipt,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Get remaining balance for invoice
  async getRemainingBalance(req, res) {
    try {
      const { invoiceId } = req.params;
      const balanceInfo = await receiptService.getRemainingBalance(invoiceId);

      res.status(200).json({
        success: true,
        data: balanceInfo,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Get total paid for invoice
  async getTotalPaidForInvoice(req, res) {
    try {
      const { invoiceId } = req.params;
      const totalPaid = await receiptService.getTotalPaidForInvoice(invoiceId);
      const receipts = await receiptService.getReceiptsByInvoice(invoiceId);

      res.status(200).json({
        success: true,
        data: {
          totalPaid,
          receiptCount: receipts.length,
          receipts,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};

module.exports = receiptController;

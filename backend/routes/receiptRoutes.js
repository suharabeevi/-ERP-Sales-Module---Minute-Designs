const receiptController = require('../controllers/receiptController');
const router = require('express').Router();

// Create receipt
router.post('/', receiptController.createReceipt);

// Get all receipts
router.get('/', receiptController.getAllReceipts);

// Get receipt by ID
router.get('/:id', receiptController.getReceiptById);

// Get receipts for invoice
router.get('/invoice/:invoiceId', receiptController.getReceiptsByInvoice);

// Delete receipt
router.delete('/:id', receiptController.deleteReceipt);

module.exports = router;

const invoiceController = require('../controllers/invoiceController');
const router = require('express').Router();

// Create invoice from sales order
router.post('/', invoiceController.createInvoiceFromOrder);

// Get all invoices
router.get('/', invoiceController.getAllInvoices);

// Get invoice by ID
router.get('/:id', invoiceController.getInvoiceById);

// Get invoice by invoice number
router.get('/number/:invoiceNumber', invoiceController.getInvoiceByNumber);

// Delete invoice
router.delete('/:id', invoiceController.deleteInvoice);

module.exports = router;

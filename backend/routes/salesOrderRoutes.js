const salesOrderController = require('../controllers/salesOrderController');
const router = require('express').Router();

// Create sales order
router.post('/', salesOrderController.createSalesOrder);

// Get all sales orders
router.get('/', salesOrderController.getAllSalesOrders);

// Approve sales order (specific routes must come before /:id)
router.patch('/:id/approve', salesOrderController.approveSalesOrder);

// Cancel sales order (specific routes must come before /:id)
router.patch('/:id/cancel', salesOrderController.cancelSalesOrder);

// Get sales order by ID (generic route comes after specific ones)
router.get('/:id', salesOrderController.getSalesOrderById);

// Update sales order
router.put('/:id', salesOrderController.updateSalesOrder);

// Delete sales order
router.delete('/:id', salesOrderController.deleteSalesOrder);

module.exports = router;

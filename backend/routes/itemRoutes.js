const itemController = require('../controllers/itemController');
const router = require('express').Router();

// Create item
router.post('/', itemController.createItem);

// Get all items
router.get('/', itemController.getAllItems);

// Get item by ID
router.get('/:id', itemController.getItemById);

// Get item stock
router.get('/:id/stock', itemController.getItemStock);

// Update item
router.put('/:id', itemController.updateItem);

// Delete item
router.delete('/:id', itemController.deleteItem);

module.exports = router;

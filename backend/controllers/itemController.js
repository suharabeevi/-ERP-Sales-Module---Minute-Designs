const itemService = require('../services/itemService');

const itemController = {
  // Create item
  async createItem(req, res) {
    try {
      const { name, sku, price, openingStock, description, status } = req.body;

      // Validation
      if (!name || !sku || price === undefined || openingStock === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Name, SKU, price, and opening stock are required',
        });
      }

      if (price < 0 || openingStock < 0) {
        return res.status(400).json({
          success: false,
          message: 'Price and opening stock must be positive numbers',
        });
      }

      const item = await itemService.createItem({
        name,
        sku,
        price,
        openingStock,
        description,
        status,
      });

      res.status(201).json({
        success: true,
        message: 'Item created successfully',
        data: item,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Get all items
  async getAllItems(req, res) {
    try {
      const filters = {
        status: req.query.status,
        search: req.query.search,
      };
      const items = await itemService.getAllItems(filters);

      res.status(200).json({
        success: true,
        data: items,
        count: items.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Get item by ID
  async getItemById(req, res) {
    try {
      const { id } = req.params;
      const item = await itemService.getItemById(id);

      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Item not found',
        });
      }

      res.status(200).json({
        success: true,
        data: item,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Update item
  async updateItem(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (updateData.price !== undefined && updateData.price < 0) {
        return res.status(400).json({
          success: false,
          message: 'Price must be a positive number',
        });
      }

      const item = await itemService.updateItem(id, updateData);

      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Item not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Item updated successfully',
        data: item,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Delete item
  async deleteItem(req, res) {
    try {
      const { id } = req.params;
      const item = await itemService.deleteItem(id);

      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Item not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Item deleted successfully',
        data: item,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Get item stock
  async getItemStock(req, res) {
    try {
      const { id } = req.params;
      const stock = await itemService.getItemStock(id);

      if (stock === null) {
        return res.status(404).json({
          success: false,
          message: 'Item not found',
        });
      }

      res.status(200).json({
        success: true,
        data: { stock },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};

module.exports = itemController;

const Item = require('../models/Item');

const itemService = {
  // Create a new item
  async createItem(itemData) {
    try {
      const existingSKU = await Item.findOne({ sku: itemData.sku.toUpperCase() });
      if (existingSKU) {
        throw new Error('SKU already exists');
      }

      const item = new Item({
        name: itemData.name,
        sku: itemData.sku.toUpperCase(),
        price: itemData.price,
        openingStock: itemData.openingStock,
        currentStock: itemData.openingStock,
        description: itemData.description,
        status: itemData.status || 'active',
      });

      await item.save();
      return item;
    } catch (error) {
      throw error;
    }
  },

  // Get all items
  async getAllItems(filters = {}) {
    try {
      const query = {};
      if (filters.status) {
        query.status = filters.status;
      }
      if (filters.search) {
        query.$or = [
          { name: { $regex: filters.search, $options: 'i' } },
          { sku: { $regex: filters.search, $options: 'i' } },
        ];
      }
      return await Item.find(query).sort({ createdAt: -1 });
    } catch (error) {
      throw error;
    }
  },

  // Get item by ID
  async getItemById(itemId) {
    try {
      return await Item.findById(itemId);
    } catch (error) {
      throw error;
    }
  },

  // Update item
  async updateItem(itemId, updateData) {
    try {
      if (updateData.sku) {
        const existingItem = await Item.findOne({
          sku: updateData.sku.toUpperCase(),
          _id: { $ne: itemId },
        });
        if (existingItem) {
          throw new Error('SKU already exists');
        }
        updateData.sku = updateData.sku.toUpperCase();
      }

      return await Item.findByIdAndUpdate(itemId, updateData, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      throw error;
    }
  },

  // Update stock after invoice
  async reduceStock(itemId, quantity) {
    try {
      const item = await Item.findById(itemId);
      if (!item) {
        throw new Error('Item not found');
      }

      if (item.currentStock < quantity) {
        throw new Error('Insufficient stock');
      }

      item.currentStock -= quantity;
      await item.save();
      return item;
    } catch (error) {
      throw error;
    }
  },

  // Delete item
  async deleteItem(itemId) {
    try {
      return await Item.findByIdAndDelete(itemId);
    } catch (error) {
      throw error;
    }
  },

  // Get item stock
  async getItemStock(itemId) {
    try {
      const item = await Item.findById(itemId, 'currentStock');
      return item ? item.currentStock : null;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = itemService;

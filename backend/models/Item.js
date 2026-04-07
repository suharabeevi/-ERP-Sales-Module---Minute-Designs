const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number'],
    },
    openingStock: {
      type: Number,
      required: [true, 'Opening stock is required'],
      min: [0, 'Opening stock must be a positive number'],
    },
    currentStock: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to set currentStock from openingStock on creation
itemSchema.pre('save', function (next) {
  if (this.isNew && !this.currentStock) {
    this.currentStock = this.openingStock;
  }
  next();
});

module.exports = mongoose.model('Item', itemSchema);

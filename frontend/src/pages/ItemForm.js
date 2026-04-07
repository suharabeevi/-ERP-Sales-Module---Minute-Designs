import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemService } from '../services/api';
import { useApp } from '../context/AppContext';

const ItemForm = ({ initialData = null }) => {
  const navigate = useNavigate();
  const { setError, setSuccess, setLoading } = useApp();
  const [formData, setFormData] = useState(
    initialData || {
      name: '',
      sku: '',
      price: '',
      openingStock: '',
      description: '',
      status: 'active',
    }
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'openingStock' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.sku || !formData.price || formData.openingStock === '') {
      setError('All required fields must be filled');
      return;
    }

    try {
      setLoading(true);
      if (initialData) {
        await itemService.updateItem(initialData._id, formData);
        setSuccess('Item updated successfully');
      } else {
        await itemService.createItem(formData);
        setSuccess('Item created successfully');
      }
      navigate('/items');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>{initialData ? 'Edit Item' : 'Create Item'}</h2>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Item Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter item name"
                required
              />
            </div>
            <div className="form-group">
              <label>SKU / Code *</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                placeholder="Enter SKU"
                required
                disabled={!!initialData}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
            <div className="form-group">
              <label>Opening Stock *</label>
              <input
                type="number"
                name="openingStock"
                value={formData.openingStock}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                disabled={!!initialData}
                required
              />
            </div>
          </div>

          <div className="form-row full">
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter item description"
              />
            </div>
          </div>

          <div className="form-row full">
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleInputChange}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="btn-group">
            <button type="submit" className="btn btn-primary">
              {initialData ? 'Update Item' : 'Create Item'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/items')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemForm;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { itemService } from '../services/api';
import { useApp } from '../context/AppContext';
import Loading from '../components/Loading';
import { formatCurrency } from '../utils/helpers';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const { setError, setSuccess } = useApp();

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const response = await itemService.getItemById(id);
      setItem(response.data.data);
      setFormData(response.data.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load item');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await itemService.updateItem(id, formData);
      setSuccess('Item updated successfully');
      setIsEditing(false);
      fetchItem();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update item');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await itemService.deleteItem(id);
      setSuccess('Item deleted successfully');
      navigate('/items');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete item');
    }
  };

  if (loading) return <Loading />;
  if (!item) return <div className="container">Item not found</div>;

  return (
    <div className="container">
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => navigate('/items')} className="btn btn-secondary">
          ← Back to Items
        </button>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h2>{item.name}</h2>
            <span className={`badge badge-${item.status}`}>{item.status}</span>
          </div>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="btn btn-primary">
              Edit Item
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Item Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>SKU / Code</label>
                <input type="text" value={item.sku} disabled style={{ backgroundColor: '#f0f0f0' }} />
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
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="form-row full">
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="btn-group">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
              <div>
                <p>
                  <strong>SKU:</strong> {item.sku}
                </p>
                <p>
                  <strong>Price:</strong> {formatCurrency(item.price)}
                </p>
                <p>
                  <strong>Status:</strong> {item.status}
                </p>
              </div>
              <div>
                <p>
                  <strong>Opening Stock:</strong> {item.openingStock}
                </p>
                <p>
                  <strong>Current Stock:</strong> {item.currentStock}
                </p>
                <p>
                  <strong>Stock Used:</strong> {item.openingStock - item.currentStock}
                </p>
              </div>
            </div>

            {item.description && (
              <div style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#f0f4f8', borderRadius: '6px' }}>
                <strong>Description:</strong>
                <p>{item.description}</p>
              </div>
            )}

            <div className="btn-group">
              <button onClick={() => setIsEditing(true)} className="btn btn-primary">
                Edit Item
              </button>
              <button onClick={handleDelete} className="btn btn-danger">
                Delete Item
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemDetail;

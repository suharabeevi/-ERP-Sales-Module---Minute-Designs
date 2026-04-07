import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemService } from '../services/api';
import { useApp } from '../context/AppContext';
import Loading from '../components/Loading';
import { formatCurrency } from '../utils/helpers';

const ItemList = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { setError, setSuccess } = useApp();

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await itemService.getAllItems();
      setItems(response.data.data || []);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await itemService.deleteItem(itemId);
      setSuccess('Item deleted successfully');
      setItems(items.filter((item) => item._id !== itemId));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete item');
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading />;

  return (
    <div className="container">
      <h2>Item Management</h2>
      <div className="page-header">
        <input
          type="text"
          placeholder="Search by name or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', width: '300px' }}
        />
        <a href="/items/create" className="btn btn-primary">
          + Create Item
        </a>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Current Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                  No items found
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.sku}</td>
                  <td>{formatCurrency(item.price)}</td>
                  <td>{item.currentStock}</td>
                  <td>
                    <span className={`badge badge-${item.status}`}>{item.status}</span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        onClick={() => navigate(`/items/${item._id}`)}
                        className="btn btn-sm btn-secondary"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="btn btn-sm btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItemList;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemService, salesOrderService } from '../services/api';
import { useApp } from '../context/AppContext';
import Loading from '../components/Loading';
import { formatCurrency } from '../utils/helpers';

const SalesOrderForm = ({ initialData = null }) => {
  const navigate = useNavigate();
  const { setError, setSuccess, setLoading } = useApp();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState(
    initialData || {
      items: [{ itemId: '', quantity: 1 }],
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      deliveryAddress: '',
      notes: '',
    }
  );

  const fetchItems = async () => {
    try {
      const response = await itemService.getAllItems({ status: 'active' });
      setItems(response.data.data || []);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load items');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: field === 'quantity' ? parseInt(value) : value,
    };
    setFormData((prev) => ({
      ...prev,
      items: newItems,
    }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { itemId: '', quantity: 1 }],
    }));
  };

  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.items.length === 0 || formData.items.some((item) => !item.itemId)) {
      setError('At least one item must be selected');
      return;
    }

    try {
      setLoading(true);
      const submitData = {
        ...formData,
        items: formData.items.map((item) => ({
          itemId: item.itemId,
          quantity: item.quantity,
        })),
      };

      if (initialData) {
        await salesOrderService.updateOrder(initialData._id, submitData);
        setSuccess('Sales order updated successfully');
      } else {
        await salesOrderService.createOrder(submitData);
        setSuccess('Sales order created successfully');
      }
      navigate('/sales-orders');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save sales order');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="container">
      <h2>{initialData ? 'Edit Sales Order' : 'Create Sales Order'}</h2>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <h3>Customer Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Customer Name</label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                placeholder="Enter customer name"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleInputChange}
                placeholder="Enter email"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
              />
            </div>
            <div className="form-group">
              <label>Delivery Address</label>
              <input
                type="text"
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleInputChange}
                placeholder="Enter delivery address"
              />
            </div>
          </div>

          <h3 style={{ marginTop: '30px' }}>Items</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, index) => {
                  const selectedItem = items.find((i) => i._id === item.itemId);
                  const quantity = Number(item.quantity) || 0;
                  const itemTotal = selectedItem ? parseFloat((selectedItem.price * quantity).toFixed(2)) : 0;

                  return (
                    <tr key={index}>
                      <td>
                        <select
                          value={item.itemId}
                          onChange={(e) => handleItemChange(index, 'itemId', e.target.value)}
                          required
                        >
                          <option value="">Select Item</option>
                          {items.map((i) => (
                            <option key={i._id} value={i._id}>
                              {i.name} (Stock: {i.currentStock})
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          min="1"
                          max={selectedItem?.currentStock || 999}
                          style={{ width: '80px' }}
                          required
                        />
                      </td>
                      <td>{formatCurrency(selectedItem ? selectedItem.price : 0)}</td>
                      <td>{formatCurrency(itemTotal)}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="btn btn-sm btn-danger"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={addItem}
            className="btn btn-secondary"
            style={{ marginTop: '10px' }}
          >
            + Add Item
          </button>

          <div className="form-row full" style={{ marginTop: '30px' }}>
            <div className="form-group">
              <label>Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Enter any notes"
              />
            </div>
          </div>

          <div className="btn-group">
            <button type="submit" className="btn btn-primary">
              {initialData ? 'Update Order' : 'Create Order'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/sales-orders')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalesOrderForm;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { salesOrderService, invoiceService } from '../services/api';
import { useApp } from '../context/AppContext';
import Loading from '../components/Loading';
import { formatCurrency } from '../utils/helpers';

const SalesOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setError, setSuccess } = useApp();

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await salesOrderService.getOrderById(id);
      setOrder(response.data.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load sales order');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      await salesOrderService.approveOrder(id);
      setSuccess('Order approved successfully');
      fetchOrder();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to approve order');
    }
  };

  const handleCreateInvoice = async () => {
    try {
      await invoiceService.createInvoice({ salesOrderId: id });
      setSuccess('Invoice created successfully');
      navigate('/invoices');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create invoice');
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      await salesOrderService.cancelOrder(id);
      setSuccess('Order cancelled successfully');
      navigate('/sales-orders');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  if (loading) return <Loading />;
  if (!order) return <div className="container">Sales order not found</div>;

  return (
    <div className="container">
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => navigate('/sales-orders')}
          className="btn btn-secondary"
        >
          ← Back to Orders
        </button>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h2>{order.orderNumber}</h2>
            <span className={`badge badge-${order.status}`}>{order.status.toUpperCase()}</span>
          </div>
          <div style={{ textAlign: 'right', color: '#7f8c8d' }}>
            <p style={{ margin: '5px 0' }}>
              <strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
            </p>
            <p style={{ margin: '5px 0' }}>
              <strong>Item Count:</strong> {order.items.length}
            </p>
          </div>
        </div>

        <h3>Customer Information</h3>
        <div className="form-row">
          <div>
            <p>
              <strong>Name:</strong> {order.customerName || '-'}
            </p>
            <p>
              <strong>Email:</strong> {order.customerEmail || '-'}
            </p>
          </div>
          <div>
            <p>
              <strong>Phone:</strong> {order.customerPhone || '-'}
            </p>
            <p>
              <strong>Address:</strong> {order.deliveryAddress || '-'}
            </p>
          </div>
        </div>

        <h3 style={{ marginTop: '30px' }}>Order Items</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>SKU</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.itemName}</td>
                  <td>{item.sku}</td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(item.price)}</td>
                  <td>{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '30px', textAlign: 'right' }}>
          <div style={{ marginBottom: '10px' }}>
            <p>
              <strong>Subtotal:</strong> {formatCurrency(order.subtotal)}
            </p>
            <p>
              <strong>Tax (10%):</strong> {formatCurrency(order.tax)}
            </p>
            <h3 style={{ color: '#2563eb', margin: '10px 0 0 0' }}>
              Grand Total: {formatCurrency(order.grandTotal)}
            </h3>
          </div>
        </div>

        {order.notes && (
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f4f8', borderRadius: '6px' }}>
            <strong>Notes:</strong> {order.notes}
          </div>
        )}

        <div className="btn-group" style={{ marginTop: '30px' }}>
          {order.status === 'pending' && (
            <>
              <button onClick={handleApprove} className="btn btn-success">
                ✓ Approve Order
              </button>
              <button onClick={handleCancel} className="btn btn-warning">
                Cancel Order
              </button>
            </>
          )}
          {order.status === 'approved' && (
            <button onClick={handleCreateInvoice} className="btn btn-primary">
              Create Invoice
            </button>
          )}
          {order.status !== 'invoiced' && order.status !== 'cancelled' && (
            <button onClick={handleCancel} className="btn btn-danger">
              Cancel Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesOrderDetail;

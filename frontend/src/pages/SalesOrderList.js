import React, { useState, useEffect } from 'react';
import { salesOrderService, invoiceService } from '../services/api';
import { useApp } from '../context/AppContext';
import Loading from '../components/Loading';
import { formatCurrency } from '../utils/helpers';

const SalesOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const { setError, setSuccess } = useApp();

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await salesOrderService.getAllOrders({
        status: filterStatus,
        search: searchTerm,
      });
      setOrders(response.data.data || []);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load sales orders');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (orderId) => {
    try {
      await salesOrderService.approveOrder(orderId);
      setSuccess('Order approved successfully');
      fetchOrders();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to approve order');
    }
  };

  const handleCreateInvoice = async (orderId) => {
    try {
      await invoiceService.createInvoice({ salesOrderId: orderId });
      setSuccess('Invoice created successfully');
      fetchOrders();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create invoice');
    }
  };

  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      await salesOrderService.cancelOrder(orderId);
      setSuccess('Order cancelled successfully');
      fetchOrders();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      await salesOrderService.deleteOrder(orderId);
      setSuccess('Order deleted successfully');
      fetchOrders();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete order');
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <Loading />;

  return (
    <div className="container">
      <h2>Sales Orders</h2>
      <div className="page-header" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by order number or customer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', flex: 1 }}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', width: '150px' }}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="invoiced">Invoiced</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <a href="/sales-orders/create" className="btn btn-primary">
          + New Order
        </a>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                  No sales orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order.orderNumber}</td>
                  <td>{order.customerName || '-'}</td>
                  <td>{formatCurrency(order.grandTotal)}</td>
                  <td>
                    <span className={`badge badge-${order.status}`}>{order.status}</span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="table-actions">
                      <a href={`/sales-orders/${order._id}`} className="btn btn-sm btn-secondary">
                        View
                      </a>
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleApprove(order._id)}
                          className="btn btn-sm btn-success"
                        >
                          Approve
                        </button>
                      )}
                      {order.status === 'approved' && (
                        <button
                          onClick={() => handleCreateInvoice(order._id)}
                          className="btn btn-sm btn-primary"
                        >
                          Invoice
                        </button>
                      )}
                      {order.status !== 'invoiced' && order.status !== 'cancelled' && (
                        <button
                          onClick={() => handleCancel(order._id)}
                          className="btn btn-sm btn-warning"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(order._id)}
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

export default SalesOrderList;

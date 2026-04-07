import React, { useState, useEffect } from 'react';
import { invoiceService, receiptService } from '../services/api';
import { useApp } from '../context/AppContext';
import Loading from '../components/Loading';
import { formatCurrency } from '../utils/helpers';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [paymentInfo, setPaymentInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const { setError, setSuccess } = useApp();

  useEffect(() => {
    fetchInvoices();
  }, [filterStatus]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await invoiceService.getAllInvoices({
        status: filterStatus,
        search: searchTerm,
      });
      const invoiceData = response.data.data || [];
      setInvoices(invoiceData);

      // Fetch payment info for each invoice
      const paymentInfoMap = {};
      for (const invoice of invoiceData) {
        try {
          const balanceResponse = await receiptService.getRemainingBalance(invoice._id);
          paymentInfoMap[invoice._id] = balanceResponse.data.data;
        } catch (error) {
          // Silently fail for individual payment info
          console.error(`Failed to fetch payment info for invoice ${invoice._id}`);
        }
      }
      setPaymentInfo(paymentInfoMap);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (invoiceId) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;

    try {
      await invoiceService.deleteInvoice(invoiceId);
      setSuccess('Invoice deleted successfully');
      fetchInvoices();
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Failed to delete invoice');
    }
  };

  const filteredInvoices = invoices.filter((invoice) =>
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (invoice.customerName && invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <Loading />;

  return (
    <div className="container">
      <h2>Invoices</h2>
      <div className="page-header" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by invoice number or customer..."
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
          <option value="unpaid">Unpaid</option>
          <option value="partial">Partial</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Invoice Number</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Total Paid</th>
              <th>Remaining</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                  No invoices found
                </td>
              </tr>
            ) : (
              filteredInvoices.map((invoice) => {
                const info = paymentInfo[invoice._id];
                const totalPaid = info?.totalPaid || invoice.totalPaid || 0;
                const remainingBalance = info?.remainingBalance || (invoice.remainingBalance !== undefined ? invoice.remainingBalance : invoice.grandTotal - totalPaid);

                return (
                  <tr key={invoice._id}>
                    <td>{invoice.invoiceNumber}</td>
                    <td>{invoice.customerName || '-'}</td>
                    <td>{formatCurrency(invoice.grandTotal)}</td>
                    <td style={{ color: '#27ae60', fontWeight: 'bold' }}>
                      {formatCurrency(totalPaid)}
                    </td>
                    <td style={{ color: remainingBalance > 0 ? '#e74c3c' : '#27ae60', fontWeight: 'bold' }}>
                      {formatCurrency(remainingBalance)}
                    </td>
                    <td>
                      <span className={`badge badge-${invoice.status}`}>{invoice.status}</span>
                    </td>
                    <td>{new Date(invoice.invoiceDate).toLocaleDateString()}</td>
                    <td>
                      <div className="table-actions">
                        <a href={`/invoices/${invoice._id}`} className="btn btn-sm btn-secondary">
                          View
                        </a>
                        {remainingBalance > 0 && (
                          <a
                            href={`/receipts/create?invoiceId=${invoice._id}`}
                            className="btn btn-sm btn-success"
                          >
                            Pay
                          </a>
                        )}
                        <button
                          onClick={() => handleDelete(invoice._id)}
                          className="btn btn-sm btn-danger"
                          title={invoice.status !== 'unpaid' ? 'Can only delete unpaid invoices' : ''}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceList;

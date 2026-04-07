import React, { useState, useEffect } from 'react';
import { receiptService } from '../services/api';
import { useApp } from '../context/AppContext';
import Loading from '../components/Loading';
import { formatCurrency } from '../utils/helpers';

const ReceiptList = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { setError, setSuccess } = useApp();

  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    try {
      setLoading(true);
      const response = await receiptService.getAllReceipts();
      setReceipts(response.data.data || []);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load receipts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (receiptId) => {
    if (!window.confirm('Are you sure you want to delete this receipt?')) return;

    try {
      await receiptService.deleteReceipt(receiptId);
      setSuccess('Receipt deleted successfully');
      fetchReceipts();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete receipt');
    }
  };

  const filteredReceipts = receipts.filter(
    (receipt) =>
      receipt.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (receipt.referenceNumber && receipt.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <Loading />;

  return (
    <div className="container">
      <h2>Receipts</h2>
      <div className="page-header" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by receipt number or reference..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', flex: 1 }}
        />
        <a href="/receipts/create" className="btn btn-primary">
          + New Receipt
        </a>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Receipt Number</th>
              <th>Invoice</th>
              <th>Amount Paid</th>
              <th>Payment Method</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReceipts.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                  No receipts found
                </td>
              </tr>
            ) : (
              filteredReceipts.map((receipt) => (
                <tr key={receipt._id}>
                  <td>{receipt.receiptNumber}</td>
                  <td>{receipt.invoiceId?.invoiceNumber || '-'}</td>
                  <td>{formatCurrency(receipt.amountPaid)}</td>
                  <td>
                    <span className={`badge badge-${receipt.paymentMethod}`}>
                      {receipt.paymentMethod.toUpperCase()}
                    </span>
                  </td>
                  <td>{new Date(receipt.paymentDate).toLocaleDateString()}</td>
                  <td>
                    <div className="table-actions">
                      <a href={`/receipts/${receipt._id}`} className="btn btn-sm btn-secondary">
                        View
                      </a>
                      <button
                        onClick={() => handleDelete(receipt._id)}
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

export default ReceiptList;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { invoiceService, receiptService } from '../services/api';
import { useApp } from '../context/AppContext';
import Loading from '../components/Loading';
import logo from '../assets/logo.svg';
import './InvoiceView.css';
import { formatCurrency } from '../utils/helpers';

const InvoiceView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setError } = useApp();
  const printRef = React.useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  useEffect(() => {
    fetchInvoiceData();
  }, [id]);

  const fetchInvoiceData = async () => {
    try {
      // Fetch invoice details
      const invoiceResponse = await invoiceService.getInvoiceById(id);
      setInvoice(invoiceResponse.data.data);

      // Fetch payment history
      try {
        const historyResponse = await receiptService.getReceiptsByInvoice(id);
        setPaymentHistory(historyResponse.data.data || []);
      } catch (error) {
        console.error('Failed to fetch payment history:', error);
      }

      // Fetch payment info
      try {
        const paymentResponse = await receiptService.getRemainingBalance(id);
        setPaymentInfo(paymentResponse.data.data);
      } catch (error) {
        console.error('Failed to fetch payment info:', error);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!invoice) return <div className="container">Invoice not found</div>;

  const remainingBalance = paymentInfo?.remainingBalance || (invoice.grandTotal - (invoice.totalPaid || 0));
  const totalPaid = paymentInfo?.totalPaid || invoice.totalPaid || 0;

  return (
    <div className="container">
      <div style={{ marginBottom: '20px' }}>
        <button onClick={handlePrint} className="btn btn-primary">
          🖨️ Print Invoice
        </button>
        {remainingBalance > 0 && (
          <button
            onClick={() => navigate(`/receipts/create?invoiceId=${id}`)}
            className="btn btn-success"
            style={{ marginLeft: '10px' }}
          >
            💰 Record Payment
          </button>
        )}
        <button
          onClick={() => navigate('/invoices')}
          className="btn btn-secondary"
          style={{ marginLeft: '10px' }}
        >
          Back to Invoices
        </button>
      </div>

      {/* Payment Status Card */}
      <div
        style={{
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: remainingBalance > 0 ? '#fff3cd' : '#d4edda',
          borderRadius: '6px',
          borderLeft: `4px solid ${remainingBalance > 0 ? '#ff6b6b' : '#27ae60'}`,
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          <div>
            <p style={{ margin: 0, color: '#555', fontSize: '0.9rem' }}>Total Amount</p>
            <h3 style={{ margin: '5px 0 0 0', color: '#2c3e50' }}>{formatCurrency(invoice.grandTotal)}</h3>
          </div>
          <div>
            <p style={{ margin: 0, color: '#555', fontSize: '0.9rem' }}>Total Paid</p>
            <h3 style={{ margin: '5px 0 0 0', color: '#27ae60' }}>{formatCurrency(totalPaid)}</h3>
          </div>
          <div>
            <p style={{ margin: 0, color: '#555', fontSize: '0.9rem' }}>
              {remainingBalance > 0 ? 'Remaining Balance' : 'Status: Paid'}
            </p>
            <h3 style={{ margin: '5px 0 0 0', color: remainingBalance > 0 ? '#e74c3c' : '#27ae60' }}>
              {formatCurrency(remainingBalance)}
            </h3>
          </div>
        </div>
        <p style={{ margin: '10px 0 0 0', fontSize: '0.95rem', fontWeight: 'bold' }}>
          Status: <span className={`badge badge-${invoice.status}`}>{invoice.status.toUpperCase()}</span>
        </p>
      </div>

      {/* Payment History */}
      {paymentHistory.length > 0 && (
        <div
          style={{
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px',
            borderLeft: '4px solid #3498db',
          }}
        >
          <h3>Payment History</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ textAlign: 'left', padding: '8px' }}>Receipt #</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Amount Paid</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Method</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((receipt) => (
                <tr key={receipt._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px' }}>{receipt.receiptNumber}</td>
                  <td style={{ padding: '8px', fontWeight: 'bold', color: '#27ae60' }}>
                    {formatCurrency(receipt.amountPaid)}
                  </td>
                  <td style={{ padding: '8px', textTransform: 'capitalize' }}>{receipt.paymentMethod}</td>
                  <td style={{ padding: '8px' }}>
                    {new Date(receipt.paymentDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div ref={printRef} className="invoice-document">
        <div className="invoice-header">
          <div className="document-logo-wrapper">
            <img src={logo} alt="ERP Logo" className="document-logo" />
            <div>
              <h1 style={{ margin: '0 0 5px 0' }}>INVOICE</h1>
              <p style={{ margin: 0, color: '#7f8c8d' }}>Company Name</p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: '5px 0' }}>
              <strong>Invoice Number:</strong> {invoice.invoiceNumber}
            </p>
            <p style={{ margin: '5px 0' }}>
              <strong>Date:</strong> {new Date(invoice.invoiceDate).toLocaleDateString()}
            </p>
            <p style={{ margin: '5px 0' }}>
              <strong>Status:</strong> <span className={`badge badge-${invoice.status}`}>{invoice.status.toUpperCase()}</span>
            </p>
          </div>
        </div>

        <div className="invoice-body">
          <div className="invoice-section">
            <h3>Bill To</h3>
            <p>{invoice.customerName}</p>
            <p>{invoice.customerEmail}</p>
            <p>{invoice.customerPhone}</p>
            <p>{invoice.deliveryAddress}</p>
          </div>

          <table className="invoice-table">
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
              {invoice.items.map((item, index) => (
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

          <div className="invoice-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="total-row">
              <span>Tax (10%):</span>
              <span>{formatCurrency(invoice.tax)}</span>
            </div>
            <div className="total-row total-grand">
              <span>Grand Total:</span>
              <span>{formatCurrency(invoice.grandTotal)}</span>
            </div>
          </div>

          {invoice.notes && (
            <div className="invoice-notes">
              <h3>Notes</h3>
              <p>{invoice.notes}</p>
            </div>
          )}
        </div>

        <div className="invoice-footer">
          <p>&copy; 2026 ERP Sales Module. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceView;

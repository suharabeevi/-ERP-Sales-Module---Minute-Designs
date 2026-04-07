import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { receiptService, invoiceService } from '../services/api';
import { useApp } from '../context/AppContext';
import Loading from '../components/Loading';
import logo from '../assets/logo.svg';
import './ReceiptView.css';
import { formatCurrency } from '../utils/helpers';

const ReceiptView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setError } = useApp();
  const printRef = React.useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  useEffect(() => {
    fetchReceipt();
  }, [id]);

  const fetchReceipt = async () => {
    try {
      const response = await receiptService.getReceiptById(id);
      setReceipt(response.data.data);
      
      // Fetch related invoice
      if (response.data.data.invoiceId) {
        const invoiceResponse = await invoiceService.getInvoiceById(response.data.data.invoiceId);
        setInvoice(invoiceResponse.data.data);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load receipt');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!receipt) return <div className="container">Receipt not found</div>;

  return (
    <div className="container">
      <div style={{ marginBottom: '20px' }}>
        <button onClick={handlePrint} className="btn btn-primary">
          🖨️ Print Receipt
        </button>
        <button
          onClick={() => navigate('/receipts')}
          className="btn btn-secondary"
          style={{ marginLeft: '10px' }}
        >
          Back to Receipts
        </button>
      </div>

      <div ref={printRef} className="receipt-document">
        <div className="receipt-header">
          <div className="document-logo-wrapper">
            <img src={logo} alt="ERP Logo" className="document-logo" />
            <div>
              <h1 style={{ margin: '0 0 5px 0' }}>RECEIPT</h1>
              <p style={{ margin: 0, color: '#7f8c8d' }}>Payment Confirmation</p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: '5px 0' }}>
              <strong>Receipt Number:</strong> {receipt.receiptNumber}
            </p>
            <p style={{ margin: '5px 0' }}>
              <strong>Date:</strong> {new Date(receipt.paymentDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="receipt-body">
          {invoice && (
            <div className="receipt-section">
              <h3>Invoice Details</h3>
              <p>
                <strong>Invoice Number:</strong> {invoice.invoiceNumber}
              </p>
              <p>
                <strong>Customer:</strong> {invoice.customerName}
              </p>
              <p>
                <strong>Invoice Total:</strong> {formatCurrency(invoice.grandTotal)}
              </p>
              <p>
                <strong>Invoice Status:</strong> <span className={`badge badge-${invoice.status}`}>{invoice.status}</span>
              </p>
            </div>
          )}

          <div className="receipt-section">
            <h3>Payment Information</h3>
            <p>
              <strong>Amount Paid:</strong> <span className="amount">{formatCurrency(receipt.amountPaid)}</span>
            </p>
            <p>
              <strong>Payment Method:</strong> <span className={`badge badge-${receipt.paymentMethod}`}>{receipt.paymentMethod.toUpperCase()}</span>
            </p>
            {receipt.referenceNumber && (
              <p>
                <strong>Reference Number:</strong> {receipt.referenceNumber}
              </p>
            )}
            <p>
              <strong>Payment Date:</strong> {new Date(receipt.paymentDate).toLocaleDateString()}
            </p>
          </div>

          {receipt.notes && (
            <div className="receipt-notes">
              <h3>Notes</h3>
              <p>{receipt.notes}</p>
            </div>
          )}

          <div className="receipt-summary">
            <div className="summary-item">
              <span>Total Invoice Amount:</span>
              <span>{formatCurrency(invoice?.grandTotal || 0)}</span>
            </div>
            <div className="summary-item">
              <span>Amount Paid:</span>
              <span>{formatCurrency(receipt.amountPaid)}</span>
            </div>
            {invoice && (
              <div className="summary-item total">
                <span>Outstanding Amount:</span>
                <span>{formatCurrency(invoice.grandTotal - receipt.amountPaid)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="receipt-footer">
          <p>Thank you for your payment!</p>
          <p>&copy; 2026ERP Sales Module. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default ReceiptView;

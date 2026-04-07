import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { invoiceService } from '../services/api';
import { useApp } from '../context/AppContext';
import Loading from '../components/Loading';
import logo from '../assets/logo.svg';
import './InvoiceView.css';
import { formatCurrency } from '../utils/helpers';

const InvoiceView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setError } = useApp();
  const printRef = React.useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const response = await invoiceService.getInvoiceById(id);
      setInvoice(response.data.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <Loading />;
  if (!invoice) return <div className="container">Invoice not found</div>;

  return (
    <div className="container">
      <div style={{ marginBottom: '20px' }}>
        <button onClick={handlePrint} className="btn btn-primary">
          🖨️ Print Invoice
        </button>
        <button
          onClick={() => navigate('/invoices')}
          className="btn btn-secondary"
          style={{ marginLeft: '10px' }}
        >
          Back to Invoices
        </button>
      </div>

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

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { invoiceService, receiptService } from '../services/api';
import { useApp } from '../context/AppContext';
import Loading from '../components/Loading';
import { formatCurrency } from '../utils/helpers';

const ReceiptForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const invoiceId = searchParams.get('invoiceId');
  const { setError, setSuccess, setLoading } = useApp();
  const [invoice, setInvoice] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [validationError, setValidationError] = useState('');
  const [formData, setFormData] = useState({
    invoiceId: invoiceId || '',
    amountPaid: '',
    paymentMethod: 'cash',
    paymentDate: new Date().toISOString().split('T')[0],
    referenceNumber: '',
    notes: '',
  });

  const fetchInvoiceData = async () => {
    try {
      const response = await invoiceService.getInvoiceById(invoiceId);
      setInvoice(response.data.data);

      // Fetch payment information
      try {
        const balanceResponse = await receiptService.getRemainingBalance(invoiceId);
        setPaymentInfo(balanceResponse.data.data);
      } catch (error) {
        console.error('Failed to fetch balance info:', error);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load invoice');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (invoiceId) {
      fetchInvoiceData();
    } else {
      setIsLoading(false);
    }
  }, [invoiceId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = name === 'amountPaid' ? parseFloat(value) || '' : value;
    
    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));

    // Validate amount against remaining balance
    if (name === 'amountPaid' && paymentInfo) {
      setValidationError('');
      if (parsedValue > paymentInfo.remainingBalance) {
        setValidationError(
          `Amount exceeds remaining balance of ${formatCurrency(paymentInfo.remainingBalance)}`
        );
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.invoiceId || !formData.amountPaid || !formData.paymentMethod) {
      setError('All required fields must be filled');
      return;
    }

    if (validationError) {
      setError(validationError);
      return;
    }

    // Double-check amount doesn't exceed remaining balance
    if (paymentInfo && formData.amountPaid > paymentInfo.remainingBalance) {
      setError(
        `Payment amount exceeds remaining balance of ${formatCurrency(paymentInfo.remainingBalance)}`
      );
      return;
    }

    try {
      setLoading(true);
      await receiptService.createReceipt(formData);
      setSuccess('Receipt created successfully');
      navigate('/receipts');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create receipt');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <Loading />;

  const isInvoicePaid = invoice?.status === 'paid';

  return (
    <div className="container">
      <h2>Create Receipt</h2>

      <div className="card">
        {invoice && (
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f4f8', borderRadius: '6px' }}>
            <h3 style={{ marginTop: 0 }}>{invoice.invoiceNumber}</h3>
            <p>
              <strong>Customer:</strong> {invoice.customerName}
            </p>
            <p>
              <strong>Invoice Total:</strong> {formatCurrency(invoice.grandTotal)}
            </p>
            {paymentInfo && (
              <>
                <p>
                  <strong>Total Paid:</strong> {formatCurrency(paymentInfo.totalPaid)}
                </p>
                <p style={{ color: paymentInfo.remainingBalance > 0 ? '#e74c3c' : '#27ae60', fontWeight: 'bold' }}>
                  <strong>Remaining Balance:</strong> {formatCurrency(paymentInfo.remainingBalance)}
                </p>
              </>
            )}
            <p>
              <strong>Status:</strong> <span className={`badge badge-${invoice.status}`}>{invoice.status}</span>
            </p>
          </div>
        )}

        {isInvoicePaid && (
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#d4edda', borderRadius: '6px', color: '#155724' }}>
            <strong>✓ This invoice is already fully paid. No further payments needed.</strong>
          </div>
        )}

        {!isInvoicePaid && (
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Invoice *</label>
                <select
                  name="invoiceId"
                  value={formData.invoiceId}
                  onChange={handleInputChange}
                  required
                  disabled={!!invoiceId}
                >
                  <option value="">Select Invoice</option>
                  {/* In a real app, fetch all unpaid invoices */}
                </select>
              </div>
              <div className="form-group">
                <label>
                  Amount Paid * {paymentInfo && `(Max: ${formatCurrency(paymentInfo.remainingBalance)})`}
                </label>
                <input
                  type="number"
                  name="amountPaid"
                  value={formData.amountPaid}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  max={paymentInfo?.remainingBalance || undefined}
                  required
                  style={{ borderColor: validationError ? '#e74c3c' : '' }}
                />
                {validationError && (
                  <div style={{ color: '#e74c3c', fontSize: '0.9rem', marginTop: '5px' }}>
                    {validationError}
                  </div>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Payment Method *</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  required
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>
              <div className="form-group">
                <label>Payment Date *</label>
                <input
                  type="date"
                  name="paymentDate"
                  value={formData.paymentDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Reference Number</label>
                <input
                  type="text"
                  name="referenceNumber"
                  value={formData.referenceNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., Check number, transaction ID"
                />
              </div>
            </div>

            <div className="form-row full">
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
              <button type="submit" className="btn btn-primary" disabled={!!validationError}>
                Create Receipt
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/receipts')}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReceiptForm;

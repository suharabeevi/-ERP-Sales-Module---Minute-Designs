import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://erp-sales-module-minute-designs.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Item endpoints
export const itemService = {
  createItem: (data) => api.post('/items', data),
  getAllItems: (filters = {}) => api.get('/items', { params: filters }),
  getItemById: (id) => api.get(`/items/${id}`),
  updateItem: (id, data) => api.put(`/items/${id}`, data),
  deleteItem: (id) => api.delete(`/items/${id}`),
  getItemStock: (id) => api.get(`/items/${id}/stock`),
};

// Sales Order endpoints
export const salesOrderService = {
  createOrder: (data) => api.post('/sales-orders', data),
  getAllOrders: (filters = {}) => api.get('/sales-orders', { params: filters }),
  getOrderById: (id) => api.get(`/sales-orders/${id}`),
  approveOrder: (id) => api.patch(`/sales-orders/${id}/approve`),
  cancelOrder: (id) => api.patch(`/sales-orders/${id}/cancel`),
  updateOrder: (id, data) => api.put(`/sales-orders/${id}`, data),
  deleteOrder: (id) => api.delete(`/sales-orders/${id}`),
};

// Invoice endpoints
export const invoiceService = {
  createInvoice: (data) => api.post('/invoices', data),
  getAllInvoices: (filters = {}) => api.get('/invoices', { params: filters }),
  getInvoiceById: (id) => api.get(`/invoices/${id}`),
  getInvoiceByNumber: (invoiceNumber) => api.get(`/invoices/number/${invoiceNumber}`),
  deleteInvoice: (id) => api.delete(`/invoices/${id}`),
};

// Receipt endpoints
export const receiptService = {
  createReceipt: (data) => api.post('/receipts', data),
  getAllReceipts: (filters = {}) => api.get('/receipts', { params: filters }),
  getReceiptById: (id) => api.get(`/receipts/${id}`),
  getReceiptsByInvoice: (invoiceId) => api.get(`/receipts/invoice/${invoiceId}`),
  getRemainingBalance: (invoiceId) => api.get(`/receipts/balance/${invoiceId}`),
  getTotalPaidForInvoice: (invoiceId) => api.get(`/receipts/payment-info/${invoiceId}`),
  deleteReceipt: (id) => api.delete(`/receipts/${id}`),
};

export default api;

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

export const formatDateTime = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const isValidPhone = (phone) => {
  const re = /^[\d\s\-\+\(\)]+$/;
  return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

export const calculateTotal = (quantity, price) => {
  return (quantity * price).toFixed(2);
};

export const getStatusColor = (status) => {
  const colors = {
    pending: '#f59e0b',
    approved: '#3b82f6',
    invoiced: '#8b5cf6',
    cancelled: '#ef4444',
    unpaid: '#ef4444',
    partial: '#f59e0b',
    paid: '#10b981',
  };
  return colors[status] || '#64748b';
};

export const generatePDF = (invoiceNumber, content) => {
  const element = document.getElementById(content);
  if (!element) return;
  
  const printWindow = window.open('', '', 'height=400,width=600');
  printWindow.document.write('<pre>');
  printWindow.document.write(element.innerHTML);
  printWindow.document.write('</pre>');
  printWindow.document.close();
  printWindow.print();
};

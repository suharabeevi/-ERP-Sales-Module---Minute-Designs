import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Alert from './components/Alert';

// Pages
import ItemList from './pages/ItemList';
import ItemForm from './pages/ItemForm';
import ItemDetail from './pages/ItemDetail';
import SalesOrderList from './pages/SalesOrderList';
import SalesOrderForm from './pages/SalesOrderForm';
import SalesOrderDetail from './pages/SalesOrderDetail';
import InvoiceList from './pages/InvoiceList';
import InvoiceView from './pages/InvoiceView';
import ReceiptForm from './pages/ReceiptForm';
import ReceiptView from './pages/ReceiptView';
import ReceiptList from './pages/ReceiptList';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Navbar />
        <Alert />
        <Routes>
          {/* Home */}
          <Route path="/" element={<Navigate to="/items" replace />} />

          {/* Items */}
          <Route path="/items" element={<ItemList />} />
          <Route path="/items/create" element={<ItemForm />} />
          <Route path="/items/:id" element={<ItemDetail />} />

          {/* Sales Orders */}
          <Route path="/sales-orders" element={<SalesOrderList />} />
          <Route path="/sales-orders/create" element={<SalesOrderForm />} />
          <Route path="/sales-orders/:id" element={<SalesOrderDetail />} />

          {/* Invoices */}
          <Route path="/invoices" element={<InvoiceList />} />
          <Route path="/invoices/:id" element={<InvoiceView />} />

          {/* Receipts */}
          <Route path="/receipts" element={<ReceiptList />} />
          <Route path="/receipts/create" element={<ReceiptForm />} />
          <Route path="/receipts/:id" element={<ReceiptView />} />

          {/* 404 */}
          <Route path="*" element={<div className="container"><h2>Page not found</h2></div>} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;

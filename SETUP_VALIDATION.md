# Setup Validation Checklist

Use this checklist to ensure your ERP Sales Module is properly installed and configured.

## ✅ Prerequisites Check

- [ ] Node.js v14+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] MongoDB installed or Atlas account created
- [ ] Git installed (optional, for version control)
- [ ] Code editor (VS Code, WebStorm, etc.)

## ✅ Backend Setup Validation

### Installation
- [ ] `cd backend` successful
- [ ] `npm install` completed without errors
- [ ] `node_modules` folder created
- [ ] `.env` file created with all required variables:
  - [ ] `MONGODB_URI` set
  - [ ] `PORT=5000` set
  - [ ] `NODE_ENV=development` set
  - [ ] `JWT_SECRET` set

### Database Connection
- [ ] MongoDB service is running:
  - [ ] Local MongoDB: `mongod` service active
  - [ ] OR MongoDB Atlas: Connection string in MONGODB_URI
- [ ] Connection test successful (check console messages)

### Server Startup
- [ ] Run `npm run dev`
- [ ] Terminal shows: "Server running on port 5000"
- [ ] Terminal shows: "MongoDB Connected: ..."
- [ ] No error messages in console
- [ ] Health check works: `curl http://localhost:5000/api/health`

### API Endpoints Test
- [ ] Test GET /api/items
  ```bash
  curl http://localhost:5000/api/items
  ```
  Expected: `{"success":true,"data":[],"count":0}`

- [ ] Test POST /api/items
  ```bash
  curl -X POST http://localhost:5000/api/items \
    -H "Content-Type: application/json" \
    -d '{"name":"Test Item","sku":"TEST001","price":100,"openingStock":10}'
  ```
  Expected: Success response with created item

## ✅ Frontend Setup Validation

### Installation
- [ ] Open new terminal/tab
- [ ] `cd frontend` successful
- [ ] `npm install` completed without errors
- [ ] `node_modules` folder created
- [ ] `.env` file created with:
  - [ ] `REACT_APP_API_URL=http://localhost:5000/api`

### Application Startup
- [ ] Run `npm start`
- [ ] Browser automatically opens to `http://localhost:3000`
- [ ] Page loads without errors
- [ ] Navbar visible with "ERP Sales Module" title
- [ ] Navigation links visible:
  - [ ] Items
  - [ ] Sales Orders
  - [ ] Invoices
  - [ ] Receipts

### Page Navigation
- [ ] Click "Items" → ItemList page loads
- [ ] Click "Sales Orders" → SalesOrderList page loads
- [ ] Click "Invoices" → InvoiceList page loads
- [ ] Click "Receipts" → ReceiptList page loads

## ✅ Functionality Test Workflow

### 1. Create Item
- [ ] Navigate to Items page
- [ ] Click "+ Create Item" button
- [ ] Fill form:
  - [ ] Item Name: "Laptop"
  - [ ] SKU: "LT001"
  - [ ] Price: "1000"
  - [ ] Opening Stock: "10"
- [ ] Click "Create Item"
- [ ] Success message appears
- [ ] Item appears in Items list
- [ ] Stock shows "10"

### 2. Create Sales Order
- [ ] Navigate to Sales Orders page
- [ ] Click "+ New Order" button
- [ ] Fill form:
  - [ ] Customer Name: "John Doe"
  - [ ] Add Item: Select "Laptop"
  - [ ] Quantity: "2"
- [ ] Click "Create Order"
- [ ] Success message appears
- [ ] Order appears in list with "pending" status

### 3. Approve Order
- [ ] Click "View" on the created order
- [ ] Click "Approve Order" button
- [ ] Success message appears
- [ ] Status changes to "approved"
- [ ] "Create Invoice" button now available

### 4. Generate Invoice
- [ ] Click "Create Invoice" button
- [ ] Success message appears
- [ ] Redirected to Invoices page
- [ ] New invoice appears in list
- [ ] Check Items page:
  - [ ] Laptop stock reduced to 8

### 5. Record Payment
- [ ] Go to Invoices page
- [ ] Click "Receipt" on invoice
- [ ] Fill receipt form:
  - [ ] Amount Paid: "1100"
  - [ ] Payment Method: "cash"
- [ ] Click "Create Receipt"
- [ ] Success message appears
- [ ] Redirected to Receipts page
- [ ] Receipt appears in list

### 6. Verify Invoice Status Updated
- [ ] Go to Invoices page
- [ ] Invoice status changed to "partial" or "paid"
- [ ] View invoice details

### 7. Print Functionality
- [ ] View Invoice/Receipt
- [ ] Click "Print Invoice" or "Print Receipt"
- [ ] Print preview opens
- [ ] Document shows:
  - [ ] Professional header
  - [ ] Company information
  - [ ] Item details with table
  - [ ] Subtotal, Tax, Total
  - [ ] Customer information

## ✅ Error Handling Tests

- [ ] Create item with duplicate SKU (should fail)
- [ ] Create order with quantity exceeding stock (should fail)
- [ ] Delete invoice with payment (should fail)
- [ ] Search functionality works
- [ ] Filter by status works

## ✅ Browser Console Check

- [ ] Open Developer Tools (F12)
- [ ] Check Console tab
- [ ] No error messages (warnings ok)
- [ ] No CORS errors
- [ ] Network tab shows API calls succeeding (200/201)

## ✅ Responsive Design Check

- [ ] Open browser DevTools (F12)
- [ ] Toggle device toolbar
- [ ] Test on mobile (375px)
  - [ ] Navbar responsive
  - [ ] Forms stack properly
  - [ ] Tables scrollable
  - [ ] Buttons accessible
- [ ] Test on tablet (768px)
  - [ ] Layout proper
  - [ ] All content visible

## ✅ Data Persistence Check

- [ ] Create an item
- [ ] Close browser
- [ ] Reopen http://localhost:3000
- [ ] Item still exists (MongoDB persistence)

## ✅ File Structure Verification

### Backend
- [ ] `/backend/index.js` exists
- [ ] `/backend/package.json` exists
- [ ] `/backend/models/` contains all 4 files
- [ ] `/backend/controllers/` contains all 4 files
- [ ] `/backend/services/` contains all 4 files
- [ ] `/backend/routes/` contains all 4 files
- [ ] `/backend/config/database.js` exists
- [ ] `/backend/middleware/errorHandler.js` exists

### Frontend
- [ ] `/frontend/package.json` exists
- [ ] `/frontend/src/App.js` exists
- [ ] `/frontend/src/index.js` exists
- [ ] `/frontend/src/pages/` contains 13 files
- [ ] `/frontend/src/components/` contains 5 files
- [ ] `/frontend/src/services/api.js` exists
- [ ] `/frontend/src/context/AppContext.js` exists
- [ ] `/frontend/public/index.html` exists
- [ ] `/frontend/public/index.css` exists

## ✅ Configuration Files

- [ ] Backend `.env` file properly configured
- [ ] Frontend `.env` file properly configured
- [ ] Database connection string valid
- [ ] API URL correct (http://localhost:5000/api)

## ✅ Terminal Output Examples

### Backend Startup (Expected)
```
npm run dev

> erp-sales-module-backend@1.0.0 dev
> nodemon index.js

[nodemon] 2.x.x
Server running on port 5000
MongoDB Connected: localhost
```

### Frontend Startup (Expected)
```
npm start

webpack compiled successfully
Local:   http://localhost:3000
```

## 🔧 Troubleshooting

If any check fails, see troubleshooting section in README.md:

**Common Issues:**
1. MongoDB connection fails → Check mongod is running
2. Port 5000 in use → Change PORT in .env
3. API not responding → Verify backend running
4. CORS errors → Check REACT_APP_API_URL
5. Blank page → Check browser console for errors

## 📝 Notes

- Document any deviations from expected behavior
- Test all features before deployment
- Keep .env files secure (never commit to git)
- Ensure both backend and frontend running during testing

## ✅ Final Validation

- [ ] All checks above passed
- [ ] Complete workflow tested
- [ ] No console errors
- [ ] Print functionality working
- [ ] Data persists across sessions
- [ ] Application ready for use

---

**Validation Complete:** ✅

**Date:** _______________

**Tested By:** _______________

**Notes:** _________________________

---

For detailed documentation, see README.md and API_DOCUMENTATION.md

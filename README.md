# ERP Sales Module - MERN Stack

A complete ERP Sales Management System built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

### 1. Item Management
- Create items with unique SKU codes
- Set item prices and opening stock
- Track current stock levels
- Automatic stock updates based on sales

### 2. Sales Order Management
- Create sales orders with multiple items
- Add customer information and delivery address
- Apply approval workflow
- Calculate totals with automatic tax calculation (10%)
- Order status tracking: Pending, Approved, Invoiced, Cancelled

### 3. Sales Invoice Generation
- Convert approved sales orders to invoices
- Automatic stock reduction
- Invoice tracking and management
- Multiple invoice status: Unpaid, Partial, Paid

### 4. Receipt Entry
- Record payments against invoices
- Multiple payment methods: Cash, Card, Bank Transfer
- Automatic invoice status updates
- Track payment references

### 5. Stock Management
- Automatic inventory control
- Prevent overselling
- Real-time stock availability checks
- Stock deduction on invoice generation

### 6. Print Functionality
- Professional A4 layout invoices
- Receipt printing with payment details
- Company header and footer
- Print-ready CSS styling

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (Local or Atlas)
- npm or yarn

### Backend Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Create .env file:**
   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables in .env:**
   ```
   MONGODB_URI=mongodb://localhost:27017/erp-sales-module
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_secret_key_here
   ```

4. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

5. **Start the server:**
   ```bash
   npm run dev
   ```
   The API will run on `http://localhost:5000`

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Create .env file:**
   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables in .env:**
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start the React application:**
   ```bash
   npm start
   ```
   The app will run on `http://localhost:3000`

## API Endpoints

### Items
- `POST /api/items` - Create item
- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get item by ID
- `GET /api/items/:id/stock` - Get item stock
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

### Sales Orders
- `POST /api/sales-orders` - Create sales order
- `GET /api/sales-orders` - Get all sales orders
- `GET /api/sales-orders/:id` - Get sales order by ID
- `PATCH /api/sales-orders/:id/approve` - Approve sales order
- `PATCH /api/sales-orders/:id/cancel` - Cancel sales order
- `PUT /api/sales-orders/:id` - Update sales order
- `DELETE /api/sales-orders/:id` - Delete sales order

### Invoices
- `POST /api/invoices` - Create invoice from sales order
- `GET /api/invoices` - Get all invoices
- `GET /api/invoices/:id` - Get invoice by ID
- `GET /api/invoices/number/:invoiceNumber` - Get invoice by number
- `DELETE /api/invoices/:id` - Delete invoice

### Receipts
- `POST /api/receipts` - Create receipt
- `GET /api/receipts` - Get all receipts
- `GET /api/receipts/:id` - Get receipt by ID
- `GET /api/receipts/invoice/:invoiceId` - Get receipts for invoice
- `DELETE /api/receipts/:id` - Delete receipt

## Workflow

1. **Create Items**: Start by creating inventory items with SKU and prices
2. **Create Sales Order**: Create orders by selecting items and quantities
3. **Approve Order**: Approve pending orders to proceed
4. **Generate Invoice**: Convert approved orders to invoices (automatically reduces stock)
5. **Record Receipt**: Enter payment details against invoices
6. **Print Documents**: Print invoices and receipts for records

## Database Schema

### Item
```javascript
{
  name: String,
  sku: String (unique),
  price: Number,
  openingStock: Number,
  currentStock: Number,
  description: String,
  status: String (active/inactive),
  timestamps
}
```

### SalesOrder
```javascript
{
  orderNumber: String (unique),
  items: [{
    itemId: ObjectId,
    quantity: Number,
    price: Number,
    total: Number
  }],
  subtotal: Number,
  tax: Number,
  grandTotal: Number,
  status: String (pending/approved/invoiced/cancelled),
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  deliveryAddress: String,
  notes: String,
  timestamps
}
```

### Invoice
```javascript
{
  invoiceNumber: String (unique),
  salesOrderId: ObjectId,
  items: [...],
  subtotal: Number,
  tax: Number,
  grandTotal: Number,
  status: String (unpaid/partial/paid),
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  invoiceDate: Date,
  dueDate: Date,
  timestamps
}
```

### Receipt
```javascript
{
  receiptNumber: String (unique),
  invoiceId: ObjectId,
  amountPaid: Number,
  paymentMethod: String (cash/card/bank),
  paymentDate: Date,
  referenceNumber: String,
  notes: String,
  timestamps
}
```

## Key Features Implementation

### Stock Management
- Opening stock is set when creating an item
- Current stock is automatically updated
- Stock is reduced when invoice is generated
- System prevents selling more than available stock

### Approval Workflow
- Sales orders start in "Pending" status
- Must be approved before invoicing
- Only approved orders can be converted to invoices
- Approved orders show approval button disabled

### Tax Calculation
- 10% tax is automatically calculated
- Applied to all sales orders and invoices
- Calculated as: tax = subtotal * 0.1

### Invoice Status Updates
- Status updates based on payment receipts
- Unpaid: No payments received
- Partial: Some payment received
- Paid: Full payment received

### Print Functionality
- Uses react-to-print library
- Professional A4 layout
- Company header and footer
- Table borders and proper formatting
- Page numbers and dates

## Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - Database ODM
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment configuration

### Frontend
- **React 18** - UI library
- **React Router DOM v6** - Routing
- **Axios** - HTTP client
- **React-to-Print** - Print functionality
- **CSS3** - Styling

## Error Handling

- Comprehensive input validation
- Duplicate SKU prevention
- Stock availability checks
- Order status validation
- Proper HTTP status codes
- User-friendly error messages


## Testing the Application

### Sample Flow

1. **Create Items**
   - Go to Items page
   - Click "Create Item"
   - Add: Name: "Laptop", SKU: "LT001", Price: 1000, Opening Stock: 10

2. **Create Sales Order**
   - Go to Sales Orders
   - Click "New Order"
   - Add customer info
   - Select "Laptop", quantity: 2
   - Click "Create Order"

3. **Approve Order**
   - Click "Approve" button on the order
   - Status changes to "Approved"

4. **Generate Invoice**
   - Click "Invoice" button
   - Invoice is created
   - Stock automatically reduced

5. **Record Payment**
   - Go to Invoices
   - Click "Receipt" on the invoice
   - Enter payment amount and method
   - Invoice status updates

6. **Print Documents**
   - Click "Print Invoice" or "Print Receipt"
   - Opens print dialog

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify database permissions

### API Connection Issues
- Ensure backend is running on port 5000
- Check REACT_APP_API_URL in frontend .env
- Check browser console for CORS errors

### Stock Issues
- Verify opening stock was set correctly
- Check all stock reduction operations
- Review invoice creation logs


**Version:** 1.0.0  
**Last Updated:** April 2026

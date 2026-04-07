# ERP Sales Module - Quick Start Guide

## Get Started in 5 Minutes

### Step 1: Clone/Download the Project
Already in `d:\Minute Designs Task`

### Step 2: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
# On Windows:
copy .env.example .env

# Or manually create .env with:
MONGODB_URI=mongodb://localhost:27017/erp-sales-module
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key_here
```

**Make sure MongoDB is running!**

```bash
# Start the backend server
npm run dev

# You should see: "Server running on port 5000"
# And: "MongoDB Connected: ..."
```

### Step 3: Setup Frontend (New Terminal)

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
# On Windows:
copy .env.example .env

# Or manually create .env with:
REACT_APP_API_URL=http://localhost:5000/api

# Start the React app
npm start

# Opens http://localhost:3000 automatically
```

## Test the Application

### 1. Create an Item
- Navigate to **Items** menu
- Click **+ Create Item**
- Fill in:
  - Item Name: `Laptop`
  - SKU: `LT001`
  - Price: `1000`
  - Opening Stock: `10`
- Click **Create Item**

### 2. Create a Sales Order
- Navigate to **Sales Orders**
- Click **+ New Order**
- Fill in customer info (optional)
- Add Item: Select "Laptop", Quantity: `2`
- Click **Create Order**

### 3. Approve & Invoice
- Click **Approve** button
- Once approved, click **Invoice**
- Invoice is generated, stock reduces to 8

### 4. Record Payment
- Go to **Invoices**
- Click **Receipt** button
- Enter amount and payment method
- Invoice status changes to "Partial" or "Paid"

### 5. Print Documents
- View Invoice/Receipt and click **Print Invoice/Receipt**
- Print preview opens

## Port Information

- **Backend API**: http://localhost:5000/api
- **Frontend App**: http://localhost:3000
- **MongoDB**: localhost:27017 (default)

## Common Commands

### Backend
```bash
npm run dev      # Start with auto-reload
npm start        # Start server
npm test         # Run tests
```

### Frontend
```bash
npm start        # Start dev server
npm build        # Build for production
npm test         # Run tests
```

## File Structure Quick Reference

```
Backend (Node.js + Express)
├── Models     → Database schemas
├── Controllers → Request handlers
├── Services   → Business logic
├── Routes     → API endpoints
└── index.js   → Main server

Frontend (React)
├── Pages       → Full page components
├── Components  → Reusable components
├── Services    → API calls
├── Context     → State management
├── Utils       → Helper functions
└── App.js      → Main app component
```

## Important Notes

1. **MongoDB Required**: Install MongoDB Community Edition or use MongoDB Atlas cloud
2. **Node Version**: Ensure Node.js v14+ is installed
3. **Port Conflicts**: If ports 5000 or 3000 are in use, update the config
4. **CORS**: Backend allows requests from localhost:3000

## Troubleshooting

### "MongoDB connection failed"
- Ensure MongoDB is running
- Check MONGODB_URI in backend .env

### "Cannot GET /api/items"
- Ensure backend is running on port 5000
- Check terminal for backend startup message

### Page shows blank
- Check browser console (F12) for errors
- Ensure frontend .env has correct API_URL

### Stock not reducing
- Verify order is "Approved" before creating invoice
- Check if invoice was created successfully

## Next Steps

1. Review the complete README.md for detailed documentation
2. Explore backend API endpoints
3. Customize company information in print views
4. Add authentication for production
5. Deploy to production server

---

Need help? Check the main README.md or backend/models for schema details.

import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src={logo} alt="ERP Logo" className="navbar-logo" />
        <div>
          <h1>ERP Sales Module</h1>
        </div>
      </div>
      <ul className="navbar-menu">
        <li>
          <Link to="/items">Items</Link>
        </li>
        <li>
          <Link to="/sales-orders">Sales Orders</Link>
        </li>
        <li>
          <Link to="/invoices">Invoices</Link>
        </li>
        <li>
          <Link to="/receipts">Receipts</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

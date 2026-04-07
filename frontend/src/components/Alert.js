import React from 'react';
import { useApp } from '../context/AppContext';
import './Alert.css';

const Alert = () => {
  const { error, success } = useApp();

  if (error) {
    return <div className="alert alert-error">❌ {error}</div>;
  }

  if (success) {
    return <div className="alert alert-success">✓ {success}</div>;
  }

  return null;
};

export default Alert;

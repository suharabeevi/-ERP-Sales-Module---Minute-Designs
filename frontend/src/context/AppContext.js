import React, { createContext, useState, useCallback } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const setLoadingState = useCallback((state) => {
    setLoading(state);
  }, []);

  const setErrorMessage = useCallback((message) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  }, []);

  const setSuccessMessage = useCallback((message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 5000);
  }, []);

  return (
    <AppContext.Provider
      value={{
        loading,
        error,
        success,
        setLoading: setLoadingState,
        setError: setErrorMessage,
        setSuccess: setSuccessMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

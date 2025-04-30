import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const AuthRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem('token');
    
    if (!token) {
      setIsAuthenticated(false);
    }
    
    setIsLoading(false);
  }, []);
  
  if (isLoading) {
    // Return a loading state while checking authentication
    return <div className="flex items-center justify-center h-screen">
      <p className="text-gray-500">Verifying authentication...</p>
    </div>;
  }
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  // Render the protected route content if authenticated
  return children;
};

export default AuthRoute;
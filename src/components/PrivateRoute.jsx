import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { FaSpinner } from 'react-icons/fa';

const PrivateRoute = ({ element }) => {
  const { isAuthenticated, loading, refreshToken } = useAuth();
  const location = useLocation();
  const [isRefreshing, setIsRefreshing] = useState(false);


  useEffect(() => {
    const handleRefresh = async () => {
      if (!isAuthenticated && localStorage.getItem('refresh_token')) {
        setIsRefreshing(true);
        try {
          await refreshToken();
        } catch (error) {
          console.error('Token refresh failed:', error);
           
       
        } finally {
          setIsRefreshing(false);
        }
      }
    };

    handleRefresh();
  }, [isAuthenticated, refreshToken]);

  if (loading || isRefreshing) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="text-4xl animate-spin" />
      </div>
    );
  }

  return isAuthenticated ? element : <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
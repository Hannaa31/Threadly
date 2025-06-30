
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { useState } from 'react';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
  const {user,fetchUser} = useContext(ShopContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      await fetchUser(); // ensures /getuser runs
      setLoading(false);
    };
    verify();
  }, []);

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

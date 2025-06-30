import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import {backendUrl} from '../App'

const AdminProtectedRoute = ({ children }) => {
  const [isVerified, setIsVerified] = useState(null); // null = checking

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const res = await axios.get(backendUrl+'api/user/verify-admin', {
          withCredentials: true,
        });
        setIsVerified(res.data.success);
      } catch (err) {
        setIsVerified(false);
      }
    };
    verifyAdmin();
  }, []);

  if (isVerified === null) return null; // or a loader
  if (!isVerified) return <Navigate to="/admin" replace />;
  return children;
};

export default AdminProtectedRoute;

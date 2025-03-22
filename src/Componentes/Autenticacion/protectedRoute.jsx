// protectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading, hasRole, isAuthenticated } = useAuth();
  const location = useLocation();

  // Mostrar spinner mientras se verifica la autenticación
  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  // Si no está autenticado, redirigir a la página de error de autenticación
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={`/error-auth?type=auth&from=${encodeURIComponent(location.pathname)}`} 
        replace 
      />
    );
  }

  // Si requiere un rol específico y el usuario no lo tiene
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <Navigate 
        to={`/error-auth?type=permission&from=${encodeURIComponent(location.pathname)}`} 
        replace 
      />
    );
  }

  return children;
};

export default ProtectedRoute;
// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Crear contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Verificar autenticación al cargar
  useEffect(() => {
    const verificarAutenticacion = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/verificar-auth', {
          withCredentials: true, // Importante para enviar cookies en la solicitud
        });
        
        if (response.data.autenticado) {
          setUser({
            correo: response.data.user,
            tipo: response.data.tipo
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verificarAutenticacion();
  }, []);

  // Función de login
  const login = async (correo, password, captchaValue) => {
    try {
      const response = await axios.post(
        'http://localhost:3001/api/login',
        { correo, password, captchaValue },
        { withCredentials: true }
      );

      setUser({
        correo: response.data.user,
        tipo: response.data.tipo
      });

      return { success: true, tipo: response.data.tipo };
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al iniciar sesión'
      };
    }
  };

  // Función de logout
  const logout = async () => {
    try {
      await axios.post('http://localhost:3001/api/logout', {}, {
        withCredentials: true
      });
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Verificar si el usuario tiene el rol necesario
  const hasRole = (requiredRole) => {
    if (!user) return false;
    return user.tipo === requiredRole;
  };

  // Valores que expondrá el contexto
  const value = {
    user,
    loading,
    login,
    logout,
    hasRole,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
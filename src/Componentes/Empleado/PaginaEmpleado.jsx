import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Iconos
import InventoryIcon from '@mui/icons-material/Inventory';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

/**
 * Página principal del panel administrativo
 * Muestra módulos principales y accesos rápidos basados en las rutas existentes
 */
const PaginaEmpleado = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <Box sx={{ p: 4, bgcolor: '#f9f9f9', minHeight: 'calc(100vh - 64px)' }}>
      {/* Banner de bienvenida */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 3, 
          background: 'linear-gradient(120deg, #1E88E5, #1565C0)',
          color: 'white'
        }}
      >
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Bienvenido al Sistema de Gislive Boutique
        </Typography>
        <Typography variant="subtitle1">
          Administre su negocio de manera eficiente con nuestras herramientas intuitivas.
        </Typography>
      </Paper>
      
      {/* Título de Módulos Principales */}
      <Typography 
        variant="h5" 
        component="h1" 
        sx={{ 
          fontWeight: 'bold', 
          mb: 3, 
          color: '#333'
        }}
      >
        Módulos Principales
      </Typography>

      {/* Tarjetas de módulos principales */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {/* Módulo de Productos */}
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              bgcolor: '#1E88E5', 
              color: 'white', 
              borderRadius: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
            elevation={0}
          >
            <Box sx={{ p: 3, flexGrow: 1 }}>
              <Box 
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.2)', 
                  borderRadius: '50%', 
                  width: 60, 
                  height: 60, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mb: 2
                }}
              >
                <InventoryIcon sx={{ fontSize: 30 }} />
              </Box>
              <Typography variant="h5" component="h2" fontWeight="medium" gutterBottom>
                Productos
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                Gestiona tu inventario, categorías y características de productos.
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              fullWidth
              onClick={() => handleNavigate('/admin/Productosadmin')}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                py: 1.5,
                borderRadius: 0,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.25)',
                }
              }}
            >
              Gestionar Productos
            </Button>
          </Paper>
        </Grid>

        {/* Módulo de Gestión de Ventas */}
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              bgcolor: '#4CAF50', 
              color: 'white', 
              borderRadius: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
            elevation={0}
          >
            <Box sx={{ p: 3, flexGrow: 1 }}>
              <Box 
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.2)', 
                  borderRadius: '50%', 
                  width: 60, 
                  height: 60, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mb: 2
                }}
              >
                <AttachMoneyIcon sx={{ fontSize: 30 }} />
              </Box>
              <Typography variant="h5" component="h2" fontWeight="medium" gutterBottom>
                Gestión de Ventas
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                Administra pedidos, facturación y seguimiento de ventas de tu tienda.
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              fullWidth
              onClick={() => handleNavigate('/admin/ventas')}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                py: 1.5,
                borderRadius: 0,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.25)',
                }
              }}
            >
              Gestionar Ventas
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PaginaEmpleado;
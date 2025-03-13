import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Iconos
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import StyleIcon from '@mui/icons-material/Style';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BusinessIcon from '@mui/icons-material/Business';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GavelIcon from '@mui/icons-material/Gavel';

/**
 * Página principal del panel administrativo
 * Muestra módulos principales y accesos rápidos basados en las rutas existentes
 */
const PaginaAdministrativa = () => {
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

        {/* Módulo de Soporte */}
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              bgcolor: '#FFA000', 
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
                <ContactMailIcon sx={{ fontSize: 30 }} />
              </Box>
              <Typography variant="h5" component="h2" fontWeight="medium" gutterBottom>
                Soporte
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                Gestiona la comunicación con clientes y preguntas frecuentes.
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              fullWidth
              onClick={() => handleNavigate('/admin/contactanosadmin')}
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
              Administrar Soporte
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Título de Accesos Rápidos */}
      <Typography 
        variant="h5" 
        component="h2" 
        sx={{ 
          fontWeight: 'bold', 
          mb: 3, 
          color: '#333' 
        }}
      >
        Accesos Rápidos
      </Typography>

      {/* Accesos rápidos */}
      <Grid container spacing={2}>
        {/* Reportes */}
        <Grid item xs={6} sm={4} md={2}>
          <Paper 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              cursor: 'pointer',
              height: '100%',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 3
              }
            }}
            onClick={() => handleNavigate('/admin/reportes')}
          >
            <IconButton 
              sx={{ 
                mb: 1, 
                color: '#757575',
                bgcolor: '#f5f5f5'
              }}
            >
              <AssessmentIcon />
            </IconButton>
            <Typography variant="subtitle2" align="center">
              Reportes
            </Typography>
            <Typography variant="caption" align="center" color="text.secondary">
              Genera informes y reportes.
            </Typography>
          </Paper>
        </Grid>

        {/* Categorías */}
        <Grid item xs={6} sm={4} md={2}>
          <Paper 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              cursor: 'pointer',
              height: '100%',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 3
              }
            }}
            onClick={() => handleNavigate('/admin/categorias')}
          >
            <IconButton 
              sx={{ 
                mb: 1, 
                color: '#757575',
                bgcolor: '#f5f5f5'
              }}
            >
              <CategoryIcon />
            </IconButton>
            <Typography variant="subtitle2" align="center">
              Categorías
            </Typography>
            <Typography variant="caption" align="center" color="text.secondary">
              Organiza tus productos.
            </Typography>
          </Paper>
        </Grid>

        {/* Colores */}
        <Grid item xs={6} sm={4} md={2}>
          <Paper 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              cursor: 'pointer',
              height: '100%',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 3
              }
            }}
            onClick={() => handleNavigate('/admin/colores')}
          >
            <IconButton 
              sx={{ 
                mb: 1, 
                color: '#757575',
                bgcolor: '#f5f5f5'
              }}
            >
              <StyleIcon />
            </IconButton>
            <Typography variant="subtitle2" align="center">
              Colores
            </Typography>
            <Typography variant="caption" align="center" color="text.secondary">
              Administra los colores.
            </Typography>
          </Paper>
        </Grid>

        {/* Configuración */}
        <Grid item xs={6} sm={4} md={2}>
          <Paper 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              cursor: 'pointer',
              height: '100%',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 3
              }
            }}
            onClick={() => handleNavigate('/admin/perfil')}
          >
            <IconButton 
              sx={{ 
                mb: 1, 
                color: '#757575',
                bgcolor: '#f5f5f5'
              }}
            >
              <BusinessIcon />
            </IconButton>
            <Typography variant="subtitle2" align="center">
              Perfil de Empresa
            </Typography>
            <Typography variant="caption" align="center" color="text.secondary">
              Configura tu negocio.
            </Typography>
          </Paper>
        </Grid>

        {/* Términos */}
        <Grid item xs={6} sm={4} md={2}>
          <Paper 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              cursor: 'pointer',
              height: '100%',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 3
              }
            }}
            onClick={() => handleNavigate('/admin/terminos')}
          >
            <IconButton 
              sx={{ 
                mb: 1, 
                color: '#757575',
                bgcolor: '#f5f5f5'
              }}
            >
              <GavelIcon />
            </IconButton>
            <Typography variant="subtitle2" align="center">
              Términos
            </Typography>
            <Typography variant="caption" align="center" color="text.secondary">
              Términos y condiciones.
            </Typography>
          </Paper>
        </Grid>

        {/* FAQs */}
        <Grid item xs={6} sm={4} md={2}>
          <Paper 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              cursor: 'pointer',
              height: '100%',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 3
              }
            }}
            onClick={() => handleNavigate('/admin/faqsadmin')}
          >
            <IconButton 
              sx={{ 
                mb: 1, 
                color: '#757575',
                bgcolor: '#f5f5f5'
              }}
            >
              <HelpOutlineIcon />
            </IconButton>
            <Typography variant="subtitle2" align="center">
              FAQs
            </Typography>
            <Typography variant="caption" align="center" color="text.secondary">
              Preguntas frecuentes.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PaginaAdministrativa;
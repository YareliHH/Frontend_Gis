import React, { useState, useRef, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Box,
  Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import StoreIcon from '@mui/icons-material/Store';
import InfoIcon from '@mui/icons-material/Info';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'; // Icono para categorías
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import logo from '../imagenes/LogoGL.jpg';

// Creación del tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#1E90FF', // Azul primario
    },
    secondary: {
      main: '#4682B4', // Azul intermedio (para resaltar)
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #1E90FF 30%, #4682B4 90%)', // Degradado azul
          boxShadow: '0 3px 5px 2px rgba(30, 144, 255, .3)', // Sombra ligera
        },
      },
    },
  },
});

const EncabezadoAdministrativo = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorCategoryEl, setAnchorCategoryEl] = useState(null); // Menú para categorías
  const [active, setActive] = useState('inicio');
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCategoryMenuOpen = (event) => {
    setAnchorCategoryEl(event.currentTarget);
  };

  const handleCategoryMenuClose = () => {
    setAnchorCategoryEl(null);
  };

  const handleClick = (option) => {
    setActive(option);
    handleMenuClose();
  };

  const handleMenuClick = (key) => {
    switch (key) {
      case 'politicas':
        navigate('/admin/politicas');
        break;
      case 'terminos':
        navigate('/admin/terminos');
        break;
      case 'perfil':
        navigate('/admin/perfil');
        break;
      case 'deslinde':
        navigate('/admin/deslinde');
        break;
      case 'redesSociales':
        navigate('/admin/redesSociales');
        break;
      case 'cerrarSesion':
        console.log('Cerrando sesión...');
        navigate('/');
        break;
      default:
        console.log('No se reconoce la acción del menú');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        handleMenuClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
            <img
              src={logo}
              alt="Gislive Boutique Clínica"
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                marginRight: 16,
              }}
            />
            <Typography variant="h6">Gislive Boutique Clínica</Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button
              color="inherit"
              startIcon={<AccountCircleIcon />}
              onClick={() => {
                handleClick('perfil');
                handleMenuClick('perfil');
              }}
              sx={{ color: active === 'perfil' ? '#B0C4DE' : '#FFFFFF' }}
            >
              Perfil de Empresa
            </Button>
            <Button
              color="inherit"
              startIcon={<MoreHorizIcon />}
              onClick={handleCategoryMenuOpen} // Abrir menú de categorías
              sx={{ color: '#FFFFFF' }}
            >
              Categorías
            </Button>
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={() => {
                handleClick('cerrarSesion');
                handleMenuClick('cerrarSesion');
              }}
              sx={{ color: active === 'cerrarSesion' ? '#B0C4DE' : '#FFFFFF' }}
            >
              Cerrar sesión
            </Button>
          </Box>

          {/* Menú de Categorías */}
          <Menu
            id="menu-category"
            anchorEl={anchorCategoryEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorCategoryEl)}
            onClose={handleCategoryMenuClose}
          >
            <MenuItem
              onClick={() => {
                handleClick('politicas');
                handleMenuClick('politicas');
                handleCategoryMenuClose();
              }}
            >
              <StoreIcon sx={{ marginRight: 1 }} /> Políticas
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClick('terminos');
                handleMenuClick('terminos');
                handleCategoryMenuClose();
              }}
            >
              <InfoIcon sx={{ marginRight: 1 }} /> Términos
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClick('deslinde');
                handleMenuClick('deslinde');
                handleCategoryMenuClose();
              }}
            >
              <AccountCircleIcon sx={{ marginRight: 1 }} /> Deslinde Legal
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClick('redesSociales');
                handleMenuClick('redesSociales');
                handleCategoryMenuClose();
              }}
            >
              <InfoIcon sx={{ marginRight: 1 }} /> Redes Sociales
            </MenuItem>
          </Menu>

          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>
          </Box>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={() => {
                handleClick('perfil');
                handleMenuClick('perfil');
              }}
            >
              <AccountCircleIcon sx={{ marginRight: 1 }} /> Perfil
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClick('cerrarSesion');
                handleMenuClick('cerrarSesion');
              }}
            >
              <LogoutIcon sx={{ marginRight: 1 }} /> Cerrar sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default EncabezadoAdministrativo;

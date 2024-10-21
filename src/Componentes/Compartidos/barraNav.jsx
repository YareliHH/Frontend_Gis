import React, { useState, useRef, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, Box, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import StoreIcon from '@mui/icons-material/Store';
import InfoIcon from '@mui/icons-material/Info';
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import logo from '../imagenes/logoGL.jpg';

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

const BarraNav = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [active, setActive] = useState('inicio');
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (option) => {
    setActive(option);
    handleMenuClose();
  };

  const handleMenuClick = (key) => {
    switch (key) {
      case 'usuarios':
        navigate('/admin/usuarios');
        break;
      case 'productos':
        navigate('/admin/productos');
        break;
      case 'quienesSomos':
        navigate('/admin/informacion/lista-quienes-somos');
        break;
      case 'login':
        navigate('/login');
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
            <img src={logo} alt="Gislive Boutique Clínica" style={{ width: 80, height: 60, marginRight: 16 }} />
            <Typography variant="h6">Gislive Boutique Clínica</Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button
              color="inherit"
              startIcon={<StoreIcon />}
              onClick={() => {
                handleClick('productos');
                handleMenuClick('productos');
              }}
              sx={{ color: active === 'productos' ? '#B0C4DE' : '#FFFFFF' }}
            >
              Productos
            </Button>
            <Button
              color="inherit"
              startIcon={<InfoIcon />}
              onClick={() => {
                handleClick('informacion');
                handleMenuClick('quienesSomos');
              }}
              sx={{ color: active === 'informacion' ? '#B0C4DE' : '#FFFFFF' }}
            >
              Sobre nosotros
            </Button>
            <Button
              color="inherit"
              startIcon={<LoginIcon />}
              onClick={() => {
                handleClick('login');
                handleMenuClick('login');
              }}
              sx={{ color: active === 'login' ? '#B0C4DE' : '#FFFFFF' }}
            >
              Iniciar sesión
            </Button>
          </Box>

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
                handleClick('usuarios');
                handleMenuClick('usuarios');
              }}
            >
              <AccountCircleIcon sx={{ marginRight: 1 }} /> Usuario
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClick('productos');
                handleMenuClick('productos');
              }}
            >
              <StoreIcon sx={{ marginRight: 1 }} /> Productos
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClick('informacion');
                handleMenuClick('quienesSomos');
              }}
            >
              <InfoIcon sx={{ marginRight: 1 }} /> Sobre nosotros
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClick('login');
                handleMenuClick('login');
              }}
            >
              <LoginIcon sx={{ marginRight: 1 }} /> Iniciar sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default BarraNav;

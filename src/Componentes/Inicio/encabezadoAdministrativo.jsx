import React, { useState, useRef, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, Box, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import StoreIcon from '@mui/icons-material/Store';
import InfoIcon from '@mui/icons-material/Info';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
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
            <img src={logo} alt="Gislive Boutique Clínica" style={{ width: 80, height: 60, marginRight: 16 }} />
            <Typography variant="h6">Gislive Boutique Clínica</Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button
              color="inherit"
              startIcon={<StoreIcon />}
              onClick={() => {
                handleClick('politicas');
                handleMenuClick('politicas');
              }}
              sx={{ color: active === 'politicas' ? '#B0C4DE' : '#FFFFFF' }}
            >
              Políticas
            </Button>
            <Button
              color="inherit"
              startIcon={<InfoIcon />}
              onClick={() => {
                handleClick('terminos');
                handleMenuClick('terminos');
              }}
              sx={{ color: active === 'terminos' ? '#B0C4DE' : '#FFFFFF' }}
            >
              Términos
            </Button>
            <Button
              color="inherit"
              startIcon={<AccountCircleIcon />}
              onClick={() => {
                handleClick('perfil');
                handleMenuClick('perfil');
              }}
              sx={{ color: active === 'perfil' ? '#B0C4DE' : '#FFFFFF' }}
            >
              Perfil de empresa
            </Button>
            <Button
              color="inherit"
              startIcon={<AccountCircleIcon />}
              onClick={() => {
                handleClick('deslinde');
                handleMenuClick('deslinde');
              }}
              sx={{ color: active === 'deslinde' ? '#B0C4DE' : '#FFFFFF' }}
            >
              Deslinde Legal
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
            <MenuItem onClick={() => { handleClick('politicas'); handleMenuClick('politicas'); }}>
              <StoreIcon sx={{ marginRight: 1 }} /> Políticas
            </MenuItem>
            <MenuItem onClick={() => { handleClick('terminos'); handleMenuClick('terminos'); }}>
              <InfoIcon sx={{ marginRight: 1 }} /> Términos
            </MenuItem>
            <MenuItem onClick={() => { handleClick('perfil'); handleMenuClick('perfil'); }}>
              <AccountCircleIcon sx={{ marginRight: 1 }} /> Perfil
            </MenuItem>
            <MenuItem onClick={() => { handleClick('cerrarSesion'); handleMenuClick('cerrarSesion'); }}>
              <LogoutIcon sx={{ marginRight: 1 }} /> Cerrar sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default EncabezadoAdministrativo;

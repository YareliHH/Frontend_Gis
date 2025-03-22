import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Box, 
  Button, 
  Typography, 
  Container, 
  Divider, 
  useMediaQuery,
  Menu,
  MenuItem,
  Badge
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import logo from '../imagenes/LogoGL.jpg';

const BarraNav = () => {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#121212' : '#FFFFFF';
    document.body.style.color = darkMode ? '#FFFFFF' : '#000000';
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    handleClose();
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#2A7F62' : '#3B8D99',
      },
      secondary: {
        main: '#00695C',
      },
      background: {
        default: darkMode ? '#121212' : '#F4F8FA',
        paper: darkMode ? '#1E1E1E' : '#FFFFFF',
      },
      text: {
        primary: darkMode ? '#FFFFFF' : '#333333',
        secondary: darkMode ? '#CCCCCC' : '#555555',
      },
      error: {
        main: '#FF4C4C',
      },
      warning: {
        main: '#FFA000',
      },
      info: {
        main: '#1976D2',
      },
      success: {
        main: '#388E3C',
      },
    },
    typography: {
      fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
      h6: {
        fontWeight: 700,
        fontSize: '28px',
        letterSpacing: '0.5px',
      },
      button: {
        textTransform: 'none',
        fontWeight: '600',
        fontSize: '16px',
        letterSpacing: '0.3px',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '4px',
            padding: '6px 16px',
            transition: 'all 0.3s ease-in-out',
          },
        },
      },
    },
  });

  const menuItems = [
    { label: 'Inicio', path: '/' },
    { label: 'Acerca De', path: '/acercaDe' },
    { label: 'Contacto', path: '/contacto' },
    { label: 'Ofertas', path: '/Ofertasespeciales' },
    { label: 'Iniciar Sesión', path: '/login' }
  ];

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <ThemeProvider theme={theme}>
      {/* Barra de información */}
      <Box sx={{
        background: darkMode 
          ? 'linear-gradient(90deg, #333333 0%, #444444 100%)' 
          : 'linear-gradient(90deg, #3B8D99 0%, #4E7C7F 100%)',
        color: 'white',
        textAlign: 'center',
        padding: '8px 0',
        fontSize: '14px',
        letterSpacing: '0.5px',
        fontWeight: '500',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}>
        <Container maxWidth="lg">
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Tel: 7898964861 | 2223308869 | gislive17@gmail.com | ¡ENVÍOS GRATIS EN COMPRAS MAYORES A $2,500!
          </Typography>
        </Container>
      </Box>

      {/* Barra de navegación principal */}
      <AppBar 
        position="sticky" 
        elevation={3}
        sx={{ 
          backgroundColor: theme.palette.background.paper,
          borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ 
            py: 1.5,
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            {/* Logo y Nombre */}
            <Box 
              onClick={() => navigate('/')} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)'
                }
              }}
            >
              <Box sx={{ 
                position: 'relative',
                width: isMobile ? 45 : 55,
                height: isMobile ? 45 : 55,
                mr: 2,
                borderRadius: '50%',
                background: darkMode 
                  ? 'linear-gradient(45deg, #2A7F62, #3B8D99)' 
                  : 'linear-gradient(45deg, #3B8D99, #91EAE4)',
                p: '3px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 3px 10px rgba(0,0,0,0.2)'
              }}>
                <img
                  src={logo}
                  alt="Logo GisLive"
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    borderRadius: '50%',
                    border: `2px solid ${darkMode ? '#333' : 'white'}`,
                    objectFit: 'cover'
                  }}
                />
              </Box>
              
              <Typography 
                variant="h6" 
                component="div"
                sx={{ 
                  display: { xs: 'none', sm: 'block' },
                  fontSize: { sm: '1.2rem', md: '1.5rem' },
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  background: darkMode 
                    ? 'linear-gradient(90deg, #2A7F62, #3B8D99)' 
                    : 'linear-gradient(90deg, #3B8D99, #91EAE4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '0.5px'
                }}
              >
                GisLive Boutique
              </Typography>
            </Box>

            {/* Navegación en escritorio */}
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              alignItems: 'center',
              gap: { md: 1, lg: 2 }
            }}>
              {menuItems.map((item, index) => (
                <Button 
                  key={index} 
                  onClick={() => navigate(item.path)} 
                  sx={{
                    color: theme.palette.text.primary,
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    position: 'relative',
                    padding: '8px 12px',
                    overflow: 'hidden',
                    '&:hover': { 
                      backgroundColor: 'transparent',
                      color: theme.palette.primary.main,
                      '&::after': {
                        transform: 'scaleX(1)',
                        transformOrigin: 'bottom left',
                      }
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: '5px',
                      left: '8px',
                      right: '8px',
                      height: '2px',
                      backgroundColor: theme.palette.primary.main,
                      transform: 'scaleX(0)',
                      transformOrigin: 'bottom right',
                      transition: 'transform 0.3s',
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            {/* Iconos de acción */}
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <IconButton 
                onClick={() => navigate('/carrito')} 
                size="large"
                aria-label="ver carrito"
                sx={{ 
                  color: theme.palette.primary.main,
                  transition: 'all 0.2s',
                  '&:hover': { 
                    backgroundColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                    transform: 'scale(1.05)'
                  } 
                }}
              >
                <Badge color="error" variant="dot">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>

              <IconButton 
                onClick={toggleDarkMode} 
                size="large"
                aria-label="cambiar tema"
                sx={{ 
                  color: darkMode ? '#FFC107' : '#5C6BC0',
                  transition: 'all 0.3s ease',
                  transform: darkMode ? 'rotate(180deg)' : 'rotate(0deg)',
                  '&:hover': { 
                    backgroundColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                    transform: darkMode ? 'rotate(180deg) scale(1.05)' : 'rotate(0deg) scale(1.05)'
                  }
                }}
              >
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>

              {/* Menú móvil */}
              {isMobile && (
                <>
                  <IconButton
                    aria-label="menú"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                    sx={{
                      ml: 0.5,
                      color: theme.palette.text.primary
                    }}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                      sx: {
                        mt: 1.5,
                        backgroundColor: theme.palette.background.paper,
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                        minWidth: 180
                      }
                    }}
                  >
                    {menuItems.map((item, index) => (
                      <MenuItem 
                        key={index} 
                        onClick={() => handleMenuItemClick(item.path)}
                        sx={{
                          py: 1.5,
                          px: 3,
                          fontWeight: 500,
                          '&:hover': {
                            backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                            color: theme.palette.primary.main
                          }
                        }}
                      >
                        {item.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};

export default BarraNav;
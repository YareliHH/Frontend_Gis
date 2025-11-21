// BarraNav.jsx con indicador de estado offline
import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Box, 
  Button, 
  Typography, 
  Container, 
  useMediaQuery,
  Menu,
  MenuItem,
  Badge,
  Fade,
  Tooltip,
  Alert,
  Slide
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import ChatIcon from '@mui/icons-material/Chat';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import WifiIcon from '@mui/icons-material/Wifi';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useOnlineStatus from '../../hooks/useOnlineStatus';
import logo from '../imagenes/LogoGL.jpg';

// Datos de navegación
const MENU_ITEMS = [
  { label: 'Inicio', path: '/' },
  { label: 'Acerca De', path: '/acercaDe' },
  { label: 'Contacto', path: '/contacto' },
  { label: 'Iniciar Sesión', path: '/login' }
];

// Información de contacto
const CONTACT_INFO = {
  phones: ['7898964861', '2223308869'],
  email: 'gislive17@gmail.com',
  freeShipping: '¡ENVÍOS GRATIS EN COMPRAS MAYORES A $2,500!'
};

const BarraNav = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const isOnline = useOnlineStatus();

  // Efecto para aplicar el tema al body
  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#121212' : '#FFFFFF';
    document.body.style.color = darkMode ? '#FFFFFF' : '#000000';
  }, [darkMode]);

  // Manejadores de eventos
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
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

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const styles = {
    infoBar: {
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
    },
    appBar: { 
      backgroundColor: theme.palette.background.paper,
      borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
    },
    toolbar: { 
      py: 1.5,
      display: 'flex', 
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logoContainer: { 
      display: 'flex', 
      alignItems: 'center',
      cursor: 'pointer',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'scale(1.02)'
      }
    },
    logoWrapper: { 
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
    },
    logoImage: { 
      width: '100%', 
      height: '100%', 
      borderRadius: '50%',
      border: `2px solid ${darkMode ? '#1E1E1E' : 'white'}`,
      objectFit: 'cover'
    },
    brandName: { 
      fontWeight: 700,
      fontSize: isMobile ? '18px' : '24px',
      color: theme.palette.primary.main,
      display: isMobile ? 'none' : 'block',
      letterSpacing: '0.5px'
    },
    desktopNav: { 
      display: { xs: 'none', md: 'flex' },
      gap: 2,
      flexGrow: 1,
      justifyContent: 'center',
      ml: 4
    },
    navButton: { 
      color: theme.palette.text.primary, 
      fontWeight: 600,
      fontSize: '16px',
      position: 'relative',
      '&:after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 0,
        height: '2px',
        backgroundColor: theme.palette.primary.main,
        transition: 'width 0.3s ease'
      },
      '&:hover:after': {
        width: '80%'
      }
    },
    actionIcons: { 
      display: 'flex', 
      alignItems: 'center',
      gap: 1
    },
    iconButton: { 
      color: theme.palette.text.primary,
      transition: 'all 0.2s',
      '&:hover': {
        backgroundColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
        transform: 'scale(1.05)'
      }
    },
    themeButton: { 
      color: theme.palette.text.primary,
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
        transform: darkMode ? 'rotate(180deg) scale(1.05)' : 'rotate(0deg) scale(1.05)'
      }
    },
    mobileMenuButton: {
      ml: 0.5,
      color: theme.palette.text.primary
    },
    mobileMenu: {
      mt: 1.5,
      backgroundColor: theme.palette.background.paper,
      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
      minWidth: 180
    },
    menuItem: {
      py: 1.5,
      px: 3,
      fontWeight: 500,
      '&:hover': {
        backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
        color: theme.palette.primary.main
      }
    },
    offlineAlert: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      borderRadius: 0,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 1
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {/* Indicador de estado offline */}
      <Slide direction="down" in={!isOnline} mountOnEnter unmountOnExit>
        <Alert 
          severity="warning" 
          icon={<WifiOffIcon />}
          sx={styles.offlineAlert}
        >
          <Typography variant="body2" fontWeight={600}>
            Sin conexión a internet - Modo offline activado
          </Typography>
        </Alert>
      </Slide>

      {/* Barra de información de contacto */}
      <Box sx={styles.infoBar}>
        <Container maxWidth="lg">
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Tel: {CONTACT_INFO.phones.join(' | ')} | {CONTACT_INFO.email} | {CONTACT_INFO.freeShipping}
          </Typography>
        </Container>
      </Box>

      {/* Barra de navegación principal */}
      <AppBar position="sticky" elevation={3} sx={styles.appBar}>
        <Container maxWidth="lg">
          <Toolbar sx={styles.toolbar}>
            {/* Logo y Nombre */}
            <Fade in={true} timeout={800}>
              <Box onClick={() => navigate('/')} sx={styles.logoContainer}>
                <Box sx={styles.logoWrapper}>
                  <img
                    src={logo}
                    alt="Logo GisLive"
                    style={styles.logoImage}
                  />
                </Box>
                
                <Typography variant="h6" component="div" sx={styles.brandName}>
                  GisLive Boutique
                </Typography>
              </Box>
            </Fade>

            {/* Navegación en escritorio */}
            <Box sx={styles.desktopNav}>
              {MENU_ITEMS.map((item, index) => (
                <Button 
                  key={index} 
                  onClick={() => navigate(item.path)} 
                  sx={styles.navButton}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            {/* Iconos de acción */}
            <Box sx={styles.actionIcons}>
              {/* Indicador de conexión (icono pequeño) */}
              <Tooltip title={isOnline ? 'Conectado' : 'Sin conexión'} arrow>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {isOnline ? (
                    <WifiIcon sx={{ fontSize: 20, color: theme.palette.success.main }} />
                  ) : (
                    <WifiOffIcon sx={{ fontSize: 20, color: theme.palette.warning.main }} />
                  )}
                </Box>
              </Tooltip>

              {/* Icono de Chat */}
              <Tooltip title="Chat" arrow>
                <IconButton 
                  onClick={() => navigate('/chat')} 
                  size="large"
                  aria-label="chat"
                  sx={styles.iconButton}
                >
                  <ChatIcon />
                </IconButton>
              </Tooltip>
              
              {/* Icono del carrito */}
              <IconButton 
                onClick={() => navigate('/cliente/carrito-compras')} 
                size="large"
                aria-label="ver carrito"
                sx={styles.iconButton}
              >
                <Badge color="error" variant="dot">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>

              {/* Botón de tema */}
              <IconButton 
                onClick={toggleDarkMode} 
                size="large"
                aria-label="cambiar tema"
                sx={styles.themeButton}
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
                    sx={styles.mobileMenuButton}
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
                    TransitionComponent={Fade}
                    PaperProps={{
                      sx: styles.mobileMenu
                    }}
                  >
                    {MENU_ITEMS.map((item, index) => (
                      <MenuItem 
                        key={index} 
                        onClick={() => handleMenuItemClick(item.path)}
                        sx={styles.menuItem}
                      >
                        {item.label}
                      </MenuItem>
                    ))}
                    <MenuItem 
                      onClick={() => handleMenuItemClick('/chat')}
                      sx={styles.menuItem}
                    >
                      Chat
                    </MenuItem>
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
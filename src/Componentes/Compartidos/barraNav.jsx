// BarraNav.jsx
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
  Tooltip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import ChatIcon from '@mui/icons-material/Chat';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
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

  // Tema igual que en el original
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

  // Estilos como objetos para mejor organización
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
      border: `2px solid ${darkMode ? '#333' : 'white'}`,
      objectFit: 'cover'
    },
    brandName: { 
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
    },
    desktopNav: { 
      display: { xs: 'none', md: 'flex' }, 
      alignItems: 'center',
      gap: { md: 1, lg: 2 }
    },
    navButton: {
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
    },
    actionIcons: { 
      display: 'flex',
      alignItems: 'center',
      gap: 1
    },
    iconButton: { 
      color: theme.palette.primary.main,
      transition: 'all 0.2s',
      '&:hover': { 
        backgroundColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
        transform: 'scale(1.05)'
      } 
    },
    themeButton: { 
      color: darkMode ? '#FFC107' : '#5C6BC0',
      transition: 'all 0.3s ease',
      transform: darkMode ? 'rotate(180deg)' : 'rotate(0deg)',
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
    }
  };

  return (
    <ThemeProvider theme={theme}>
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
                onClick={() => navigate('/carrito')} 
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
import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Box, 
  Button, 
  TextField, 
  InputAdornment, 
  Typography,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Container,
  Divider,
  useMediaQuery,
  Fade,
  Paper,
  Avatar,
  Zoom,
  Grow
} from '@mui/material';  
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ManIcon from '@mui/icons-material/Man';
import WomanIcon from '@mui/icons-material/Woman';
import LogoutIcon from '@mui/icons-material/ExitToApp';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider, alpha } from '@mui/material/styles';
import logo from '../imagenes/LogoGL.jpg';

const BarraNavCliente = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartCount, setCartCount] = useState(2); // Número de ejemplo para el carrito
  const navigate = useNavigate();
  
  // Detectar tamaño de pantalla con Material UI
  const theme = createTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  // Efecto para aplicar modo oscuro/claro
  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#121212' : '#FFFFFF';
    document.body.style.color = darkMode ? '#FFFFFF' : '#000000';
    
    // Cargar preferencia guardada
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setDarkMode(savedMode === 'true');
    }
  }, [darkMode]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/buscar?q=${searchTerm}`);
    }
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Navegación con delay para transición visual
  const handleNavigation = (path) => {
    // Crear un pequeño delay para animar la transición
    setTimeout(() => {
      navigate(path);
    }, 150);
  };

  // Cerrar drawer al navegar en móvil
  const handleMobileNav = (path) => {
    setDrawerOpen(false);
    handleNavigation(path);
  };

  // Crear tema personalizado con Material UI
  const customTheme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#1e1e1e' : '#87CEEB', // Color original (fondo barra de navegación)
      },
      background: {
        default: darkMode ? '#121212' : '#FFFFFF',
        paper: darkMode ? '#1e1e1e' : '#FFFFFF',
      },
      text: {
        primary: darkMode ? '#ffffff' : '#000000',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h6: {
        fontWeight: 600,
        fontSize: '1.25rem',
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          }
        }
      }
    }
  });

  return (
    <ThemeProvider theme={customTheme}>
      {/* Banner superior */}
      <Fade in={true} timeout={800}>
        <Box 
          sx={{ 
            backgroundColor: darkMode ? '#222' : '#15263f', 
            color: 'white', 
            padding: isSmall ? '8px' : '10px 0',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mx: 1 }}>
            <PhoneIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="body2">7898964861</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mx: 1 }}>
            <PhoneIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="body2">2223308869</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mx: 1 }}>
            <EmailIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="body2">gislive17@gmail.com</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mx: 1 }}>
            <LocalShippingIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="body2">¡ENVÍOS GRATIS EN COMPRAS MAYORES A $2,500!</Typography>
          </Box>
        </Box>
      </Fade>

      {/* Sección de Logo */}
      <Grow in={true} timeout={800}>
        <Paper 
          elevation={0}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '15px 0', 
            backgroundColor: darkMode ? '#1e1e1e' : '#b3cde0',
            borderRadius: 0
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              src={logo}
              alt="Logo GisLive"
              sx={{ 
                width: isSmall ? 50 : 60, 
                height: isSmall ? 50 : 60,
                mr: 2,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            />
            <Typography 
              variant="h6" 
              sx={{ 
                color: darkMode ? '#fff' : '#fff',
                fontWeight: 'bold',
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              GisLive Boutique Clínica
            </Typography>
          </Box>
        </Paper>
      </Grow>

      {/* Barra de navegación principal */}
      <AppBar 
        position="sticky" 
        sx={{ 
          backgroundColor: customTheme.palette.primary.main,
          boxShadow: darkMode ? '0 2px 8px rgba(0, 0, 0, 0.5)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            {/* Icono de menú móvil */}
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Búsqueda centralizada en escritorio */}
            <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: isMobile ? 0 : 1 }}>
              {!isMobile && (
                <Zoom in={true} style={{ transitionDelay: '200ms' }}>
                  <TextField
                    variant="outlined"
                    placeholder="Buscar aqui..."
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    sx={{
                      width: '600px',
                      backgroundColor: darkMode ? '#333' : '#fff',
                      borderRadius: '5px',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '5px',
                        transition: 'all 0.3s',
                      },
                      '& .MuiInputBase-input': { 
                        color: darkMode ? '#fff' : '#000',
                        fontSize: '16px',
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleSearch}>
                            <SearchIcon sx={{ color: theme.palette.text.primary, fontSize: '30px' }} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Zoom>
              )}
            </Box>

            {/* Navegación en escritorio */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {[
                  { label: 'Hombre', path: '/hombre', icon: <ManIcon sx={{ mr: 0.5 }} /> },
                  { label: 'Mujer', path: '/mujer', icon: <WomanIcon sx={{ mr: 0.5 }} /> },
                  { label: 'Ofertas Especiales', path: '/ofertasCliente', icon: <LocalOfferIcon sx={{ mr: 0.5 }} /> },
                  { label: 'Perfil', path: '/perfil', icon: <PersonIcon sx={{ mr: 0.5 }} /> },
                ].map((item, index) => (
                  <Button
                    key={index}
                    color="inherit"
                    onClick={() => handleNavigation(item.path)}
                    startIcon={item.icon}
                    sx={{
                      mx: 0.5,
                      transition: 'all 0.3s',
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: '6px',
                        left: '50%',
                        width: '0%',
                        height: '2px',
                        backgroundColor: '#fff',
                        transition: 'all 0.3s ease',
                        transform: 'translateX(-50%)',
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-2px)',
                        '&::after': {
                          width: '70%'
                        }
                      }
                    }}
                  >
                    {item.label}
                  </Button>
                ))}

                <IconButton
                  color="inherit"
                  onClick={() => handleNavigation('/carrito')}
                  sx={{
                    mx: 1,
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Badge badgeContent={cartCount} color="error">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>

                <IconButton
                  color="inherit"
                  onClick={toggleDarkMode}
                  sx={{
                    mx: 1,
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>

                <IconButton
                  color="inherit"
                  onClick={() => handleNavigation('/')}
                  sx={{
                    mx: 1,
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <LogoutIcon />
                </IconButton>
              </Box>
            )}

            {/* Carrito para móvil */}
            {isMobile && (
              <IconButton
                color="inherit"
                onClick={() => handleNavigation('/carrito')}
              >
                <Badge badgeContent={cartCount} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Menú móvil (Drawer) */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            backgroundColor: darkMode ? '#1e1e1e' : '#fff',
          }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="primary">GisLive</Typography>
          <IconButton onClick={toggleDrawer}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Divider />
        
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Buscar productos..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearch} size="small">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        
        <List>
          {[
            { label: 'Hombre', path: '/hombre', icon: <ManIcon /> },
            { label: 'Mujer', path: '/mujer', icon: <WomanIcon /> },
            { label: 'Ofertas Especiales', path: '/ofertasCliente', icon: <LocalOfferIcon /> },
            { label: 'Mi Perfil', path: '/perfil', icon: <PersonIcon /> },
          ].map((item, index) => (
            <ListItem 
              button 
              key={index} 
              onClick={() => handleMobileNav(item.path)}
              sx={{
                borderRadius: '8px',
                mx: 1,
                my: 0.5,
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: alpha(customTheme.palette.primary.main, 0.1),
                  transform: 'translateX(5px)'
                }
              }}
            >
              <ListItemIcon sx={{ color: customTheme.palette.primary.main }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
          
          <Divider sx={{ my: 2 }} />
          
          <ListItem 
            button 
            onClick={() => handleMobileNav('/carrito')}
            sx={{
              borderRadius: '8px',
              mx: 1,
              my: 0.5,
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: alpha(customTheme.palette.primary.main, 0.1),
                transform: 'translateX(5px)'
              }
            }}
          >
            <ListItemIcon sx={{ color: customTheme.palette.primary.main }}>
              <Badge badgeContent={cartCount} color="error">
                <ShoppingCartIcon />
              </Badge>
            </ListItemIcon>
            <ListItemText primary="Carrito de compras" />
          </ListItem>
          
          <ListItem 
            button 
            onClick={toggleDarkMode}
            sx={{
              borderRadius: '8px',
              mx: 1,
              my: 0.5,
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: alpha(customTheme.palette.primary.main, 0.1),
                transform: 'translateX(5px)'
              }
            }}
          >
            <ListItemIcon sx={{ color: customTheme.palette.primary.main }}>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </ListItemIcon>
            <ListItemText primary={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"} />
          </ListItem>
          
          <Divider sx={{ my: 2 }} />
          
          <ListItem 
            button 
            onClick={() => handleMobileNav('/')}
            sx={{
              borderRadius: '8px',
              mx: 1,
              my: 0.5,
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: alpha('#f44336', 0.1),
                transform: 'translateX(5px)'
              }
            }}
          >
            <ListItemIcon sx={{ color: '#f44336' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Cerrar Sesión" />
          </ListItem>
        </List>
      </Drawer>
    </ThemeProvider>
  );
};

export default BarraNavCliente;
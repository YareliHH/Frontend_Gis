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
  Grow,
  InputBase,
  CircularProgress,
  Popper,
  ClickAwayListener,
  Autocomplete,
  Card,
  CardMedia,
  CardContent,
  alpha
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
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import logo from '../imagenes/LogoGL.jpg';
import axios from 'axios';

// Componente personalizado para el buscador redondo y elegante
const SearchBox = styled('div')(({ theme, darkMode }) => ({
  position: 'relative',
  borderRadius: 30,
  backgroundColor: darkMode ? alpha(theme.palette.common.white, 0.15) : 'white',
  border: darkMode ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.1)',
  boxShadow: '0 1px 5px rgba(0, 0, 0, 0.03)',
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
    minWidth: '320px'
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  right: 0,
  top: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1,
  cursor: 'pointer',
  borderRadius: '0 30px 30px 0',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1)
  }
}));

const StyledInputBase = styled(InputBase)(({ theme, darkMode }) => ({
  color: darkMode ? theme.palette.common.white : theme.palette.common.black,
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 4, 1, 2),
    transition: theme.transitions.create('width'),
    width: '100%',
    fontSize: '0.9rem',
  },
}));

// Componente para el resultado de búsqueda
const SearchResult = ({ product, onClick, darkMode }) => {
  return (
    <Card 
      sx={{ 
        display: 'flex', 
        mb: 1, 
        cursor: 'pointer',
        boxShadow: 'none',
        borderRadius: 2,
        backgroundColor: darkMode ? '#2a2a2a' : '#fff',
        transition: 'all 0.3s ease',
        '&:hover': {
          backgroundColor: darkMode ? '#333' : '#f8f8f8',
          transform: 'translateY(-2px)'
        }
      }}
      onClick={() => onClick(product)}
    >
      <CardMedia
        component="img"
        sx={{ width: 60, height: 60, objectFit: 'contain', p: 1 }}
        image={product.url || '/placeholder-image.jpg'}
        alt={product.nombre_producto}
      />
      <CardContent sx={{ flex: '1 0 auto', p: 1 }}>
        <Typography variant="body1" sx={{ fontWeight: 500, color: darkMode ? '#fff' : '#000' }}>
          {product.nombre_producto}
        </Typography>
        <Typography variant="body2" sx={{ color: darkMode ? '#bbb' : '#666' }}>
          ${parseFloat(product.precio).toFixed(2)}
        </Typography>
      </CardContent>
    </Card>
  );
};

const BarraNavCliente = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartCount, setCartCount] = useState(2); // Número de ejemplo para el carrito
  const navigate = useNavigate();
  
  // Estados para el buscador
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  
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
  
  // Función para buscar productos
  const searchProducts = async (query) => {
    if (!query || query.trim() === '') {
      setSearchResults([]);
      setOpen(false);
      return;
    }
    
    try {
      setLoading(true);
      // Llamada a la API de búsqueda
      const response = await axios.get(`http://localhost:3001/api/buscar?q=${query}`);
      setSearchResults(response.data);
      setOpen(response.data.length > 0);
    } catch (error) {
      console.error('Error al buscar productos:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Efecto para debounce (retraso) en la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        searchProducts(searchTerm);
      }
    }, 300); // Retraso de 300ms para no hacer llamadas API en cada keystroke
    
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  // Manejar clic en resultado de búsqueda
  const handleResultClick = (product) => {
    navigate(`/detallesp/${product.id}`);
    setSearchTerm('');
    setOpen(false);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/buscar?q=${searchTerm}`);
      setOpen(false);
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
  
  // Manejar cambio en el input de búsqueda
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setAnchorEl(event.currentTarget);
  };

  // Crear tema personalizado con Material UI
  const customTheme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#1e1e1e' : '#64b5f6', // Cambiado a un azul claro celestial
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
            backgroundColor: darkMode ? '#222' : '#4285f4', // Cambiado a azul claro
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
            backgroundColor: darkMode ? '#1e1e1e' : '#f0f8ff', // Azul muy suave
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
                color: darkMode ? '#fff' : '#4285f4', // Azul claro
                fontWeight: 'bold',
                textShadow: darkMode ? '1px 1px 2px rgba(0,0,0,0.3)' : 'none'
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
          backgroundColor: darkMode ? '#1e1e1e' : '#4cb5ff', // Azul más claro como en la imagen
          boxShadow: darkMode ? '0 2px 8px rgba(0, 0, 0, 0.5)' : '0 2px 8px rgba(76, 181, 255, 0.3)',
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

            {/* Búsqueda a la izquierda en desktop */}
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 0, position: 'relative' }}>
              {!isMobile && (
                <Zoom in={true} style={{ transitionDelay: '200ms' }}>
                  <SearchBox darkMode={darkMode}>
                    <StyledInputBase
                      placeholder="Buscar productos..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      darkMode={darkMode}
                    />
                    <SearchIconWrapper onClick={handleSearch}>
                      {loading ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        <SearchIcon />
                      )}
                    </SearchIconWrapper>
                    
                    {/* Resultados de búsqueda */}
                    <Popper 
                      open={open} 
                      anchorEl={anchorEl} 
                      placement="bottom-start"
                      style={{ 
                        width: anchorEl ? anchorEl.clientWidth : undefined,
                        zIndex: 1300,
                        marginTop: '5px'
                      }}
                    >
                      <ClickAwayListener onClickAway={() => setOpen(false)}>
                        <Paper
                          elevation={3}
                          sx={{
                            p: 1,
                            maxHeight: '350px',
                            overflowY: 'auto',
                            width: '100%',
                            borderRadius: '12px',
                            backgroundColor: darkMode ? '#222' : '#fff',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                          }}
                        >
                          {searchResults.length > 0 ? (
                            <>
                              <Typography 
                                variant="subtitle2" 
                                sx={{ 
                                  p: 1, 
                                  color: darkMode ? '#aaa' : '#666',
                                  borderBottom: '1px solid',
                                  borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                                }}
                              >
                                Resultados de búsqueda
                              </Typography>
                              <Box sx={{ p: 1 }}>
                                {searchResults.map((product) => (
                                  <SearchResult 
                                    key={product.id} 
                                    product={product} 
                                    onClick={handleResultClick}
                                    darkMode={darkMode}
                                  />
                                ))}
                              </Box>
                            </>
                          ) : (
                            <Box sx={{ p: 2, textAlign: 'center' }}>
                              {loading ? (
                                <CircularProgress size={24} />
                              ) : (
                                <Typography variant="body2" color="text.secondary">
                                  No se encontraron productos
                                </Typography>
                              )}
                            </Box>
                          )}
                        </Paper>
                      </ClickAwayListener>
                    </Popper>
                  </SearchBox>
                </Zoom>
              )}
            </Box>

            {/* Navegación en escritorio */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {[
                  { label: 'Hombre', path: '/hombres', icon: <ManIcon sx={{ mr: 0.5 }} /> },
                  { label: 'Mujer', path: '/mujeres', icon: <WomanIcon sx={{ mr: 0.5 }} /> },
                  { label: 'Ofertas Especiales', path: '/ofertasCliente', icon: <LocalOfferIcon sx={{ mr: 0.5 }} /> },
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
          <Typography variant="h6" sx={{ color: darkMode ? '#fff' : '#4285f4' }}>GisLive</Typography>
          <IconButton onClick={toggleDrawer}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Divider />
        
        <Box sx={{ p: 2 }}>
          <SearchBox darkMode={darkMode} sx={{ maxWidth: '100%' }}>
            <StyledInputBase
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              darkMode={darkMode}
            />
            <SearchIconWrapper onClick={handleSearch}>
              <SearchIcon />
            </SearchIconWrapper>
          </SearchBox>
        </Box>
        
        <List>
          {[
            { label: 'Hombre', path: '/hombres', icon: <ManIcon /> },
            { label: 'Mujer', path: '/mujeres', icon: <WomanIcon /> },
            { label: 'Ofertas Especiales', path: '/ofertasCliente', icon: <LocalOfferIcon /> },
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
                  backgroundColor: darkMode ? 'rgba(100, 181, 246, 0.1)' : 'rgba(100, 181, 246, 0.1)',
                  transform: 'translateX(5px)'
                }
              }}
            >
              <ListItemIcon sx={{ color: darkMode ? '#64b5f6' : '#4285f4' }}>
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
                backgroundColor: darkMode ? 'rgba(100, 181, 246, 0.1)' : 'rgba(100, 181, 246, 0.1)',
                transform: 'translateX(5px)'
              }
            }}
          >
            <ListItemIcon sx={{ color: darkMode ? '#64b5f6' : '#4285f4' }}>
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
                backgroundColor: darkMode ? 'rgba(100, 181, 246, 0.1)' : 'rgba(100, 181, 246, 0.1)',
                transform: 'translateX(5px)'
              }
            }}
          >
            <ListItemIcon sx={{ color: darkMode ? '#64b5f6' : '#4285f4' }}>
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
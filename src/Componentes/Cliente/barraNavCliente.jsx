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
  InputBase,
  Paper,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Collapse
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import LogoutIcon from '@mui/icons-material/ExitToApp';
import ManIcon from '@mui/icons-material/Man';
import WomanIcon from '@mui/icons-material/Woman';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import logo from '../imagenes/LogoGL.jpg';
import { useAuth } from '../Autenticacion/AuthContext';
import axios from 'axios';

// Componente estilizado para el buscador responsivo
const SearchBox = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '25px',
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
  width: '100%',
  maxWidth: '400px',
  display: 'flex',
  alignItems: 'center',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)',
    borderColor: theme.palette.primary.main,
    boxShadow: '0 0 8px rgba(59, 141, 153, 0.2)',
  },
  '&:focus-within': {
    borderColor: theme.palette.primary.main,
    boxShadow: '0 0 8px rgba(59, 141, 153, 0.3)',
    backgroundColor: theme.palette.background.paper,
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
    margin: '0 8px',
  }
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.primary,
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 1.5),
    width: '100%',
    fontSize: '0.9rem',
    '&::placeholder': {
      color: theme.palette.text.secondary,
      opacity: 0.7,
    }
  },
  [theme.breakpoints.down('sm')]: {
    '& .MuiInputBase-input': {
      fontSize: '0.85rem',
      padding: theme.spacing(0.8, 1, 0.8, 1.2),
    }
  }
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1.5),
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: theme.palette.primary.main,
  transition: 'all 0.2s',
  '&:hover': {
    transform: 'scale(1.1)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0, 1),
  }
}));

// Componente estilizado para la barra secundaria
const SecondaryBar = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
  padding: theme.spacing(1, 0),
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  }
}));

// Componente para el drawer móvil
const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 280,
    backgroundColor: theme.palette.background.default,
    background: theme.palette.mode === 'dark' 
      ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
      : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
  },
}));

// Componente para resultados de búsqueda
const SearchResult = ({ product, onClick, darkMode }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 1.5,
        cursor: 'pointer',
        borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
        transition: 'all 0.2s',
        '&:hover': {
          backgroundColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
          transform: 'translateX(4px)',
        },
      }}
      onClick={() => onClick(product)}
    >
      <Box
        sx={{
          width: 45,
          height: 45,
          borderRadius: '8px',
          overflow: 'hidden',
          mr: 1.5,
          backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={product.url || '/placeholder-image.jpg'}
          alt={product.nombre_producto}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            transition: 'transform 0.2s',
          }}
        />
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 600, 
            color: darkMode ? '#fff' : '#333',
            mb: 0.5,
            lineHeight: 1.2
          }}
        >
          {product.nombre_producto}
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            color: darkMode ? '#4CAF50' : '#2E7D32',
            fontWeight: 600,
            fontSize: '0.8rem'
          }}
        >
          ${parseFloat(product.precio).toFixed(2)}
        </Typography>
      </Box>
    </Box>
  );
};

const BarraNavCliente = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [openSearch, setOpenSearch] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [cartCount, setCartCount] = useState(2);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#121212' : '#FFFFFF';
    document.body.style.color = darkMode ? '#FFFFFF' : '#000000';
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) setDarkMode(savedMode === 'true');
  }, [darkMode]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        searchProducts(searchTerm);
      } else {
        setSearchResults([]);
        setOpenSearch(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const searchProducts = async (query) => {
    try {
      const response = await axios.get(`https://backend-gis-1.onrender.com/api/buscare?q=${query}`);
      setSearchResults(response.data);
      setOpenSearch(response.data.length > 0);
    } catch (error) {
      console.error('Error al buscar productos:', error);
      setSearchResults([]);
      setOpenSearch(false);
    }
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuExpand = (menu) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setMobileOpen(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/buscar?q=${searchTerm}`);
      setSearchTerm('');
      setOpenSearch(false);
    }
  };

  const handleResultClick = (product) => {
    navigate(`/cliente/detallesp/${product.id}`);
    setSearchTerm('');
    setOpenSearch(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const customTheme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: darkMode ? '#2A7F62' : '#3B8D99' },
      secondary: { main: '#00695C' },
      background: { 
        default: darkMode ? '#121212' : '#F4F8FA', 
        paper: darkMode ? '#1E1E1E' : '#FFFFFF' 
      },
      text: { 
        primary: darkMode ? '#FFFFFF' : '#333333', 
        secondary: darkMode ? '#CCCCCC' : '#555555' 
      },
      error: { main: '#FF4C4C' },
    },
    typography: {
      fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
      h6: { fontWeight: 700, fontSize: isSmall ? '20px' : '24px', letterSpacing: '0.5px' },
      button: { textTransform: 'none', fontWeight: '600', fontSize: '14px', letterSpacing: '0.3px' },
    },
    components: {
      MuiButton: { 
        styleOverrides: { 
          root: { 
            borderRadius: '8px', 
            padding: '8px 16px', 
            transition: 'all 0.3s ease-in-out' 
          } 
        } 
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            '&:hover': {
              backgroundColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
            }
          }
        }
      }
    },
  });

  const menuItems = [
    { label: 'Hombre', path: '/cliente/hombres', icon: <ManIcon /> },
    { label: 'Mujer', path: '/cliente/mujeres', icon: <WomanIcon /> },
    { label: 'Ofertas', path: '/cliente/ofertasCliente', icon: <LocalOfferIcon /> },
  ];

  const drawer = (
    <Box>
      {/* Header del drawer */}
      <Box sx={{ 
        p: 2, 
        background: darkMode 
          ? 'linear-gradient(135deg, #2A7F62 0%, #1a5f4a 100%)'
          : 'linear-gradient(135deg, #3B8D99 0%, #2a6b75 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            src={logo} 
            sx={{ 
              width: 40, 
              height: 40, 
              mr: 1.5,
              border: '2px solid rgba(255,255,255,0.3)'
            }} 
          />
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '18px' }}>
            GisLive
          </Typography>
        </Box>
        <IconButton 
          onClick={handleDrawerToggle}
          sx={{ color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      {/* Navegación principal */}
      <List sx={{ px: 1, py: 2 }}>
        {menuItems.map((item, index) => (
          <ListItem 
            key={index}
            button 
            onClick={() => handleNavigation(item.path)}
            sx={{
              borderRadius: '12px',
              mb: 1,
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                transform: 'translateX(4px)',
              }
            }}
          >
            <ListItemIcon sx={{ color: customTheme.palette.primary.main, minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.label} 
              primaryTypographyProps={{ fontWeight: 600, fontSize: '15px' }}
            />
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Acciones del usuario */}
      <List sx={{ px: 1, py: 1 }}>
        <ListItem 
          button 
          onClick={() => handleNavigation('/cliente/perfil')}
          sx={{
            borderRadius: '12px',
            mb: 1,
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
              transform: 'translateX(4px)',
            }
          }}
        >
          <ListItemIcon sx={{ color: customTheme.palette.primary.main, minWidth: 40 }}>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Mi Perfil" 
            primaryTypographyProps={{ fontWeight: 600, fontSize: '15px' }}
          />
        </ListItem>

        <ListItem 
          button 
          onClick={() => handleNavigation('/cliente/carrito-compras')}
          sx={{
            borderRadius: '12px',
            mb: 1,
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
              transform: 'translateX(4px)',
            }
          }}
        >
          <ListItemIcon sx={{ color: customTheme.palette.primary.main, minWidth: 40 }}>
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </ListItemIcon>
          <ListItemText 
            primary="Mi Carrito" 
            primaryTypographyProps={{ fontWeight: 600, fontSize: '15px' }}
          />
        </ListItem>

        <ListItem 
          button 
          onClick={toggleDarkMode}
          sx={{
            borderRadius: '12px',
            mb: 1,
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
              transform: 'translateX(4px)',
            }
          }}
        >
          <ListItemIcon sx={{ color: darkMode ? '#FFC107' : '#5C6BC0', minWidth: 40 }}>
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </ListItemIcon>
          <ListItemText 
            primary={darkMode ? 'Modo Claro' : 'Modo Oscuro'}
            primaryTypographyProps={{ fontWeight: 600, fontSize: '15px' }}
          />
        </ListItem>

        <ListItem 
          button 
          onClick={handleLogout}
          sx={{
            borderRadius: '12px',
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: 'rgba(255, 76, 76, 0.1)',
              transform: 'translateX(4px)',
            }
          }}
        >
          <ListItemIcon sx={{ color: '#FF4C4C', minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Cerrar Sesión" 
            primaryTypographyProps={{ fontWeight: 600, fontSize: '15px', color: '#FF4C4C' }}
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={customTheme}>
      {/* Barra de información */}
      <Box sx={{
        background: darkMode 
          ? 'linear-gradient(90deg, #333333 0%, #444444 100%)' 
          : 'linear-gradient(90deg, #3B8D99 0%, #4E7C7F 100%)',
        color: 'white',
        textAlign: 'center',
        padding: isSmall ? '6px 8px' : '8px 0',
        fontSize: isSmall ? '12px' : '14px',
        letterSpacing: '0.5px',
        fontWeight: '500',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        display: isSmall ? 'none' : 'block',
      }}>
        <Container maxWidth="lg">
          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 'inherit' }}>
            Tel: 7898964861 | 2223308869 | gislive17@gmail.com | ¡ENVÍOS GRATIS EN COMPRAS MAYORES A $2,500!
          </Typography>
        </Container>
      </Box>

      {/* Barra de navegación principal */}
      <AppBar 
        position="sticky" 
        elevation={3} 
        sx={{ 
          backgroundColor: customTheme.palette.background.paper,
          backdropFilter: 'blur(20px)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ 
            py: isMobile ? 1 : 1.5, 
            px: isMobile ? 1 : 2,
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            minHeight: isMobile ? '60px' : '70px'
          }}>
            {/* Logo */}
            <Box 
              onClick={() => navigate('/cliente')} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.02)' }
              }}
            >
              <Box sx={{ 
                position: 'relative',
                width: isMobile ? (isSmall ? 35 : 40) : 50,
                height: isMobile ? (isSmall ? 35 : 40) : 50,
                borderRadius: '50%',
                background: darkMode 
                  ? 'linear-gradient(45deg, #2A7F62, #3B8D99)' 
                  : 'linear-gradient(45deg, #3B8D99, #91EAE4)',
                p: '2px',
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
              {!isSmall && (
                <Typography 
                  variant="h6" 
                  sx={{ 
                    ml: 1.5, 
                    fontWeight: 700,
                    fontSize: isMobile ? '18px' : '22px',
                    color: customTheme.palette.primary.main,
                    display: isMobile ? 'none' : 'block'
                  }}
                >
                  GisLive boutique
                </Typography>
              )}
            </Box>

            {/* Buscador - Solo en desktop */}
            {!isMobile && (
              <Box sx={{ flex: 1, maxWidth: '400px', mx: 3 }}>
                <SearchBox>
                  <StyledInputBase
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    startAdornment={
                      <SearchIconWrapper onClick={handleSearch}>
                        <SearchIcon />
                      </SearchIconWrapper>
                    }
                  />
                  {openSearch && (
                    <Paper
                      sx={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        mt: 1,
                        width: '100%',
                        maxHeight: '350px',
                        overflowY: 'auto',
                        backgroundColor: customTheme.palette.background.paper,
                        boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                        zIndex: 1300,
                        borderRadius: '12px',
                        border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                      }}
                    >
                      {searchResults.map((product) => (
                        <SearchResult
                          key={product.id}
                          product={product}
                          onClick={handleResultClick}
                          darkMode={darkMode}
                        />
                      ))}
                      {searchResults.length === 0 && (
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                          <Typography variant="body2" sx={{ color: customTheme.palette.text.secondary }}>
                            No se encontraron productos
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  )}
                </SearchBox>
              </Box>
            )}

            {/* Iconos de acción */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: isMobile ? 0.5 : 1 }}>
              {!isMobile && (
                <>
                  <IconButton
                    onClick={() => navigate('/cliente/carrito-compras')}
                    size={isMobile ? "medium" : "large"}
                    aria-label="ver carrito"
                    sx={{ 
                      color: customTheme.palette.primary.main,
                      transition: 'all 0.2s',
                      '&:hover': { 
                        transform: 'scale(1.05)'
                      } 
                    }}
                  >
                    <Badge badgeContent={cartCount} color="error">
                      <ShoppingCartIcon />
                    </Badge>
                  </IconButton>
                  <IconButton
                    onClick={() => navigate('/cliente/perfil')}
                    size={isMobile ? "medium" : "large"}
                    aria-label="perfil"
                    sx={{ 
                      color: customTheme.palette.primary.main,
                      transition: 'all 0.2s',
                      '&:hover': { 
                        transform: 'scale(1.05)'
                      } 
                    }}
                  >
                    <PersonIcon />
                  </IconButton>
                  <IconButton
                    onClick={toggleDarkMode}
                    size={isMobile ? "medium" : "large"}
                    aria-label="cambiar tema"
                    sx={{ 
                      color: darkMode ? '#FFC107' : '#5C6BC0',
                      transition: 'all 0.3s ease',
                      transform: darkMode ? 'rotate(180deg)' : 'rotate(0deg)',
                      '&:hover': { 
                        transform: darkMode ? 'rotate(180deg) scale(1.05)' : 'rotate(0deg) scale(1.05)'
                      }
                    }}
                  >
                    {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                  </IconButton>
                </>
              )}
              
              {/* Menú hamburguesa para móvil */}
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="abrir menú"
                  onClick={handleDrawerToggle}
                  sx={{ 
                    color: customTheme.palette.text.primary,
                    '&:hover': {
                      backgroundColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                    }
                  }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Barra de búsqueda móvil */}
      {isMobile && (
        <Box sx={{ 
          p: 1.5, 
          backgroundColor: customTheme.palette.background.paper,
          borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <SearchBox>
            <StyledInputBase
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              startAdornment={
                <SearchIconWrapper onClick={handleSearch}>
                  <SearchIcon />
                </SearchIconWrapper>
              }
            />
            {openSearch && (
              <Paper
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  mt: 1,
                  width: '100%',
                  maxHeight: '250px',
                  overflowY: 'auto',
                  backgroundColor: customTheme.palette.background.paper,
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  zIndex: 1300,
                  borderRadius: '8px',
                }}
              >
                {searchResults.map((product) => (
                  <SearchResult
                    key={product.id}
                    product={product}
                    onClick={handleResultClick}
                    darkMode={darkMode}
                  />
                ))}
                {searchResults.length === 0 && (
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: customTheme.palette.text.secondary }}>
                      No se encontraron productos
                    </Typography>
                  </Box>
                )}
              </Paper>
            )}
          </SearchBox>
        </Box>
      )}

      {/* Barra secundaria para desktop */}
      {!isMobile && (
        <SecondaryBar>
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, py: 1 }}>
              {menuItems.map((item, index) => (
                <Button
                  key={index}
                  onClick={() => navigate(item.path)}
                  startIcon={item.icon}
                  sx={{
                    color: customTheme.palette.text.primary,
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    position: 'relative',
                    padding: '10px 16px',
                    borderRadius: '20px',
                    '&:hover': { 
                      backgroundColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                      color: customTheme.palette.primary.main,
                      transform: 'translateY(-2px)',
                      '&::after': { transform: 'scaleX(1)', transformOrigin: 'bottom left' }
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: '6px',
                      left: '16px',
                      right: '16px',
                      height: '2px',
                      backgroundColor: customTheme.palette.primary.main,
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
          </Container>
        </SecondaryBar>
      )}

      {/* Drawer para móvil */}
      <StyledDrawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
        }}
      >
        {drawer}
      </StyledDrawer>
    </ThemeProvider>
  );
};

export default BarraNavCliente;
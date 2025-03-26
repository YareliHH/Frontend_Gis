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
  Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import LogoutIcon from '@mui/icons-material/ExitToApp';
import ManIcon from '@mui/icons-material/Man';
import WomanIcon from '@mui/icons-material/Woman';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person'; // Ícono para Perfil
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import logo from '../imagenes/LogoGL.jpg';
import { useAuth } from '../Autenticacion/AuthContext';
import axios from 'axios';

// Componente estilizado para el buscador
const SearchBox = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '20px',
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
  marginLeft: theme.spacing(1),
  width: 'auto',
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
  }
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.primary,
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 1.5),
    width: '220px',
    fontSize: '0.9rem',
    transition: 'width 0.2s',
    '&:focus': {
      width: '240px',
    }
  },
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
  }
}));

// Componente simple para resultados de búsqueda
const SearchResult = ({ product, onClick, darkMode }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 1,
        cursor: 'pointer',
        borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
        '&:hover': {
          backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
        },
      }}
      onClick={() => onClick(product)}
    >
      <img
        src={product.url || '/placeholder-image.jpg'}
        alt={product.nombre_producto}
        style={{ width: 40, height: 40, objectFit: 'contain', marginRight: 8 }}
      />
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 500, color: darkMode ? '#fff' : '#333' }}>
          {product.nombre_producto}
        </Typography>
        <Typography variant="caption" sx={{ color: darkMode ? '#ccc' : '#555' }}>
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
  const [anchorEl, setAnchorEl] = useState(null);
  const [cartCount, setCartCount] = useState(2); // Ejemplo
  const navigate = useNavigate();
  const { logout } = useAuth();

  const open = Boolean(anchorEl);

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#121212' : '#FFFFFF';
    document.body.style.color = darkMode ? '#FFFFFF' : '#000000';
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) setDarkMode(savedMode === 'true');
  }, [darkMode]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) searchProducts(searchTerm);
      else {
        setSearchResults([]);
        setOpenSearch(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const searchProducts = async (query) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/buscar?q=${query}`);
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

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleMenuItemClick = (path) => {
    navigate(path);
    handleClose();
  };
  const handleLogout = async () => {
    try {
      await logout();
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
    navigate(`/detallesp/${product.id}`);
    setSearchTerm('');
    setOpenSearch(false);
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: darkMode ? '#2A7F62' : '#3B8D99' },
      secondary: { main: '#00695C' },
      background: { default: darkMode ? '#121212' : '#F4F8FA', paper: darkMode ? '#1E1E1E' : '#FFFFFF' },
      text: { primary: darkMode ? '#FFFFFF' : '#333333', secondary: darkMode ? '#CCCCCC' : '#555555' },
      error: { main: '#FF4C4C' },
    },
    typography: {
      fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
      h6: { fontWeight: 700, fontSize: '28px', letterSpacing: '0.5px' },
      button: { textTransform: 'none', fontWeight: '600', fontSize: '16px', letterSpacing: '0.3px' },
    },
    components: {
      MuiButton: { styleOverrides: { root: { borderRadius: '4px', padding: '6px 16px', transition: 'all 0.3s ease-in-out' } } },
    },
  });

  const menuItems = [
    { label: 'Hombre', path: '/cliente/hombres', icon: <ManIcon /> },
    { label: 'Mujer', path: '/cliente/mujeres', icon: <WomanIcon /> },
    { label: 'Ofertas', path: '/cliente/ofertasCliente', icon: <LocalOfferIcon /> },
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
      <AppBar position="sticky" elevation={3} sx={{ backgroundColor: theme.palette.background.paper }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Izquierda: Logo y Buscador */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                  width: isMobile ? 45 : 55,
                  height: isMobile ? 45 : 55,
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
              </Box>
              <SearchBox sx={{ ml: 2 }}>
                <StyledInputBase
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  startAdornment={<SearchIcon sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)', fontSize: '1.2rem', ml: 0.5, mr: 1 }} />}
                />
                {openSearch && (
                  <Paper
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      mt: 1,
                      width: '100%',
                      maxHeight: '300px',
                      overflowY: 'auto',
                      backgroundColor: theme.palette.background.paper,
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
                      <Typography variant="body2" sx={{ p: 2, color: theme.palette.text.secondary }}>
                        No se encontraron productos
                      </Typography>
                    )}
                  </Paper>
                )}
              </SearchBox>
            </Box>

            {/* Centro: Menú (Hombre, Mujer, Ofertas) */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', flexGrow: 1, gap: 2 }}>
              {menuItems.map((item, index) => (
                <Button
                  key={index}
                  onClick={() => navigate(item.path)}
                  startIcon={item.icon}
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
                      '&::after': { transform: 'scaleX(1)', transformOrigin: 'bottom left' }
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

            {/* Derecha: Iconos (Perfil, Carrito, Modo oscuro, Cerrar sesión) */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                onClick={() => navigate('/cliente/perfil')}
                size="large"
                aria-label="perfil"
                sx={{ 
                  color: theme.palette.primary.main,
                  transition: 'all 0.2s',
                  '&:hover': { 
                    backgroundColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                    transform: 'scale(1.05)'
                  } 
                }}
              >
                <PersonIcon />
              </IconButton>
              <IconButton
                onClick={() => navigate('/cliente/carrito')}
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
                <Badge badgeContent={cartCount} color="error">
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
              <IconButton
                onClick={handleLogout}
                size="large"
                aria-label="cerrar sesión"
                sx={{ 
                  color: '#FF4C4C',
                  transition: 'all 0.2s',
                  '&:hover': { 
                    backgroundColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                    transform: 'scale(1.05)'
                  } 
                }}
              >
                <LogoutIcon />
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
                    sx={{ color: theme.palette.text.primary }}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    keepMounted
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
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
                        sx={{ py: 1.5, px: 3, fontWeight: 500 }}
                      >
                        {item.label}
                      </MenuItem>
                    ))}
                    <MenuItem 
                      onClick={() => handleMenuItemClick('/cliente/perfil')}
                      sx={{ py: 1.5, px: 3, fontWeight: 500 }}
                    >
                      Perfil
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

export default BarraNavCliente;


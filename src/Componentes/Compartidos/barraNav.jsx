import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Box, Button, TextField, InputAdornment, Typography, Container, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import logo from '../imagenes/LogoGL.jpg';

const BarraNav = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#121212' : '#FFFFFF';
    document.body.style.color = darkMode ? '#FFFFFF' : '#000000';
  }, [darkMode]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/buscar?q=${searchTerm}`);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
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
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '25px',
              transition: 'all 0.3s ease-in-out',
            },
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

  return (
    <ThemeProvider theme={theme}>
      {/* Top Info Bar with subtle gradient */}
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

      {/* Logo and Title with improved styling */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '22px 0',
        background: darkMode 
          ? 'linear-gradient(to right, #0f2027, #203a43, #2c5364)' 
          : 'linear-gradient(to right, #7F7FD5, #91EAE4)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            padding: '8px 16px',
            borderRadius: '8px',
            backdropFilter: 'blur(5px)',
            background: 'rgba(255,255,255,0.1)',
          }}>
            <img
              src={logo}
              alt="Logo GisLive"
              style={{ 
                width: '65px', 
                height: '65px', 
                marginRight: '16px', 
                borderRadius: '50%',
                border: '2px solid white',
                padding: '2px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
              }}
            />
            <Typography variant="h6" sx={{ 
              color: 'white', 
              fontSize: '26px', 
              fontWeight: '700',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}>
              GisLive Boutique Clínica
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Main Navigation Bar with refined styles */}
      <AppBar 
        position="sticky" 
        elevation={2}
        sx={{ 
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(30,30,30,0.95)' 
            : 'rgba(255,255,255,0.95)', 
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '8px 0',
          }}>
            
            {/* Search Bar with improved styling */}
            <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
              <TextField
                variant="outlined"
                placeholder="Buscar productos..."
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  width: { xs: '100%', sm: '420px' },
                  backgroundColor: darkMode ? 'rgba(80,80,80,0.2)' : 'rgba(255,255,255,0.9)',
                  borderRadius: '25px',
                  '& .MuiOutlinedInput-root': {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                      borderWidth: '1px',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: theme.palette.text.primary,
                    fontSize: '15px',
                    padding: '10px 14px',
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={handleSearch}
                        sx={{ 
                          color: theme.palette.primary.main,
                          '&:hover': { 
                            backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                          } 
                        }}
                      >
                        <SearchIcon sx={{ fontSize: '22px' }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Desktop Navigation Buttons with refined styling */}
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              alignItems: 'center',
              gap: 1.5 
            }}>
              <IconButton 
                onClick={() => navigate('/carrito')} 
                sx={{ 
                  color: theme.palette.primary.main,
                  transition: 'all 0.2s',
                  '&:hover': { 
                    backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    transform: 'scale(1.05)'
                  } 
                }}
              >
                <ShoppingCartIcon />
              </IconButton>

              <Divider orientation="vertical" flexItem sx={{ 
                mx: 1, 
                height: '24px', 
                alignSelf: 'center',
                backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
              }} />

              {menuItems.map((item, index) => (
                <Button 
                  key={index} 
                  onClick={() => navigate(item.path)} 
                  sx={{
                    color: theme.palette.text.primary,
                    fontSize: '15px',
                    fontWeight: '600',
                    position: 'relative',
                    padding: '6px 12px',
                    '&:hover': { 
                      color: theme.palette.primary.main,
                      backgroundColor: 'transparent',
                      '&::after': {
                        width: '100%',
                        left: '0%',
                      }
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      width: '0%',
                      height: '2px',
                      bottom: '2px',
                      left: '50%',
                      backgroundColor: theme.palette.primary.main,
                      transition: 'all 0.3s ease-in-out',
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}

              <Divider orientation="vertical" flexItem sx={{ 
                mx: 1, 
                height: '24px', 
                alignSelf: 'center',
                backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
              }} />

              {/* Dark/Light Mode Toggle with animation */}
              <IconButton 
                onClick={toggleDarkMode} 
                sx={{ 
                  color: darkMode ? '#FFC107' : '#5C6BC0',
                  transition: 'all 0.3s ease',
                  animation: darkMode ? 'none' : 'none',
                  transform: darkMode ? 'rotate(180deg)' : 'rotate(0deg)',
                  '&:hover': { 
                    backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    transform: darkMode ? 'rotate(180deg) scale(1.1)' : 'rotate(0deg) scale(1.1)'
                  }
                }}
              >
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Box>
            
            {/* Mobile Navigation Icons with improved styling */}
            <Box sx={{ 
              display: { xs: 'flex', md: 'none' },
              gap: 1
            }}>
              <IconButton 
                onClick={toggleDarkMode} 
                sx={{ 
                  color: darkMode ? '#FFC107' : '#5C6BC0',
                  transition: 'transform 0.3s ease',
                  transform: darkMode ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              >
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
              <IconButton 
                onClick={() => navigate('/carrito')} 
                sx={{ 
                  color: theme.palette.primary.main,
                  position: 'relative',
                }}
              >
                <ShoppingCartIcon />
                <Box sx={{
                  position: 'absolute',
                  top: '0px',
                  right: '0px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: theme.palette.error.main,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}></Box>
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};

export default BarraNav;
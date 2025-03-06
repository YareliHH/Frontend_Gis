import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Box, Button, TextField, InputAdornment, Typography } from '@mui/material';  
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import logo from '../imagenes/LogoGL.jpg';

const BarraNavCliente = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#121212' : '#FFFFFF'; // Fondo del body
    document.body.style.color = darkMode ? '#FFFFFF' : '#000000'; // Color de texto en el body
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
        main: darkMode ? '#1e1e1e' : '#87CEEB', // Color principal (fondo barra de navegación)
      },
      background: {
        default: darkMode ? '#121212' : '#FFFFFF', // Fondo general
        paper: darkMode ? '#1e1e1e' : '#FFFFFF', // Fondo de la tarjeta/papel
      },
      text: {
        primary: darkMode ? '#FFFFFF' : '#000000', // Color de texto principal
      },
    },
    typography: {
      fontFamily: 'Montserrat, sans-serif',
      h6: {
        fontWeight: 700,
        fontSize: '40px',
      },
      button: {
        textTransform: 'none',
        fontWeight: 'bold',
        fontSize: '18px',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      {/* Barra superior - puedes cambiar el color de fondo aquí */}
      <Box sx={{ backgroundColor: darkMode ? '#222' : '#15263f', color: 'white', textAlign: 'center', padding: '10px 0' }}>
        Tel: 7898964861 | 2223308869 | gislive17@gmail.com | ¡ENVÍOS GRATIS EN COMPRAS MAYORES A $2,500!
      </Box>
      
      {/* Logo y título - cambia el color de fondo aquí */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px 0', backgroundColor: '#b3cde0' }}>
        <img 
          src={logo} 
          alt="Logo GisLive" 
          style={{ width: '60px', height: '60px', marginRight: '8px', borderRadius: '50%' }} 
        />
        <Typography variant="h6" sx={{ color: 'white', textAlign: 'center', fontSize: '20px' }}> GisLive Boutique Clínica
        </Typography>
      </Box>

      {/* Barra de navegación */}
      <AppBar position="static" sx={{ backgroundColor: theme.palette.primary.main }}> {/* Cambia color de fondo de la barra de navegación */}
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {/* Barra de búsqueda - cambia el color del fondo y del texto */}
          <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
            <TextField
              variant="outlined"
              placeholder="Buscar aqui..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                width: '600px',
                backgroundColor: darkMode ? '#333' : '#fff', // Cambiar color de fondo
                borderRadius: '5px',
                '& .MuiInputBase-input': { 
                  color: darkMode ? '#fff' : '#000', // Cambiar color de texto
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
          </Box>

          {/* Iconos de navegación - Cambiar el color de los iconos */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <IconButton onClick={() => navigate('/carrito')} sx={{ color: theme.palette.text.primary }}>
              <ShoppingCartIcon />
            </IconButton>

            {[ 
              { label: 'Hombre', path: '/hombre' },
              { label: 'Mujer', path: '/mujer' },
              { label: 'Ofertas Especiales', path: '/ofertasCliente' },
              { label: 'Perfil', path: '/perfil' },
              { label: 'Cerrar Sesion', path: '/' },
            ].map((item, index) => (
              <Button key={index} onClick={() => navigate(item.path)} sx={{ color: theme.palette.text.primary }}>
                {item.label}
              </Button>
            ))}

            {/* Icono de modo oscuro/claro */}
            <IconButton onClick={toggleDarkMode} sx={{ color: theme.palette.text.primary }}>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default BarraNavCliente;
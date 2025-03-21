import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Hombre = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [products, setProducts] = useState([]); // Estado para los productos
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener los productos del género Hombre desde la API
    axios
      .get('http://localhost:3001/api/Mujeres') // Usamos axios en lugar de fetch
      .then((response) => {
        setProducts(response.data); // Guardamos los productos en el estado
      })
      .catch((error) => {
        console.error('Error al obtener productos:', error);
      });

    // Manejo del tema oscuro
    const matchDarkTheme = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(matchDarkTheme.matches);
    const handleThemeChange = (e) => setIsDarkMode(e.matches);
    matchDarkTheme.addEventListener('change', handleThemeChange);

    return () => matchDarkTheme.removeEventListener('change', handleThemeChange);

  }, []); // Solo se ejecuta una vez después del primer renderizado

  const colors = {
    background: isDarkMode ? '#121212' : '#FFFFFF',
    primaryText: '#000000',
  };

  const handleProductClick = (product) => {
    navigate(`/detallesp/${product.id}`); // Solo pasa el id del producto
  };

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Título */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h4" sx={{ color: colors.primaryText, fontWeight: 'bold', fontFamily: 'Roboto Serif, serif' }}>
          Vistiendo Profesionales
        </Typography>
      </Box>
      {/* Subtítulo */}
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h4" sx={{ color: colors.primaryText, fontFamily: 'Roboto', fontStyle: 'italic' }}>
          Boutique Clínica Creamos Uniformes de alta gama, dirigida a los profesionales de la salud.
        </Typography>
      </Box>

      {/* Productos */}
      <Grid container spacing={4} justifyContent="center">
        {products.map((product, index) => (
          <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center', position: 'relative' }}>
              {/* Etiqueta de disponibilidad */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 10,
                  left: 10,
                  backgroundColor: product.stock === 'En Stock' ? 'green' : product.stock === 'Últimas piezas' ? 'orange' : 'red',
                  color: 'white',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  fontSize: '12px',
                }}
              >
                {product.stock}
              </Box>
              {/* Imagen del producto */}
              <img
                src={product.url}
                alt={product.nombre_producto}
                style={{ width: '80%', height: 'auto', borderRadius: '10px', margin: '0 auto', display: 'block' }}
              />
              {/* Nombre del producto como enlace */}
              <Typography
                variant="h6"
                component="a"
                onClick={() => handleProductClick(product)}
                sx={{
                  color: colors.primaryText,
                  mt: 2,
                  fontFamily: 'Montserrat, sans-serif',
                  textAlign: 'center',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  '&:hover': { color: 'blue' },
                }}
              >
                {product.nombre_producto}
              </Typography>
              {/* Precio y tipo */}
              <Typography variant="body2" sx={{ color: colors.primaryText, fontWeight: 'bold', fontFamily: 'Roboto', textAlign: 'center' }}>
                {product.precio}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.primaryText, fontFamily: 'Montserrat, sans-serif', textAlign: 'center' }}>
                Tipo: {product.tipo}
              </Typography>
              {/* Icono de carrito */}
              <ShoppingCartIcon sx={{ mt: 1, color: 'gray', cursor: 'pointer', '&:hover': { color: 'black' } }} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Hombre;

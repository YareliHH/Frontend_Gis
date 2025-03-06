import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';

// Importar las imágenes locales de los productos y el fondo
import img21 from '../imagenes/img21.jpg';
import img10 from '../imagenes/img10.jpg';
import img11 from '../imagenes/img11.jpg';
import img20 from '../imagenes/img20.jpg';
import img3 from '../imagenes/img3.jpg'; // Nueva imagen
import img18 from '../imagenes/img18.jpg'; // Nueva imagen
import img22 from '../imagenes/img22.jpg'; // Nueva imagen
import img23 from '../imagenes/img23.jpg'; // Nueva imagen

const Mujer = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const matchDarkTheme = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(matchDarkTheme.matches);

    const handleThemeChange = (e) => {
      setIsDarkMode(e.matches);
    };

    matchDarkTheme.addEventListener('change', handleThemeChange);

    return () => {
      matchDarkTheme.removeEventListener('change', handleThemeChange);
    };
  }, []);

  const colors = {
    background: isDarkMode ? '#121212' : '#FFFFFF',
    primaryText: '#000000', // Color negro para las letras
    button: '#40E0D0', // Turquesa
  };

  const products = [
    { image: img10, name: "Uniforme Clínico", price: "$50", type: "Clínico" },
    { image: img11, name: "Batas Quirúrgicas", price: "$80", type: "Quirúrgico" },
    { image: img20, name: "Camisón Médico", price: "$45", type: "Clínico" },
    { image: img21, name: "Mascarilla Quirúrgica", price: "$15", type: "Quirúrgico" }
  ];

  const newProducts = [
    { image: img3, name: "Gorro Quirúrgico", price: "$12", type: "Quirúrgico" },
    { image: img18, name: "Guantes Clínicos", price: "$20", type: "Clínico" },
    { image: img22, name: "Bata Estéril", price: "$70", type: "Quirúrgico" },
    { image: img23, name: "Zapatillas Médicas", price: "$30", type: "Clínico" }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Fondo */}
      <Box
        component="div"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          zIndex: -1, // Detrás del contenido
        }}
      />

{/* Título */}
<Box sx={{ textAlign: 'center', mb: 6 }}>
  <Typography
    variant="h4"
    sx={{
      color: colors.primaryText,
      fontWeight: 'bold',
      fontFamily: 'Montserrat, sans-serif',
    }}
  >
    Vistiendo Profesionales
  </Typography>
</Box>


      {/* Productos */}
      <Grid container spacing={4} justifyContent="center">
        {products.map((product, index) => (
          <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center' }}>
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: '80%', // Aumentar el tamaño de la imagen y centrarla
                  height: 'auto',
                  borderRadius: '10px',
                  margin: '0 auto', // Centrar la imagen
                  display: 'block',
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  color: colors.primaryText,
                  mt: 2,
                  fontFamily: 'Roboto Serif, serif',
                  textAlign: 'center',
                }}
              >
                {product.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: colors.primaryText,
                  marginBottom: 1,
                  fontWeight: 'bold',
                  fontFamily: 'Roboto Serif, serif',
                  textAlign: 'center',
                }}
              >
                {product.price}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: colors.primaryText,
                  fontFamily: 'Roboto Serif, serif',
                  textAlign: 'center',
                }}
              >
                Tipo: {product.type}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Nuevos productos */}
      <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
        {newProducts.map((product, index) => (
          <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center' }}>
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: '80%', // Aumentar el tamaño de la imagen y centrarla
                  height: 'auto',
                  borderRadius: '10px',
                  margin: '0 auto', // Centrar la imagen
                  display: 'block',
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  color: colors.primaryText,
                  mt: 2,
                  fontFamily: 'Roboto Serif, serif',
                  textAlign: 'center',
                }}
              >
                {product.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: colors.primaryText,
                  marginBottom: 1,
                  fontWeight: 'bold',
                  fontFamily: 'Roboto Serif, serif',
                  textAlign: 'center',
                }}
              >
                {product.price}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: colors.primaryText,
                  fontFamily: 'Roboto Serif, serif',
                  textAlign: 'center',
                }}
              >
                Tipo: {product.type}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Mujer;

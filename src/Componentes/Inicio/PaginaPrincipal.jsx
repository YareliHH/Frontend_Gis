import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, CardMedia } from '@mui/material';

// Importar las imágenes locales de los productos
import img1 from '../imagenes/img1.png';
import img2 from '../imagenes/img2.jpg';
import img3 from '../imagenes/img3.jpg';
import img4 from '../imagenes/img4.jpg';
import img5 from '../imagenes/img5.jpg';
import img6 from '../imagenes/img6.jpg';

const PaginaPrincipal = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detectar el tema del sistema
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
    background: '#FFFFFF', 
    primaryText: isDarkMode ? '#82B1FF' : '#1E3A5F', 
    secondaryText: isDarkMode ? '#B0BEC5' : '#4C6E8D', 
    cardBackground: isDarkMode ? '#4C6E8D' : '#FFFFFF', 
    cardHover: isDarkMode ? '#3A5F7A' : '#D1E9FF', 
  };

  return (
    <Box
      sx={{
        background: colors.background,
        minHeight: '100vh',
        margin: 0,
        padding: 0,
      }}
    >
      <Container maxWidth="lg" sx={{ py: 8 }} disableGutters>
        {/* Encabezado principal */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h5" // Tamaño más pequeño
            component="h1"
            sx={{
              fontWeight: 'bold',
              color: colors.primaryText,
              fontFamily: 'Roboto, sans-serif',
            }}
          >
            Bienvenidos a nuestra tienda de uniformes clínicos
          </Typography>
        </Box>

        {/* Sección de productos */}
        <Box component="section" sx={{ mb: 10 }}>
          <Typography
            variant="h6" // Tamaño más pequeño
            sx={{
              color: colors.primaryText,
              fontWeight: 'bold',
              textAlign: 'center',
              mb: 4,
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            Las mejores prendas de Gislive Boutique
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {[
              {
                title: 'Uniforme Médico Mujer',
                img: img1,
                description: 'Cómodo y resistente para tu jornada diaria.',
                price: '$250.00',
              },
              {
                title: 'Uniforme Médico Mujer',
                img: img2,
                description: 'Elegante y práctico para una apariencia profesional.',
                price: '$300.00',
              },
              {
                title: 'Uniforme Médico Mujer',
                img: img3,
                description: 'Alta calidad y confort para el quirófano.',
                price: '$250.00',
              },
              {
                title: 'Uniforme Médico Mujer',
                img: img4,
                description: 'Alta calidad y confort para el quirófano.',
                price: '$300.00',
              },
              {
                title: 'Uniforme Médico Mujer',
                img: img5,
                description: 'Alta calidad y confort para el quirófano.',
                price: '$350.00',
              },
              {
                title: 'Uniforme Médico Mujer',
                img: img6,
                description: 'Alta calidad y confort para el quirófano.',
                price: '$350.00',
              },
            ].map((product, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    boxShadow: 3,
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    transition: 'transform 0.3s ease',
                    backgroundColor: colors.cardBackground,
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'scale(1.05)', 
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    alt={product.title}
                    image={product.img}
                    sx={{
                      height: 150, // Imagen más pequeña
                      width: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="subtitle1" // Títulos más pequeños
                      sx={{
                        fontWeight: 'bold',
                        color: colors.secondaryText,
                        mb: 1,
                        fontFamily: 'Montserrat, sans-serif',
                      }}
                    >
                      {product.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.secondaryText }}>
                      {product.description}
                    </Typography>
                    <Typography
                      variant="body1" // Precio con tamaño más pequeño
                      sx={{
                        fontWeight: 'bold',
                        color: colors.primaryText,
                        mt: 1,
                      }}
                    >
                      {product.price}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default PaginaPrincipal;

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
} from '@mui/material';
import { Phone, Email } from '@mui/icons-material';

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
    background: isDarkMode
      ? 'linear-gradient(135deg, #1A2A3A 30%, #1D2A38 100%)' // Gradiente en modo oscuro
      : '#FFFFFF', // Fondo blanco en modo claro
    primaryText: isDarkMode ? '#82B1FF' : '#FFFFFF', // Azul brillante en oscuro
    secondaryText: isDarkMode ? '#B0BEC5' : '#FFFFF', // Gris claro en oscuro
    cardBackground: isDarkMode ? '#2A3A4A' : '#FFFFFF', // Fondo de tarjeta en modo claro
    cardHover: isDarkMode ? '#3A4A5A' : '#E3F2FD', // Fondo de tarjeta al pasar el ratón
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
      <Container maxWidth="lg" sx={{ py: 10 }} disableGutters>
        {/* Encabezado principal */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 'bold',
              color: colors.primaryText,
              fontFamily: 'Roboto, sans-serif',
            }}
          >
          </Typography>
        </Box>

        {/* Sección de productos */}
        <Box component="section" sx={{ mb: 12 }}>
          <Typography
            variant="h4"
            sx={{
              color: colors.primaryText,
              fontWeight: 'bold',
              textAlign: 'center',
              mb: 6,
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            Nuestros Productos
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {[ 
              {
                title: 'Uniforme Médico Mujer',
                img: img1,
                description: 'Cómodo y resistente para tu jornada diaria.',
              },
              {
                title: 'Uniforme Médico Mujer',
                img: img2,
                description: 'Elegante y práctico para una apariencia profesional.',
              },
              {
                title: 'Uniforme Médico Mujer',
                img: img3,
                description: 'Alta calidad y confort para el quirófano.',
              },
              {
                title: 'Uniforme Médico Mujer',
                img: img4,
                description: 'Alta calidad y confort para el quirófano.',
              },
              {
                title: 'Uniforme Médico Mujer',
                img: img5,
                description: 'Alta calidad y confort para el quirófano.',
              },
              {
                title: 'Uniforme Médico Mujer',
                img: img6,
                description: 'Alta calidad y confort para el quirófano.',
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
                      transform: 'scale(1.05)', // Animación de zoom al pasar el ratón
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    alt={product.title}
                    image={product.img}
                    sx={{
                      height: 300, // Imagen más grande
                      width: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 'bold',
                        color: colors.secondaryText,
                        mb: 2,
                        fontFamily: 'Montserrat, sans-serif',
                      }}
                    >
                      {product.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.secondaryText }}>
                      {product.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Sección de contacto */}
        <Box
          component="section"
          sx={{
            backgroundColor: colors.cardBackground,
            py: 8,
            borderRadius: '16px',
            boxShadow: 3,
            mb: 5,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: colors.primaryText,
              fontWeight: 'bold',
              textAlign: 'center',
              mb: 6,
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            Contáctanos
          </Typography>
          <Typography variant="body1" sx={{ color: colors.secondaryText, textAlign: 'center', mb: 3 }}>
            Visítanos en nuestra tienda o contáctanos para más información.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
            <IconButton color="primary" sx={{ fontSize: 40 }}>
              <Phone />
            </IconButton>
            <Typography variant="body2" sx={{ color: colors.secondaryText }}>
              <strong>Teléfono:</strong> 7711443389
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 2 }}>
            <IconButton color="primary" sx={{ fontSize: 40 }}>
              <Email />
            </IconButton>
            <Typography variant="body2" sx={{ color: colors.secondaryText }}>
              <strong>Email:</strong> gislive@gmail.com
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: colors.secondaryText, textAlign: 'center', mt: 3 }}>
            <strong>Ubicación:</strong> Velazque Ibarra, #12, Huejutla de Reyes, Hidalgo, México
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default PaginaPrincipal;

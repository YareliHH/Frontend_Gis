import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Container, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions,
  Button,
  IconButton,
  Chip,
  Paper,
  Divider,
  alpha,
  Slide,
  Fade,
  Zoom
} from '@mui/material';
import { 
  ShoppingBag as ShoppingBagIcon,
  FavoriteBorder as FavoriteBorderIcon,
  LocalShipping as LocalShippingIcon,
  Verified as VerifiedIcon,
  NewReleases as NewReleasesIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material';

// Importar las imágenes locales de los productos y el fondo
import img21 from '../imagenes/img21.jpg';
import img10 from '../imagenes/img10.jpg';
import img11 from '../imagenes/img11.jpg';
import img20 from '../imagenes/img20.jpg';
import img3 from '../imagenes/img3.jpg';
import img18 from '../imagenes/img18.jpg';
import img22 from '../imagenes/img22.jpg';
import img23 from '../imagenes/img23.jpg';

const PaginaCliente = () => {
  // Iniciar con tema claro por defecto (false = tema claro)
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  // Efecto para detectar cambios en el tema del sistema
  useEffect(() => {
    const matchDarkTheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // No cambiamos automáticamente al iniciar, mantenemos false (tema claro)
    // setIsDarkMode(matchDarkTheme.matches);

    const handleThemeChange = (e) => {
      setIsDarkMode(e.matches);
    };

    matchDarkTheme.addEventListener('change', handleThemeChange);

    return () => {
      matchDarkTheme.removeEventListener('change', handleThemeChange);
    };
  }, []);

  // Definir colores según el tema
  const colors = {
    background: isDarkMode ? '#121212' : '#FFFFFF',
    primaryText: isDarkMode ? '#FFFFFF' : '#000000', 
    button: '#40E0D0', // Turquesa original
    
    // Colores adicionales para el diseño mejorado
    cardBg: isDarkMode ? '#1e1e1e' : '#FFFFFF',
    secondaryText: isDarkMode ? '#b0b0b0' : '#505050',
    border: isDarkMode ? '#333333' : '#e0e0e0',
    shadow: isDarkMode ? '0 8px 16px rgba(0, 0, 0, 0.4)' : '0 8px 16px rgba(0, 0, 0, 0.1)',
    buttonHover: isDarkMode ? alpha('#40E0D0', 0.2) : alpha('#40E0D0', 0.1),
    highlight: isDarkMode ? '#4caf50' : '#2e7d32',
  };

  // Productos destacados
  const featuredProducts = [
    { 
      image: img10, 
      name: "Uniforme Clínico Premium", 
      price: "$50", 
      type: "Clínico",
      rating: 4.8,
      description: "Uniforme de alta calidad, cómodo y duradero, ideal para profesionales de la salud."
    },
    { 
      image: img11, 
      name: "Batas Quirúrgicas Estériles", 
      price: "$80", 
      type: "Quirúrgico",
      rating: 4.9,
      description: "Batas quirúrgicas fabricadas con materiales premium para máxima protección."
    },
    { 
      image: img20, 
      name: "Camisón Médico Ligero", 
      price: "$45", 
      type: "Clínico",
      rating: 4.5,
      description: "Camisón ligero y transpirable, perfecto para largas jornadas de trabajo."
    },
    { 
      image: img21, 
      name: "Mascarilla Quirúrgica N95", 
      price: "$15", 
      type: "Quirúrgico",
      rating: 4.7,
      description: "Mascarillas de alta filtración, cómodas y seguras para uso prolongado."
    }
  ];

  // Nuevos productos
  const newProducts = [
    { 
      image: img3, 
      name: "Gorro Quirúrgico Desechable", 
      price: "$12", 
      type: "Quirúrgico",
      rating: 4.6,
      description: "Gorros desechables con diseño ergonómico y material transpirable."
    },
    { 
      image: img18, 
      name: "Guantes Clínicos Nitrilo", 
      price: "$20", 
      type: "Clínico",
      rating: 4.8,
      description: "Guantes de nitrilo sin látex, con excelente sensibilidad táctil."
    },
    { 
      image: img22, 
      name: "Bata Estéril Reforzada", 
      price: "$70", 
      type: "Quirúrgico",
      rating: 4.9,
      description: "Batas estériles con refuerzo en áreas críticas para mayor protección."
    },
    { 
      image: img23, 
      name: "Zapatillas Médicas Comfort", 
      price: "$30", 
      type: "Clínico",
      rating: 4.7,
      description: "Zapatillas ergonómicas con plantilla de gel para máximo confort."
    }
  ];

  // Handler para el hover de productos
  const handleProductHover = (index, isNew = false) => {
    setHoveredProduct({index, isNew});
  };

  // Handler para el fin del hover
  const handleProductLeave = () => {
    setHoveredProduct(null);
  };

  // Función para renderizar estrellas de calificación
  const renderRating = (rating) => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', my: 0.5 }}>
        {[...Array(5)].map((_, i) => (
          <StarBorderIcon 
            key={i} 
            sx={{ 
              fontSize: '18px',
              color: i < Math.floor(rating) ? colors.button : colors.secondaryText,
              mr: 0.2
            }} 
          />
        ))}
        <Typography 
          variant="body2" 
          sx={{ ml: 0.5, color: colors.secondaryText }}
        >
          ({rating})
        </Typography>
      </Box>
    );
  };

  // Función para renderizar un producto
  const renderProduct = (product, index, isNew = false) => {
    const isHovered = hoveredProduct && 
                     hoveredProduct.index === index && 
                     hoveredProduct.isNew === isNew;
    
    return (
      <Grid 
        item 
        xs={12} 
        sm={6} 
        md={3} 
        key={index}
      >
        <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
          <Card 
            elevation={isHovered ? 8 : 2}
            onMouseEnter={() => handleProductHover(index, isNew)}
            onMouseLeave={handleProductLeave}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: colors.cardBg,
              borderRadius: 2,
              transition: 'all 0.3s ease',
              transform: isHovered ? 'translateY(-5px)' : 'none',
              overflow: 'hidden',
              border: `1px solid ${colors.border}`,
              position: 'relative',
            }}
          >
            {/* Etiqueta de "Nuevo" para nuevos productos */}
            {isNew && (
              <Chip 
                icon={<NewReleasesIcon />}
                label="Nuevo" 
                size="small"
                sx={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  backgroundColor: colors.highlight,
                  color: 'white',
                  zIndex: 10,
                  fontWeight: 'bold',
                }}
              />
            )}
            
            {/* Imagen del producto */}
            <Box sx={{ position: 'relative', pt: '80%', overflow: 'hidden' }}>
              <CardMedia
                component="img"
                image={product.image}
                alt={product.name}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease',
                  transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                }}
              />
              
              {/* Overlay con botones al hacer hover */}
              <Fade in={isHovered}>
                <Box 
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: alpha(colors.cardBg, 0.8),
                    display: 'flex',
                    justifyContent: 'center',
                    padding: 1,
                  }}
                >
                  <IconButton 
                    size="small" 
                    sx={{ 
                      color: colors.button,
                      '&:hover': { backgroundColor: colors.buttonHover }
                    }}
                  >
                    <FavoriteBorderIcon />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    sx={{ 
                      color: colors.button,
                      mx: 1,
                      '&:hover': { backgroundColor: colors.buttonHover }
                    }}
                  >
                    <ShoppingBagIcon />
                  </IconButton>
                </Box>
              </Fade>
            </Box>
            
            {/* Contenido del producto */}
            <CardContent sx={{ flexGrow: 1, p: 2 }}>
              {/* Tipo de producto */}
              <Chip 
                size="small" 
                label={product.type} 
                sx={{ 
                  mb: 1,
                  backgroundColor: alpha(colors.button, 0.1),
                  color: colors.button,
                  fontWeight: 500,
                }}
              />
              
              {/* Nombre del producto */}
              <Typography 
                variant="h6" 
                sx={{
                  color: colors.primaryText,
                  fontWeight: 600,
                  fontSize: '1rem',
                  mb: 0.5,
                  height: '2.5rem',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {product.name}
              </Typography>
              
              {/* Calificación */}
              {renderRating(product.rating)}
              
              {/* Descripción */}
              <Typography 
                variant="body2" 
                color={colors.secondaryText}
                sx={{
                  mt: 1,
                  height: '3rem',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {product.description}
              </Typography>
            </CardContent>
            
            {/* Pie de tarjeta con precio y botón */}
            <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 0 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: colors.button,
                  fontWeight: 'bold' 
                }}
              >
                {product.price}
              </Typography>
              
              <Button 
                variant="contained"
                size="small"
                startIcon={<ShoppingBagIcon />}
                sx={{
                  backgroundColor: colors.button,
                  color: '#000',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: alpha(colors.button, 0.8),
                  }
                }}
              >
                Comprar
              </Button>
            </CardActions>
          </Card>
        </Zoom>
      </Grid>
    );
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: colors.background,
        color: colors.primaryText,
        transition: 'background-color 0.3s ease, color 0.3s ease',
        pt: 2,
        pb: 6,
      }}
    >
      <Container maxWidth="xl">
        {/* Banner principal */}
        <Fade in={true} timeout={1000}>
          <Paper 
            elevation={3}
            sx={{
              mb: 6,
              p: { xs: 3, md: 5 },
              borderRadius: 2,
              backgroundImage: `linear-gradient(to right, ${alpha(colors.cardBg, 0.9)}, ${alpha(colors.cardBg, 0.7)}), url('https://images.unsplash.com/photo-1581056771107-24ca5f033842?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h3"
              sx={{
                color: colors.primaryText,
                fontWeight: 800,
                mb: 2,
                textShadow: isDarkMode ? '1px 1px 3px rgba(0,0,0,0.3)' : 'none',
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
              }}
            >
              Bienvenidos a GisLive Boutique Clínica
            </Typography>
            
            <Typography
              variant="h5"
              sx={{
                color: colors.secondaryText,
                fontWeight: 400,
                mb: 4,
                maxWidth: '800px',
                lineHeight: 1.5,
                fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
              }}
            >
              Descubre nuestra exclusiva colección de uniformes y accesorios médicos de la más alta calidad
            </Typography>
            
            <Box 
              sx={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 2,
                mt: 2 
              }}
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingBagIcon />}
                sx={{
                  backgroundColor: colors.button,
                  color: '#000',
                  fontWeight: 'bold',
                  px: 4,
                  py: 1.5,
                  borderRadius: '30px',
                  '&:hover': {
                    backgroundColor: alpha(colors.button, 0.8),
                    transform: 'translateY(-3px)',
                    boxShadow: '0 6px 10px rgba(0,0,0,0.2)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Ver Catálogo
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: colors.button,
                  color: colors.button,
                  fontWeight: 'bold',
                  px: 4,
                  py: 1.5,
                  borderRadius: '30px',
                  '&:hover': {
                    borderColor: colors.button,
                    backgroundColor: colors.buttonHover,
                    transform: 'translateY(-3px)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Saber más
              </Button>
            </Box>
            
            {/* Características destacadas */}
            <Box 
              sx={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: { xs: 2, md: 4 },
                mt: 5,
                width: '100%'
              }}
            >
              {[
                { icon: <VerifiedIcon />, text: 'Calidad Garantizada' },
                { icon: <LocalShippingIcon />, text: 'Envío Gratis +$2,500' },
                { icon: <StarBorderIcon />, text: 'Productos Premium' }
              ].map((feature, idx) => (
                <Box 
                  key={idx}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: colors.button
                  }}
                >
                  {feature.icon}
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      ml: 1, 
                      fontWeight: 500,
                      color: colors.primaryText
                    }}
                  >
                    {feature.text}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Fade>

        {/* Sección de productos destacados */}
        <Box sx={{ mb: 6 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  color: colors.primaryText,
                  fontWeight: 700,
                  position: 'relative',
                  display: 'inline-block',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: '60px',
                    height: '4px',
                    backgroundColor: colors.button,
                    borderRadius: '2px'
                  }
                }}
              >
                Productos Destacados
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: colors.secondaryText,
                  mt: 2
                }}
              >
                Nuestra selección de los mejores uniformes clínicos
              </Typography>
            </Box>
            
            <Button
              variant="text"
              sx={{
                color: colors.button,
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: colors.buttonHover
                }
              }}
            >
              Ver todo
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            {featuredProducts.map((product, index) => renderProduct(product, index))}
          </Grid>
        </Box>
        
        {/* Sección de nuevos productos */}
        <Box sx={{ mb: 4 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  color: colors.primaryText,
                  fontWeight: 700,
                  position: 'relative',
                  display: 'inline-block',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: '60px',
                    height: '4px',
                    backgroundColor: colors.button,
                    borderRadius: '2px'
                  }
                }}
              >
                Nuevos Productos
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: colors.secondaryText,
                  mt: 2
                }}
              >
                Los productos más recientes en nuestra colección
              </Typography>
            </Box>
            
            <Button
              variant="text"
              sx={{
                color: colors.button,
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: colors.buttonHover
                }
              }}
            >
              Ver todo
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            {newProducts.map((product, index) => renderProduct(product, index, true))}
          </Grid>
        </Box>
        
        {/* Banner informativo */}
        <Fade in={true} timeout={800}>
          <Paper 
            elevation={3}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 2,
              backgroundColor: alpha(colors.button, isDarkMode ? 0.2 : 0.1),
              border: `1px solid ${alpha(colors.button, 0.3)}`,
              mt: 6
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography
                  variant="h5"
                  sx={{
                    color: colors.primaryText,
                    fontWeight: 700,
                    mb: 2
                  }}
                >
                  GisLive Boutique Clínica - Calidad y Estilo Profesional
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: colors.secondaryText,
                    mb: 3
                  }}
                >
                  Nos especializamos en ofrecer los mejores uniformes y equipamiento médico, combinando profesionalismo, 
                  comodidad y estilo. Nuestra tela de alta calidad garantiza durabilidad y confort durante largas jornadas.
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 3 }}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: colors.button,
                      color: '#000',
                      fontWeight: 'bold',
                      '&:hover': {
                        backgroundColor: alpha(colors.button, 0.8),
                      }
                    }}
                  >
                    Contáctanos
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: colors.button,
                      color: colors.button,
                      fontWeight: 'bold',
                      '&:hover': {
                        borderColor: colors.button,
                        backgroundColor: colors.buttonHover,
                      }
                    }}
                  >
                    Sobre nosotros
                  </Button>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                <Box 
                  component="img"
                  src={img11} // Usar una de las imágenes de productos
                  alt="Calidad GisLive"
                  sx={{
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: 2,
                    boxShadow: colors.shadow,
                    transform: 'rotate(2deg)',
                    border: '8px solid white'
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default PaginaCliente;
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Button,
  Paper,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Divider,
  IconButton,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  Chip,
  TextField,
  Fade,
  Zoom,
  Slide,
  Avatar,
} from '@mui/material';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Icons
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Importar las imágenes locales de los productos y el fondo
import img1 from '../imagenes/img1.jpg';
import img2 from '../imagenes/img2.jpg';
import img3 from '../imagenes/img3.jpg';
import img4 from '../imagenes/img4.jpg';
import img5 from '../imagenes/img5.jpg';
import img6 from '../imagenes/img6.jpg';
import LogoGL from '../imagenes/LogoGL.jpg';

import axios from 'axios'; // Importar axios para hacer las peticiones

const PaginaPrincipal = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: '¡Hola! ¿En qué puedo ayudarte hoy?', sender: 'bot' },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [products, setProducts] = useState([]); // Estado para los productos
  const [activeSlide, setActiveSlide] = useState(0);

  // Efecto para iniciar animaciones al cargar la página
  useEffect(() => {
    setLoaded(true);
    // Cargar productos desde la API al montar el componente
    axios.get('https://backend-gis-1.onrender.com/api/productos')  // URL de la API para obtener los productos
      .then((response) => {
        setProducts(response.data);  // Asigna los datos obtenidos de la API a los productos
      })
      .catch((error) => {
        console.error('Error al obtener los productos:', error);
      });
  }, []);

  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const sendMessage = () => {
    if (inputMessage.trim() !== '') {
      setMessages([...messages, { text: inputMessage, sender: 'user' }]);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: 'Gracias por contactarnos. Un agente se comunicará contigo pronto.', sender: 'bot' },
        ]);
      }, 1000);
      setInputMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const addToCart = () => {
    setCartItems(cartItems + 1);
  };

  const colors = {
    background: '#FFFFFF',
    primaryText: '#000000',
    secondaryText: '#666666',
    button: '#40E0D0',
    buttonHover: '#37BFBF',
    accent: '#FF6B6B',
    light: '#F5F5F5',
    dark: '#333333',
    gradientStart: '#40E0D0',
    gradientEnd: '#4ECDC4',
  };

  const images = [img1, img2, img3, img4, img5, img6];

  // Componentes personalizados para las flechas del carousel
  const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <Box
        onClick={onClick}
        sx={{
          position: 'absolute',
          left: { xs: '10px', md: '20px' },
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: { xs: '36px', md: '48px' },
          height: { xs: '36px', md: '48px' },
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.8)',
          boxShadow: '0 3px 10px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 5px 15px rgba(0,0,0,0.25)',
            transform: 'translateY(-50%) scale(1.05)',
          }
        }}
      >
        <ArrowBackIosNewIcon fontSize={isMobile ? "small" : "medium"} sx={{ color: colors.dark, ml: 0.7 }} />
      </Box>
    );
  };

  const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <Box
        onClick={onClick}
        sx={{
          position: 'absolute',
          right: { xs: '10px', md: '20px' },
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: { xs: '36px', md: '48px' },
          height: { xs: '36px', md: '48px' },
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.8)',
          boxShadow: '0 3px 10px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 5px 15px rgba(0,0,0,0.25)',
            transform: 'translateY(-50%) scale(1.05)',
          }
        }}
      >
        <ArrowForwardIosIcon fontSize={isMobile ? "small" : "medium"} sx={{ color: colors.dark }} />
      </Box>
    );
  };

  // Configuración mejorada del slider
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: !isMobile,
    fade: true,
    cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    beforeChange: (current, next) => setActiveSlide(next),
    dotsClass: 'slick-dots custom-dots',
    appendDots: dots => (
      <Box 
        sx={{
          position: 'absolute',
          bottom: '25px',
          width: '100%',
          padding: '0',
          margin: '0',
          listStyle: 'none',
          textAlign: 'center',
          zIndex: 1
        }}
      >
        <ul style={{ margin: '0', padding: '0' }}>{dots}</ul>
      </Box>
    ),
    customPaging: i => (
      <Box
        sx={{
          width: i === activeSlide ? '12px' : '8px',
          height: i === activeSlide ? '12px' : '8px',
          background: i === activeSlide ? colors.button : 'rgba(255, 255, 255, 0.7)',
          border: i === activeSlide ? `2px solid white` : 'none',
          borderRadius: '50%',
          display: 'inline-block',
          margin: '0 4px',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}
      />
    ),
    responsive: [
      { breakpoint: 600, settings: { dots: true, arrows: false } },
    ],
  };

  const menuItems = ['Inicio', 'Productos', 'Clínicos', 'Quirúrgicos', 'Ofertas', 'Contacto'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 12 } },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: colors.background,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Mobile menu drawer */}
      <Drawer anchor="left" open={menuOpen} onClose={toggleMenu} TransitionComponent={Slide} TransitionProps={{ direction: 'right' }}>
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleMenu}>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              component="img"
              src={LogoGL}
              alt="GisLive Boutique"
              sx={{ height: 40, borderRadius: '50%', transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.1)' } }}
            />
            <Typography variant="h6" sx={{ fontFamily: 'Montserrat, sans-serif' }}>
              GisLive Boutique
            </Typography>
          </Box>
          <Divider />
          <List>
            {menuItems.map((text, index) => (
              <Fade in={menuOpen} style={{ transitionDelay: `${index * 50}ms` }} key={text}>
                <ListItem button>
                  <ListItemText primary={text} primaryTypographyProps={{ fontFamily: 'Montserrat, sans-serif' }} />
                </ListItem>
              </Fade>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main content */}
      <Container maxWidth={false} sx={{ py: 0, flexGrow: 1, width: '100vw', margin: 0 }}>
        {/* Hero section with full-screen slider */}
        <Zoom in={loaded} timeout={800}>
          <Box sx={{ width: '100vw', height: '100vh', position: 'relative', margin: 0 }}>
            <Paper
              elevation={5}
              sx={{
                borderRadius: 0,
                overflow: 'hidden',
                boxShadow: 'none',
                width: '100%',
                height: '100%',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '100px',
                  background: 'linear-gradient(0deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 100%)',
                  pointerEvents: 'none',
                  zIndex: 1
                }
              }}
            >
              <Box className="carousel-container" sx={{ width: '100%', height: '100%', position: 'relative' }}>
                <Slider {...sliderSettings}>
                  {images.map((img, index) => (
                    <Box key={index} sx={{ width: '100vw', height: '100vh', position: 'relative' }}>
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          background: `url(${img})`,
                          backgroundPosition: 'center',
                          backgroundSize: 'cover',
                          backgroundRepeat: 'no-repeat',
                          transition: 'transform 6s ease',
                          transform: activeSlide === index ? 'scale(1.08)' : 'scale(1)',
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: { xs: '60px', md: '80px' },
                          left: { xs: '20px', md: '60px' },
                          maxWidth: { xs: '80%', md: '50%' },
                          zIndex: 2,
                          opacity: activeSlide === index ? 1 : 0,
                          transform: activeSlide === index ? 'translateY(0)' : 'translateY(20px)',
                          transition: 'opacity 0.5s ease, transform 0.5s ease',
                        }}
                      >
                        <Typography
                          variant={isMobile ? "h5" : "h4"}
                          sx={{
                            color: 'white',
                            fontWeight: 'bold',
                            fontFamily: 'Montserrat, sans-serif',
                            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                            mb: 1,
                          }}
                        >
                          {index === 0 ? 'Descubre nuestra nueva colección' : 
                           index === 1 ? 'Estilos exclusivos para ti' : 
                           index === 2 ? 'Calidad y diseño inigualables' : 
                           index === 3 ? 'Las últimas tendencias en moda' : 
                           index === 4 ? 'Elegancia para cada ocasión' : 
                           'Tu estilo, tu personalidad'}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Slider>
              </Box>
            </Paper>
          </Box>
        </Zoom>

        {/* Título principal */}
        <Fade in={loaded} timeout={1000}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                color: colors.primaryText,
                fontWeight: 'bold',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: isMobile ? '1.8rem' : '2.5rem',
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  width: '80px',
                  height: '3px',
                  backgroundColor: colors.button,
                  transform: 'translateX(-50%)',
                  borderRadius: '2px',
                },
              }}
            >
              Las mejores prendas de GisLive Boutique
            </Typography>
          </Box>
        </Fade>

        {/* Product Grid */}
        <Box component={motion.div} variants={containerVariants} initial="hidden" animate="visible" sx={{ mb: 8 }}>
          <Grid container spacing={3} justifyContent="center">
            {products.map((product, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box component={motion.div} variants={itemVariants} whileHover={{ y: -10, transition: { duration: 0.3 } }}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
                      transition: 'box-shadow 0.3s ease',
                      '&:hover': { boxShadow: '0 12px 30px rgba(0,0,0,0.15)' },
                      position: 'relative',
                    }}
                  >
                    {product.isNew && (
                      <Chip
                        icon={<NewReleasesIcon />}
                        label="Nuevo"
                        color="error"
                        size="small"
                        sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1, fontWeight: 'bold', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
                      />
                    )}
                    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                      <CardMedia
                        component="img"
                        image={product.url}
                        alt={product.nombre_producto}
                        sx={{
                          height: isMobile ? 180 : 240,
                          objectFit: 'cover',
                          transition: 'transform 0.6s ease',
                          '&:hover': { transform: 'scale(1.05)' },
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '100%',
                          height: '60px',
                          background: 'linear-gradient(0deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 100%)',
                        }}
                      />
                    </Box>
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="div"
                        sx={{
                          fontFamily: 'Montserrat, sans-serif',
                          fontWeight: 'bold',
                          fontSize: isMobile ? '1rem' : '1.1rem',
                        }}
                      >
                        {product.nombre_producto}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Chip
                          label={product.nombre_producto}
                          size="small"
                          sx={{
                            backgroundColor: product.type === 'Clínico' ? '#E0F7FA' : '#FFF3E0',
                            color: product.type === 'Clínico' ? '#00838F' : '#E65100',
                            fontWeight: 'medium',
                          }}
                        />
                        <Typography
                          variant="h6"
                          color="text.primary"
                          sx={{
                            fontWeight: 'bold',
                            fontFamily: 'Montserrat, sans-serif',
                            color: colors.dark,
                          }}
                        >
                          {product.precio}
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'space-between', px: 3, pb: 3 }}>
                      <Button
                        variant="contained"
                        startIcon={<AddShoppingCartIcon />}
                        sx={{
                          background: `linear-gradient(45deg, ${colors.gradientStart} 30%, ${colors.gradientEnd} 90%)`,
                          color: 'white',
                          fontFamily: 'Montserrat, sans-serif',
                          fontWeight: 'medium',
                          borderRadius: '8px',
                          textTransform: 'none',
                          boxShadow: '0 4px 10px rgba(64, 224, 208, 0.3)',
                          '&:hover': { boxShadow: '0 6px 15px rgba(64, 224, 208, 0.4)' },
                          transition: 'all 0.3s ease',
                        }}
                        onClick={addToCart}
                      >
                        Añadir
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<InfoOutlinedIcon />}
                        sx={{
                          borderColor: colors.button,
                          color: colors.button,
                          fontFamily: 'Montserrat, sans-serif',
                          borderRadius: '8px',
                          textTransform: 'none',
                          '&:hover': { borderColor: colors.buttonHover, backgroundColor: 'rgba(64, 224, 208, 0.1)' },
                        }}
                      >
                        Detalles
                      </Button>
                    </CardActions>
                  </Card>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default PaginaPrincipal;
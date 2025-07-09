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
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';

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

  // Configuración mejorada del slider
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: !isMobile,
    fade: true,
    cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
    dotsClass: 'slick-dots custom-dots',
    appendDots: dots => (
      <div style={{ bottom: '15px', padding: '0' }}>
        <ul style={{ margin: '0' }}>{dots}</ul>
      </div>
    ),
    customPaging: i => (
      <div style={{ width: '8px', height: '8px', background: 'rgba(255, 255, 255, 0.7)', borderRadius: '50%', transition: 'all 0.3s ease' }} />
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

  // Datos para la sección "Por qué elegirnos"
  const whyChooseUs = [
    {
      icon: <LocalShippingIcon sx={{ fontSize: 45, color: colors.button }} />,
      title: "Envío Rápido",
      description: "Entrega a domicilio en 24-48 horas en todo el país. Tu compra llegará rápidamente y en perfectas condiciones."
    },
    {
      icon: <VerifiedUserIcon sx={{ fontSize: 45, color: colors.button }} />,
      title: "Calidad Garantizada",
      description: "Todas nuestras prendas pasan por rigurosos controles de calidad. Ofrecemos garantía de devolución si no estás satisfecho."
    },
    {
      icon: <SupportAgentIcon sx={{ fontSize: 45, color: colors.button }} />,
      title: "Atención Personalizada",
      description: "Nuestro equipo está disponible para ayudarte en todo momento. Te asesoramos para que encuentres exactamente lo que buscas."
    },
    {
      icon: <PriceCheckIcon sx={{ fontSize: 45, color: colors.button }} />,
      title: "Precios Competitivos",
      description: "Trabajamos directamente con los fabricantes para ofrecerte los mejores precios del mercado sin sacrificar calidad."
    }
  ];

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
      <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
        {/* Hero section with slider - Ajustado para imágenes completas */}
        <Zoom in={loaded} timeout={800}>
          <Box sx={{ maxWidth: '100%', margin: '0 auto', mb: 6 }}>
            <Paper
              elevation={5}
              sx={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              }}
            >
              <Slider {...sliderSettings}>
                {images.map((img, index) => (
                  <Box key={index} sx={{ position: 'relative', width: '100%' }}>
                    <img
                      src={img}
                      alt={`Imagen ${index + 1}`}
                      style={{
                        width: '100%',
                        height: isMobile ? 'auto' : 'auto', // Altura automática para respetar proporciones
                        maxHeight: isMobile ? '300px' : '600px', // Límite máximo para no exceder pantalla
                        objectFit: 'contain', // Mostrar imagen completa
                        display: 'block',
                        margin: '0 auto', // Centrar la imagen horizontalmente
                      }}
                    />
                  </Box>
                ))}
              </Slider>
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

        {/* ¿Por qué elegirnos? Sección */}
        <Fade in={loaded} timeout={1500}>
          <Box sx={{ mb: 8 }}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography
                variant="h3"
                component="h2"
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
                ¿Por qué elegirnos?
              </Typography>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  mt: 4, 
                  color: colors.secondaryText, 
                  maxWidth: '800px', 
                  mx: 'auto',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: isMobile ? '0.9rem' : '1rem',
                }}
              >
                En GisLive Boutique nos distinguimos por ofrecer productos de la más alta calidad, 
                con un servicio excepcional y precios que se adaptan a tus necesidades.
              </Typography>
            </Box>

            <Box component={motion.div} variants={containerVariants} initial="hidden" animate="visible">
              <Grid container spacing={isMobile ? 4 : 5} justifyContent="center">
                {whyChooseUs.map((item, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Box 
                      component={motion.div} 
                      variants={itemVariants} 
                      whileHover={{ y: -8, transition: { duration: 0.3 } }}
                    >
                      <Paper 
                        elevation={3}
                        sx={{
                          p: 4,
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center',
                          borderRadius: '16px',
                          overflow: 'hidden',
                          position: 'relative',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: `linear-gradient(90deg, ${colors.gradientStart} 0%, ${colors.gradientEnd} 100%)`,
                          },
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: '0 10px 30px rgba(64, 224, 208, 0.2)',
                            transform: 'translateY(-5px)',
                          },
                        }}
                      >
                        <Box 
                          sx={{ 
                            mb: 2, 
                            p: 2, 
                            borderRadius: '50%', 
                            backgroundColor: 'rgba(64, 224, 208, 0.1)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            transition: 'all 0.3s ease',
                            '&:hover': { transform: 'scale(1.1)' },
                          }}
                        >
                          {item.icon}
                        </Box>
                        <Typography 
                          variant="h6" 
                          component="h3"
                          sx={{
                            mb: 2,
                            fontWeight: 'bold',
                            fontFamily: 'Montserrat, sans-serif',
                            color: colors.dark,
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Typography 
                          variant="body1"
                          sx={{
                            color: colors.secondaryText,
                            fontFamily: 'Montserrat, sans-serif',
                            lineHeight: 1.6,
                          }}
                        >
                          {item.description}
                        </Typography>
                      </Paper>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default PaginaPrincipal;
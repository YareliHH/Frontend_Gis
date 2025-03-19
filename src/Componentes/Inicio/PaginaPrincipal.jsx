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

// Importar las imágenes locales de los productos y el fondo
import img1 from '../imagenes/img1.jpg';
import img2 from '../imagenes/img2.jpg';
import img3 from '../imagenes/img3.jpg';
import img4 from '../imagenes/img4.jpg';
import img5 from '../imagenes/img5.jpg';
import img6 from '../imagenes/img6.jpg';
import img10 from '../imagenes/img10.jpg';
import img11 from '../imagenes/img11.jpg';
import img14 from '../imagenes/img14.jpg';
import img16 from '../imagenes/img16.jpg';
import img17h from '../imagenes/img17h.jpg';
import img18 from '../imagenes/img18.jpg';
import img20 from '../imagenes/img20.jpg';
import img23 from '../imagenes/img23.jpg';
import LogoGL from '../imagenes/LogoGL.jpg';

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

  // Efecto para iniciar animaciones al cargar la página
  useEffect(() => {
    setLoaded(true);
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

  const products = [
    { image: img10, name: 'Uniforme Clínico', price: '$50', type: 'Clínico' },
    { image: img11, name: 'Batas Quirúrgicas', price: '$80', type: 'Quirúrgico' },
    { image: img20, name: 'Camisón Médico', price: '$45', type: 'Clínico' },
    { image: img14, name: 'Mascarilla Quirúrgica', price: '$15', type: 'Quirúrgico' },
  ];

  const newProducts = [
    { image: img17h, name: 'Gorro Quirúrgico', price: '$12', type: 'Quirúrgico', isNew: true },
    { image: img18, name: 'Guantes Clínicos', price: '$20', type: 'Clínico', isNew: true },
    { image: img16, name: 'Bata Estéril', price: '$70', type: 'Quirúrgico', isNew: true },
    { image: img23, name: 'Zapatillas Médicas', price: '$30', type: 'Clínico', isNew: true },
  ];

  const allProducts = [...products, ...newProducts];

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
            {allProducts.map((product, index) => (
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
                        image={product.image}
                        alt={product.name}
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
                        sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 'bold', fontSize: isMobile ? '1rem' : '1.1rem' }}
                      >
                        {product.name}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Chip
                          label={product.type}
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
                          sx={{ fontWeight: 'bold', fontFamily: 'Montserrat, sans-serif', color: colors.dark }}
                        >
                          {product.price}
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

      {/* Chat Section */}
      <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
        {chatOpen ? (
          <Zoom in={chatOpen} timeout={300}>
            <Paper
              elevation={6}
              sx={{
                width: isMobile ? '90vw' : 320,
                height: isMobile ? '70vh' : 450,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              }}
            >
              <Box
                sx={{
                  p: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: `linear-gradient(45deg, ${colors.gradientStart} 30%, ${colors.gradientEnd} 90%)`,
                  color: 'white',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar src={LogoGL} sx={{ width: 32, height: 32, border: '2px solid white' }} />
                  <Typography variant="h6" sx={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Chat con GisLive
                  </Typography>
                </Box>
                <IconButton size="small" onClick={toggleChat} sx={{ color: 'white' }}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  overflow: 'auto',
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundImage: 'linear-gradient(rgba(240, 250, 250, 0.6), rgba(240, 250, 250, 0.6)), url("data:image/svg+xml,%3Csvg width="20" height="20" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 0h20v20H0z" fill="%2340E0D0" fill-opacity=".05"/%3E%3C/svg%3E")',
                }}
              >
                {messages.map((msg, index) => (
                  <Fade in={true} key={index} timeout={(index + 1) * 300}>
                    <Box
                      sx={{
                        maxWidth: '80%',
                        p: 2,
                        borderRadius: msg.sender === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                        mb: 1.5,
                        backgroundColor: msg.sender === 'user' ? colors.button : 'white',
                        color: msg.sender === 'user' ? 'white' : 'black',
                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                        border: msg.sender === 'user' ? 'none' : '1px solid #e0e0e0',
                      }}
                    >
                      <Typography variant="body2" sx={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {msg.text}
                      </Typography>
                    </Box>
                  </Fade>
                ))}
              </Box>
              <Box sx={{ p: 2, display: 'flex', borderTop: '1px solid #eee', backgroundColor: '#f9f9f9' }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Escribe tu mensaje..."
                  variant="outlined"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  sx={{
                    mr: 1,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '20px',
                      '& fieldset': { borderColor: '#e0e0e0' },
                      '&:hover fieldset': { borderColor: colors.button },
                      '&.Mui-focused fieldset': { borderColor: colors.button },
                    },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={sendMessage}
                  sx={{
                    background: `linear-gradient(45deg, ${colors.gradientStart} 30%, ${colors.gradientEnd} 90%)`,
                    borderRadius: '20px',
                    boxShadow: '0 3px 5px rgba(64, 224, 208, 0.3)',
                    '&:hover': { boxShadow: '0 5px 10px rgba(64, 224, 208, 0.4)' },
                  }}
                >
                  Enviar
                </Button>
              </Box>
            </Paper>
          </Zoom>
        ) : (
          <Zoom in={!chatOpen} timeout={300}>
            <Button
              variant="contained"
              startIcon={<ChatIcon />}
              onClick={toggleChat}
              sx={{
                background: `linear-gradient(45deg, ${colors.gradientStart} 30%, ${colors.gradientEnd} 90%)`,
                borderRadius: '50%',
                minWidth: '60px',
                height: '60px',
                padding: '16px',
                boxShadow: '0 4px 20px rgba(64, 224, 208, 0.4)',
                '& .MuiButton-startIcon': { margin: 0 },
                '&:hover': { transform: 'scale(1.1)', boxShadow: '0 6px 25px rgba(64, 224, 208, 0.5)' },
                transition: 'all 0.3s ease',
              }}
              aria-label="Chat"
            />
          </Zoom>
        )}
      </Box>
    </Box>
  );
};

export default PaginaPrincipal;
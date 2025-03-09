import React, { useState } from 'react';
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
  Rating,
  Avatar,
  useTheme,
  Chip,
  TextField,
} from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Icons
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import NewReleasesIcon from '@mui/icons-material/NewReleases';

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

  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const sendMessage = () => {
    if (inputMessage.trim() !== '') {
      setMessages([...messages, { text: inputMessage, sender: 'user' }]);

      // Simulated bot response after a short delay
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
  };

  const images = [img1, img2, img3, img4, img5, img6];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: !isMobile,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          dots: false,
          arrows: false,
        },
      },
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

  const testimonials = [
    {
      text: 'Excelente!! excelente, 100% recomendable, son muy cómodos los uniformes Quirúrgicos',
      author: 'María G.',
      rating: 5,
    },
    {
      text: 'La mejor calidad, los uniformes son perfectos y muy resistentes para el trabajo.',
      author: 'Carlos R.',
      rating: 5,
    },
    {
      text: 'Muy contenta con mi compra, la atención al cliente fue excelente y la entrega rápida.',
      author: 'Ana L.',
      rating: 5,
    },
  ];

  const menuItems = ['Inicio', 'Productos', 'Clínicos', 'Quirúrgicos', 'Ofertas', 'Contacto'];

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
      <Drawer anchor="left" open={menuOpen} onClose={toggleMenu}>
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleMenu}>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              component="img"
              src={LogoGL}
              alt="GisLive Boutique"
              sx={{
                height: 40,
                borderRadius: '50%',
              }}
            />
            <Typography variant="h6" sx={{ fontFamily: 'Montserrat, sans-serif' }}>
              GisLive Boutique
            </Typography>
          </Box>
          <Divider />
          <List>
            {menuItems.map((text, index) => (
              <ListItem button key={text}>
                <ListItemText
                  primary={text}
                  primaryTypographyProps={{
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main content */}
      <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
        {/* Hero section with slider */}
        <Box sx={{ maxWidth: '100%', margin: '0 auto', mb: 6 }}>
          <Paper elevation={3} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
            <Slider {...sliderSettings}>
              {images.map((img, index) => (
                <Box key={index}>
                  <img
                    src={img}
                    alt={`Imagen ${index + 1}`}
                    style={{
                      width: '100%',
                      height: isMobile ? '300px' : '600px', // Ajusta la altura aquí
                      objectFit: 'cover', // Asegura que la imagen cubra el área sin distorsión
                    }}
                  />
                </Box>
              ))}
            </Slider>
          </Paper>
        </Box>

        {/* Título principal */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              color: colors.primaryText,
              fontWeight: 'bold',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: isMobile ? '1.5rem' : '2.5rem',
            }}
          >
            Las mejores prendas de GisLive Boutique
          </Typography>
        </Box>

        {/* Product Grid */}
        <Grid container spacing={3} justifyContent="center">
          {allProducts.map((product, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                  },
                  position: 'relative',
                }}
              >
                {product.isNew && (
                  <Chip
                    icon={<NewReleasesIcon />}
                    label="Nuevo"
                    color="error"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      zIndex: 1,
                    }}
                  />
                )}
                <CardMedia
                  component="img"
                  image={product.image}
                  alt={product.name}
                  sx={{
                    height: 200,
                    objectFit: 'cover',
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: 'bold',
                    }}
                  >
                    {product.name}
                  </Typography>
                  <Typography
                    variant="h6"
                    color="text.primary"
                    sx={{
                      fontWeight: 'bold',
                      fontFamily: 'Montserrat, sans-serif',
                    }}
                  >
                    {product.price}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      backgroundColor: colors.button,
                      fontFamily: 'Montserrat, sans-serif',
                      '&:hover': {
                        backgroundColor: colors.buttonHover,
                      },
                    }}
                    onClick={addToCart}
                  >
                    Añadir
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: colors.button,
                      color: colors.button,
                      fontFamily: 'Montserrat, sans-serif',
                      '&:hover': {
                        borderColor: colors.buttonHover,
                        backgroundColor: 'rgba(64, 224, 208, 0.1)',
                      },
                    }}
                  >
                    Detalles
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Testimonials Section */}
        <Box sx={{ mt: 8, mb: 4 }}>
          <Typography
            variant="h5"
            sx={{
              color: colors.primaryText,
              fontWeight: 'bold',
              fontFamily: 'Montserrat, sans-serif',
              textAlign: 'center',
              mb: 4,
            }}
          >
            Deja que los clientes hablen por nosotros
          </Typography>

          <Grid container spacing={3}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '12px',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                    },
                  }}
                >
                  <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                  <Typography
                    variant="body1"
                    sx={{
                      color: colors.primaryText,
                      fontFamily: 'Montserrat, sans-serif',
                      fontStyle: 'italic',
                      mb: 2,
                      flexGrow: 1,
                    }}
                  >
                    "{testimonial.text}"
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      sx={{
                        bgcolor: colors.button,
                        width: 32,
                        height: 32,
                        mr: 1,
                      }}
                    >
                      {testimonial.author.charAt(0)}
                    </Avatar>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: 'bold',
                      }}
                    >
                      {testimonial.author}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* Chat Section */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        {chatOpen ? (
          <Paper
            elevation={3}
            sx={{
              width: 300,
              height: 400,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                p: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: colors.button,
                color: 'white',
              }}
            >
              <Typography variant="h6" sx={{ fontFamily: 'Montserrat, sans-serif' }}>
                Chat con GisLive
              </Typography>
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
              }}
            >
              {messages.map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    maxWidth: '80%',
                    p: 1.5,
                    borderRadius: '10px',
                    mb: 1,
                    backgroundColor: msg.sender === 'user' ? colors.button : colors.light,
                    color: msg.sender === 'user' ? 'white' : 'black',
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <Typography variant="body2" sx={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {msg.text}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Box sx={{ p: 2, display: 'flex', borderTop: '1px solid #eee' }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Escribe tu mensaje..."
                variant="outlined"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                sx={{ mr: 1 }}
              />
              <Button
                variant="contained"
                onClick={sendMessage}
                sx={{
                  backgroundColor: colors.button,
                  '&:hover': {
                    backgroundColor: colors.buttonHover,
                  },
                }}
              >
                Enviar
              </Button>
            </Box>
          </Paper>
        ) : (
          <Button
            variant="contained"
            startIcon={<ChatIcon />}
            onClick={toggleChat}
            sx={{
              backgroundColor: colors.button,
              borderRadius: '50%',
              minWidth: '56px',
              height: '56px',
              padding: 0,
              '& .MuiButton-startIcon': {
                margin: 0,
              },
              '&:hover': {
                backgroundColor: colors.buttonHover,
              },
            }}
            aria-label="Chat"
          />
        )}
      </Box>
    </Box>
  );
};

export default PaginaPrincipal;
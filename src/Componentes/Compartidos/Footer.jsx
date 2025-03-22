import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  IconButton,
  Box,
  Button,
  Divider,
  useMediaQuery,
  useTheme,
  Link,
  Fade,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Zoom
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  WhatsApp,
  Phone,
  Email,
  LocationOn,
  Security,
  Gavel,
  AssignmentLate,
  QuestionAnswer,
  ContactSupport,
  KeyboardArrowUp,
  Close as CloseIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Redes sociales disponibles
const availableSocials = [
  {
    label: 'Facebook',
    name: 'facebook',
    link: 'https://www.facebook.com/profile.php?id=100063876570345&mibextid=ZbWKwL',
    icon: <Facebook />,
    color: '#1877F2',
  },
  {
    label: 'Instagram',
    name: 'instagram',
    link: 'https://www.instagram.com/gislive17?igsh=MzJtbTM4enkyOG9x',
    icon: <Instagram />,
    color: '#E4405F',
  },
  {
    label: 'WhatsApp',
    name: 'whatsapp',
    link: 'https://api.whatsapp.com/send?phone=%2B522223308869&context=ARA-7mGivUJFUEhTCJcUvVw3isMybJ0cvNB5ZQJpr7_W2YbIu0lW2PaTd_6IRTf4t7Omu86WIcnSurSelQlBtkOmPkfDYdALFw7CMcZSUaAJIEtmWXmkdjBluOf1kTuLe4PKmIqGwvI-TdP3jh22YRk7YQ&source=FB_Page&app=facebook&entry_point=page_cta',
    icon: <WhatsApp />,
    color: '#25D366',
  },
];

// Métodos de pago con imágenes estáticas
const paymentMethods = [
  {
    label: 'MasterCard',
    image: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg',
  },
  {
    label: 'PayPal',
    image: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg',
  },
];

const FooterCliente = () => {
  const [privacyPolicy, setPrivacyPolicy] = useState([]);
  const [termsConditions, setTermsConditions] = useState([]);
  const [disclaimer, setDisclaimer] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState('');
  const [dialogTitle, setDialogTitle] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();

  // Theme y breakpoints para diseño responsivo
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Verificar posición de scroll para mostrar/ocultar botón de "volver arriba"
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Obtener datos del backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Política de privacidad
        const privacyResponse = await axios.get(
          'http://localhost:3001/api/politicas/politicas_privacidad'
        );
        const activePolicy = privacyResponse.data.filter((policy) => policy.estado === 'activo');
        setPrivacyPolicy(activePolicy);

        // Términos y condiciones
        const termsResponse = await axios.get(
          'http://localhost:3001/api/termiCondicion/terminos_condiciones'
        );
        const activeTerms = termsResponse.data.filter((term) => term.estado === 'activo');
        setTermsConditions(activeTerms);

        // Deslinde legal
        const disclaimerResponse = await axios.get(
          'http://localhost:3001/api/deslinde/deslinde'
        );
        const activeDisclaimer = disclaimerResponse.data.filter((disclaimer) => disclaimer.estado === 'activo');
        setDisclaimer(activeDisclaimer);
      } catch (error) {
        console.error('Error al obtener los datos del footer:', error);
      }
    };

    fetchData();
  }, []);

  // Manejar la apertura y cierre del dialog
  const handleOpenDialog = (title, content) => {
    setDialogTitle(title);
    setDialogContent(content);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // Función para volver al principio de la página
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Botón de volver arriba con animación */}
      <Zoom in={showScrollTop}>
        <IconButton
          onClick={scrollToTop}
          aria-label="Volver arriba"
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1000,
            backgroundColor: '#3B8D99',
            color: 'white',
            boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
            '&:hover': {
              backgroundColor: '#2A7F62',
              transform: 'translateY(-5px)',
              boxShadow: '0 6px 15px rgba(0,0,0,0.3)',
            },
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            width: { xs: 45, md: 50 },
            height: { xs: 45, md: 50 },
          }}
        >
          <KeyboardArrowUp fontSize="medium" />
        </IconButton>
      </Zoom>

      <Box
        component="footer"
        sx={{
          background: 'linear-gradient(135deg, #3B8D99 0%, #87CEEB 100%)',
          color: '#fff',
          paddingTop: { xs: 5, md: 6 },
          paddingBottom: { xs: 4, md: 5 },
          width: '100%',
          boxShadow: '0px -5px 15px rgba(0, 0, 0, 0.05)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #2A7F62, #3B8D99, #87CEEB)',
          },
        }}
      >
        {/* Elementos decorativos */}
        <Box
          sx={{
            position: 'absolute',
            top: '-10%',
            right: '-5%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-15%',
            left: '-5%',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            zIndex: 0,
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4}>
            {/* Columna 1: Logo e información de contacto */}
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, pr: { md: 2 } }}>
                <Typography 
                  variant="h5" 
                  component="div" 
                  sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    color: '#FFFFFF',
                    textShadow: '1px 1px 3px rgba(0,0,0,0.1)',
                  }}
                >
                  GisLive Boutique
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 2.5, 
                    letterSpacing: '0.3px', 
                    lineHeight: 1.6,
                    opacity: 0.9,
                  }}
                >
                  Tu boutique médica preferida. Equipamiento y uniformes médicos de alta calidad para profesionales de la salud.
                </Typography>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 2, 
                    mt: 3,
                  }}
                >
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: { xs: 'center', sm: 'flex-start' },
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateX(5px)'
                      }
                    }}
                  >
                    <Phone 
                      sx={{ 
                        mr: 1.5, 
                        fontSize: '1.1rem',
                        color: '#FFFFFF',
                      }} 
                    />
                    <Typography variant="body2">+52 222 330 8869</Typography>
                  </Box>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: { xs: 'center', sm: 'flex-start' },
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateX(5px)'
                      }
                    }}
                  >
                    <Email 
                      sx={{ 
                        mr: 1.5, 
                        fontSize: '1.1rem',
                        color: '#FFFFFF',
                      }} 
                    />
                    <Typography variant="body2">gislive17@gmail.com</Typography>
                  </Box>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: { xs: 'center', sm: 'flex-start' },
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateX(5px)'
                      }
                    }}
                  >
                    <LocationOn 
                      sx={{ 
                        mr: 1.5, 
                        fontSize: '1.1rem',
                        color: '#FFFFFF',
                      }} 
                    />
                    <Typography variant="body2">Ciudad de México, México</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Divisor vertical solo visible en tablet/desktop */}
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ height: '100%', position: 'relative' }}>
                {!isMobile && (
                  <Divider 
                    orientation="vertical" 
                    flexItem 
                    sx={{ 
                      position: 'absolute', 
                      left: -16, 
                      height: '80%',
                      top: '10%',
                      display: { xs: 'none', md: 'block' },
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    }} 
                  />
                )}
              
                {/* Columna 2: Enlaces rápidos */}
                <Box sx={{ 
                  textAlign: { xs: 'center', sm: 'left' },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <Typography 
                    variant="h6" 
                    component="div" 
                    sx={{ 
                      fontWeight: 'bold', 
                      mb: 2.5,
                      color: '#FFFFFF',
                      textShadow: '1px 1px 3px rgba(0,0,0,0.1)',
                    }}
                  >
                    Enlaces Rápidos
                  </Typography>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: 2.5,
                      mt: 1,
                    }}
                  >
                    {/* Enlaces mejorados */}
                    <Link
                      component="button"
                      variant="body2"
                      color="inherit"
                      underline="none"
                      onClick={() => navigate('/preguntasF')}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: { xs: 'center', sm: 'flex-start' },
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'translateX(5px)',
                          color: '#FFFFFF',
                          opacity: 1
                        },
                        opacity: 0.9
                      }}
                    >
                      <QuestionAnswer 
                        sx={{ 
                          mr: 1.5, 
                          fontSize: '1.1rem',
                          color: '#FFFFFF',
                        }} 
                      />
                      Preguntas Frecuentes
                    </Link>
                    <Link
                      component="button"
                      variant="body2"
                      color="inherit"
                      underline="none"
                      onClick={() => navigate('/contacto')}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: { xs: 'center', sm: 'flex-start' },
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'translateX(5px)',
                          color: '#FFFFFF',
                          opacity: 1
                        },
                        opacity: 0.9
                      }}
                    >
                      <ContactSupport 
                        sx={{ 
                          mr: 1.5, 
                          fontSize: '1.1rem',
                          color: '#FFFFFF',
                        }} 
                      />
                      Contáctanos
                    </Link>
                    <Link
                      component="button"
                      variant="body2"
                      color="inherit"
                      underline="none"
                      onClick={() => handleOpenDialog('Política de Privacidad', privacyPolicy[0]?.contenido || 'Contenido no disponible')}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: { xs: 'center', sm: 'flex-start' },
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'translateX(5px)',
                          color: '#FFFFFF',
                          opacity: 1
                        },
                        opacity: 0.9
                      }}
                    >
                      <Security 
                        sx={{ 
                          mr: 1.5, 
                          fontSize: '1.1rem',
                          color: '#FFFFFF',
                        }} 
                      />
                      Política de Privacidad
                    </Link>
                    <Link
                      component="button"
                      variant="body2"
                      color="inherit"
                      underline="none"
                      onClick={() => handleOpenDialog('Términos y Condiciones', termsConditions[0]?.contenido || 'Contenido no disponible')}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: { xs: 'center', sm: 'flex-start' },
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'translateX(5px)',
                          color: '#FFFFFF',
                          opacity: 1
                        },
                        opacity: 0.9
                      }}
                    >
                      <Gavel 
                        sx={{ 
                          mr: 1.5, 
                          fontSize: '1.1rem',
                          color: '#FFFFFF',
                        }} 
                      />
                      Términos y Condiciones
                    </Link>
                    <Link
                      component="button"
                      variant="body2"
                      color="inherit"
                      underline="none"
                      onClick={() => handleOpenDialog('Deslinde Legal', disclaimer[0]?.contenido || 'Contenido no disponible')}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: { xs: 'center', sm: 'flex-start' },
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'translateX(5px)',
                          color: '#FFFFFF',
                          opacity: 1
                        },
                        opacity: 0.9
                      }}
                    >
                      <AssignmentLate 
                        sx={{ 
                          mr: 1.5, 
                          fontSize: '1.1rem',
                          color: '#FFFFFF',
                        }} 
                      />
                      Deslinde Legal
                    </Link>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Columna 3: Síguenos en redes sociales y Métodos de Pago */}
            <Grid item xs={12} md={4}>
              <Box sx={{ position: 'relative' }}>
                {!isMobile && (
                  <Divider 
                    orientation="vertical" 
                    flexItem 
                    sx={{ 
                      position: 'absolute', 
                      left: -16, 
                      height: '80%',
                      top: '10%',
                      display: { xs: 'none', md: 'block' },
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    }} 
                  />
                )}
              
                <Box sx={{ textAlign: 'center' }}>
                  {/* Redes Sociales */}
                  <Typography 
                    variant="h6" 
                    component="div" 
                    sx={{ 
                      fontWeight: 'bold', 
                      mb: 2.5,
                      color: '#FFFFFF',
                      textShadow: '1px 1px 3px rgba(0,0,0,0.1)',
                    }}
                  >
                    Síguenos en Redes Sociales
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: 3,
                      mt: 2,
                    }}
                  >
                    {availableSocials.map((social) => (
                      <Tooltip key={social.name} title={social.label} arrow>
                        <IconButton
                          aria-label={social.label}
                          onClick={() => window.open(social.link, '_blank', 'noopener,noreferrer')}
                          sx={{
                            color: '#ffffff',
                            backgroundColor: social.color,
                            width: { xs: 42, sm: 50 },
                            height: { xs: 42, sm: 50 },
                            '&:hover': {
                              backgroundColor: social.color,
                              opacity: 0.9,
                              transform: 'translateY(-5px) rotate(5deg)',
                              boxShadow: '0 8px 15px rgba(0,0,0,0.2)',
                            },
                            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                          }}
                        >
                          {social.icon}
                        </IconButton>
                      </Tooltip>
                    ))}
                  </Box>

                  {/* Métodos de Pago */}
                  <Box sx={{ mt: 4 }}>
                    <Typography 
                      variant="h6" 
                      component="div" 
                      sx={{ 
                        fontWeight: 'bold', 
                        mb: 2.5,
                        color: '#FFFFFF',
                        textShadow: '1px 1px 3px rgba(0,0,0,0.1)',
                      }}
                    >
                      Aceptamos
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 3,
                        flexWrap: 'wrap',
                        mt: 1,
                      }}
                    >
                      {paymentMethods.map((method) => (
                        <Box
                          key={method.label}
                          sx={{
                            width: { xs: 70, sm: 90 },
                            height: { xs: 50, sm: 60 },
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'white',
                            borderRadius: 2,
                            padding: 1,
                            transition: 'all 0.3s',
                            '&:hover': {
                              transform: 'scale(1.05)',
                              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                            }
                          }}
                        >
                          <img
                            src={method.image}
                            alt={method.label}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                            }}
                          />
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Divider 
            sx={{ 
              my: 4, 
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              height: '2px',
              borderRadius: '1px',
            }} 
          />

          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="body2" 
              sx={{ 
                opacity: 0.9,
                fontWeight: 500,
                letterSpacing: '0.5px',
              }}
            >
              © {new Date().getFullYear()} GisLive Boutique Clínica. Todos los derechos reservados.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Dialog mejorado para mostrar contenido */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            overflow: 'hidden',
          },
        }}
        TransitionComponent={Zoom}
        transitionDuration={350}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(90deg, #3B8D99, #87CEEB)',
            color: 'white',
            py: 2,
            px: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6" component="div" sx={{ fontWeight: 600, letterSpacing: 0.5 }}>
            {dialogTitle}
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseDialog}
            aria-label="close"
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                transform: 'rotate(90deg)',
              },
              transition: 'all 0.3s',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent dividers sx={{ p: 3 }}>
          {/* Aplicamos estilos para mejorar la legibilidad del contenido */}
          <Typography 
            variant="body1" 
            component="div"
            sx={{ 
              lineHeight: 1.7, 
              color: 'text.primary',
              '& p': {
                mb: 2
              },
              '& h2, & h3': {
                mt: 3,
                mb: 2,
                color: '#3B8D99',
                fontWeight: 600
              },
              '& ul, & ol': {
                pl: 3,
                mb: 2
              },
              '& li': {
                mb: 1
              }
            }}
          >
            {dialogContent}
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, backgroundColor: 'background.default' }}>
          <Button
            variant="contained"
            onClick={handleCloseDialog}
            sx={{
              backgroundColor: '#3B8D99',
              px: 3,
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { 
                backgroundColor: '#2A7F62',
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)', 
              },
              transition: 'all 0.3s',
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FooterCliente;
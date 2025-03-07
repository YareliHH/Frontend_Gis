import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  IconButton, 
  Box, 
  Modal, 
  Button, 
  Divider, 
  Paper,
  useMediaQuery,
  useTheme,
  Link,
  Fade,
  Slide,
  Tooltip
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
  KeyboardArrowUp
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const availableSocials = [
  { 
    label: 'Facebook', 
    name: 'facebook', 
    link: 'https://www.facebook.com/profile.php?id=100063876570345&mibextid=ZbWKwL', 
    icon: <Facebook />,
    color: '#1877F2'
  },
  { 
    label: 'Instagram', 
    name: 'instagram', 
    link: 'https://www.instagram.com/gislive17?igsh=MzJtbTM4enkyOG9x', 
    icon: <Instagram />,
    color: '#E4405F'
  },
  { 
    label: 'WhatsApp', 
    name: 'whatsapp', 
    link: 'https://api.whatsapp.com/send?phone=%2B522223308869&context=ARA-7mGivUJFUEhTCJcUvVw3isMybJ0cvNB5ZQJpr7_W2YbIu0lW2PaTd_6IRTf4t7Omu86WIcnSurSelQlBtkOmPkfDYdALFw7CMcZSUaAJIEtmWXmkdjBluOf1kTuLe4PKmIqGwvI-TdP3jh22YRk7YQ&source=FB_Page&app=facebook&entry_point=page_cta', 
    icon: <WhatsApp />,
    color: '#25D366'
  },
];

const FooterCliente = () => {
  const [privacyPolicy, setPrivacyPolicy] = useState([]);
  const [termsConditions, setTermsConditions] = useState([]);
  const [disclaimer, setDisclaimer] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');
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

  // Manejar la apertura y cierre del modal
  const handleOpenModal = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Función para volver al principio de la página
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Botón de volver arriba */}
      <Fade in={showScrollTop}>
        <IconButton 
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1000,
            backgroundColor: '#0097a7',
            color: 'white',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            '&:hover': {
              backgroundColor: '#00796b',
              transform: 'translateY(-3px)',
              boxShadow: '0 6px 12px rgba(0,0,0,0.3)'
            },
            transition: 'all 0.3s ease',
          }}
        >
          <KeyboardArrowUp />
        </IconButton>
      </Fade>

      <Box
        component="footer"
        sx={{
          backgroundColor: '#87CEEB',
          color: '#fff',
          paddingTop: { xs: 4, md: 6 },
          paddingBottom: { xs: 4, md: 6 },
          width: '100%',
          boxShadow: '0px -4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Columna 1: Logo e información de contacto */}
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 2 }}>
                  GisLive Boutique
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Tu boutique médica preferida. Equipamiento y uniformes médicos de alta calidad para profesionales de la salud.
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                    <Phone sx={{ mr: 1, fontSize: '1rem' }} />
                    <Typography variant="body2">+52 222 330 8869</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                    <Email sx={{ mr: 1, fontSize: '1rem' }} />
                    <Typography variant="body2">gislive17@gmail.com</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                    <LocationOn sx={{ mr: 1, fontSize: '1rem' }} />
                    <Typography variant="body2">Ciudad de México, México</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Columna 2: Enlaces rápidos */}
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Enlaces Rápidos
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Link 
                    component="button" 
                    variant="body2" 
                    color="inherit"
                    underline="hover"
                    onClick={() => navigate('/preguntasF')}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: { xs: 'center', sm: 'flex-start' }
                    }}
                  >
                    <QuestionAnswer sx={{ mr: 1, fontSize: '1rem' }} />
                    Preguntas Frecuentes
                  </Link>
                  <Link 
                    component="button" 
                    variant="body2" 
                    color="inherit"
                    underline="hover"
                    onClick={() => navigate('/contacto')}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: { xs: 'center', sm: 'flex-start' }
                    }}
                  >
                    <ContactSupport sx={{ mr: 1, fontSize: '1rem' }} />
                    Contáctanos
                  </Link>
                  <Link 
                    component="button" 
                    variant="body2" 
                    color="inherit"
                    underline="hover"
                    onClick={() => handleOpenModal('Política de Privacidad', privacyPolicy[0]?.contenido || 'Contenido no disponible')}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: { xs: 'center', sm: 'flex-start' }
                    }}
                  >
                    <Security sx={{ mr: 1, fontSize: '1rem' }} />
                    Política de Privacidad
                  </Link>
                  <Link 
                    component="button" 
                    variant="body2" 
                    color="inherit"
                    underline="hover"
                    onClick={() => handleOpenModal('Términos y Condiciones', termsConditions[0]?.contenido || 'Contenido no disponible')}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: { xs: 'center', sm: 'flex-start' }
                    }}
                  >
                    <Gavel sx={{ mr: 1, fontSize: '1rem' }} />
                    Términos y Condiciones
                  </Link>
                  <Link 
                    component="button" 
                    variant="body2" 
                    color="inherit"
                    underline="hover"
                    onClick={() => handleOpenModal('Deslinde Legal', disclaimer[0]?.contenido || 'Contenido no disponible')}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: { xs: 'center', sm: 'flex-start' }
                    }}
                  >
                    <AssignmentLate sx={{ mr: 1, fontSize: '1rem' }} />
                    Deslinde Legal
                  </Link>
                </Box>
              </Box>
            </Grid>

            {/* Columna 3: Síguenos en redes sociales */}
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Síguenos en Redes Sociales
                </Typography>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: 2,
                    mt: 2
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
                          width: { xs: 40, sm: 48 },
                          height: { xs: 40, sm: 48 },
                          '&:hover': { 
                            backgroundColor: social.color,
                            opacity: 0.9,
                            transform: 'translateY(-5px)',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {social.icon}
                      </IconButton>
                    </Tooltip>
                  ))}
                </Box>
                
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 3, 
                    mt: 4, 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    ¿Quieres mantenerte informado de nuestras novedades?
                  </Typography>
                  <Button 
                    variant="contained" 
                    fullWidth
                    onClick={() => navigate('/contacto')}
                    sx={{
                      backgroundColor: '#0097a7',
                      '&:hover': { 
                        backgroundColor: '#00796b',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                      py: 1
                    }}
                  >
                    Suscríbete
                  </Button>
                </Paper>
              </Box>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 4, backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              © {new Date().getFullYear()} GisLive Boutique Clínica. Todos los derechos reservados.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Modal mejorado para mostrar contenido */}
      <Modal 
        open={modalOpen} 
        onClose={handleCloseModal}
        closeAfterTransition
      >
        <Fade in={modalOpen}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: 500 },
              maxHeight: '80vh',
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              p: { xs: 3, sm: 4 },
              outline: 'none',
              overflow: 'auto'
            }}
          >
            <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
              {modalTitle}
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
              {modalContent}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="contained" 
                onClick={handleCloseModal} 
                sx={{ 
                  backgroundColor: '#0097a7',
                  '&:hover': { backgroundColor: '#00796b' },
                }}
              >
                Cerrar
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default FooterCliente;
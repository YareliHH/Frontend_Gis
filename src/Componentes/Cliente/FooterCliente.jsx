import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  IconButton,
  Box,
  Button,
  useMediaQuery,
  useTheme,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Zoom,
} from '@mui/material';
import {
  Facebook,
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
  Close as CloseIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import mercadopago from '../imagenes/mercadopago.png';

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
    link: 'https://api.whatsapp.com/send?phone=%2B522223308869',
    icon: <WhatsApp />,
    color: '#25D366',
  },
];

const paymentMethods = [
  {
    label: 'Mercado Pago',
    image: mercadopago,
  },
];

const Footer= () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState('');
  const [dialogTitle, setDialogTitle] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCloseDialog = () => setDialogOpen(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Scroll to Top Button */}
      <Zoom in={showScrollTop}>
        <IconButton
          onClick={scrollToTop}
          aria-label="Volver arriba"
          sx={{
            position: 'fixed',
            bottom: 28,
            right: 28,
            zIndex: 1000,
            backgroundColor: '#3B8D99',
            color: 'white',
            '&:hover': { backgroundColor: '#2A7F62', transform: 'translateY(-4px)' },
            width: { xs: 50, md: 60 },
            height: { xs: 50, md: 60 },
            transition: 'all 0.3s ease',
            boxShadow: '0 6px 14px rgba(0, 0, 0, 0.25)',
          }}
        >
          <KeyboardArrowUp fontSize="large" />
        </IconButton>
      </Zoom>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          background: 'linear-gradient(135deg, #3B8D99 0%, #87CEEB 100%)',
          color: '#fff',
          py: { xs: 7, md: 9 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={5} justifyContent="space-between">
            {/* Boutique Info */}
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 800, mb: 2.5, letterSpacing: 0.6 }}
                >
                  GisLive Boutique
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mb: 3.5, opacity: 0.85, fontStyle: 'italic', fontSize: '0.95rem' }}
                >
                  Tu boutique médica preferida...
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    alignItems: { xs: 'center', md: 'flex-start' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                    <Phone sx={{ fontSize: 22, color: '#fff' }} />
                    <Typography variant="body2" sx={{ fontSize: '0.95rem' }}>
                      +52 222 330 8869
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                    <Email sx={{ fontSize: 22, color: '#fff' }} />
                    <Typography variant="body2" sx={{ fontSize: '0.95rem' }}>
                      gislive17@gmail.com
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                    <LocationOn sx={{ fontSize: 22, color: '#fff' }} />
                    <Typography variant="body2" sx={{ fontSize: '0.95rem' }}>
                      Ciudad de México, México
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  mb: 3.5,
                  textAlign: { xs: 'center', md: 'left' },
                  letterSpacing: 0.4,
                }}
              >
                Enlaces Rápidos
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  alignItems: { xs: 'center', md: 'flex-start' },
                }}
              >
                {[
                  { label: 'Preguntas Frecuentes', path: '/preguntasFCliente', icon: <QuestionAnswer sx={{ fontSize: 22, mr: 1.2 }} /> },
                  { label: 'Contáctanos', path: '/cliente/contactoCliente', icon: <ContactSupport sx={{ fontSize: 22, mr: 1.2 }} /> },
                  { label: 'Política de Privacidad', path: '/cliente/avisosCliente', icon: <Security sx={{ fontSize: 22, mr: 1.2 }} /> },
                  { label: 'Términos y Condiciones', path: '/cliente/condicionesCliente', icon: <Gavel sx={{ fontSize: 22, mr: 1.2 }} /> },
                  { label: 'Deslinde Legal', path: '/cliente/deslindeCliente', icon: <AssignmentLate sx={{ fontSize: 22, mr: 1.2 }} /> },
                ].map((link) => (
                  <Link
                    key={link.label}
                    component="button"
                    color="inherit"
                    onClick={() => navigate(link.path)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      opacity: 0.85,
                      transition: 'opacity 0.3s ease, transform 0.2s ease',
                      '&:hover': { opacity: 1, transform: 'translateX(5px)' },
                    }}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
              </Box>
            </Grid>

            {/* Social Media & Payments */}
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                {/* Social Media */}
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 800, mb: 3.5, letterSpacing: 0.4 }}
                >
                  Síguenos en Redes Sociales
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' }, gap: 2.5, mb: 4.5 }}>
                  {availableSocials.map((social) => (
                    <IconButton
                      key={social.name}
                      onClick={() => window.open(social.link, '_blank')}
                      sx={{
                        backgroundColor: social.color,
                        color: '#fff',
                        width: 44,
                        height: 44,
                        '&:hover': {
                          backgroundColor: social.color,
                          opacity: 0.85,
                          transform: 'scale(1.12)',
                        },
                        transition: 'all 0.3s ease',
                        boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)',
                      }}
                    >
                      {social.icon}
                    </IconButton>
                  ))}
                </Box>
                {/* Métodos de pago */}
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 800, mb: 3.5, letterSpacing: 0.4 }}
                >
                  Aceptamos
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: { xs: 'center', md: 'flex-start' },
                    gap: 2.5,
                    mb: 4.5,
                  }}
                >
                  {paymentMethods.map((method) => (
                    <Box
                      key={method.label}
                      sx={{
                        width: { xs: 100, md: 120 },
                        height: { xs: 50, md: 60 },
                        backgroundColor: '#fff',
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'box-shadow 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        },
                      }}
                    >
                      <Box
                        component="img"
                        src={method.image}
                        alt={method.label}
                        sx={{
                          maxWidth: '80%',
                          maxHeight: '80%',
                          objectFit: 'contain',
                        }}
                      />
                    </Box>
                  ))}
                </Box>
                {/* Collaborations */}
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 800, mb: 3.5, letterSpacing: 0.4 }}
                >
                  Colaboraciones
                </Typography>
                <Link
                  component="button"
                  color="inherit"
                  onClick={() => navigate('/colaboraciones')}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    opacity: 0.85,
                    transition: 'opacity 0.3s ease, transform 0.2s ease',
                    '&:hover': { opacity: 1, transform: 'translateX(5px)' },
                  }}
                >
                  <GroupIcon sx={{ fontSize: 22, mr: 1.2 }} />
                  Conoce Nuestras Colaboraciones
                </Link>
              </Box>
            </Grid>
          </Grid>

          {/* Copyright */}
          <Box sx={{ mt: 7, textAlign: 'center' }}>
            <Typography
              variant="body2"
              sx={{ opacity: 0.8, fontSize: '0.9rem', letterSpacing: 0.3 }}
            >
              © {new Date().getFullYear()} GisLive Boutique Clínica. Todos los derechos reservados.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        TransitionComponent={Zoom}
      >
        <DialogTitle
          sx={{
            backgroundColor: '#3B8D99',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6">{dialogTitle}</Typography>
          <IconButton onClick={handleCloseDialog}>
            <CloseIcon sx={{ color: '#fff' }} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography>{dialogContent}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            sx={{
              backgroundColor: '#3B8D99',
              color: '#fff',
              px: 3,
              '&:hover': { backgroundColor: '#2A7F62' },
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Footer;
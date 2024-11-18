import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, IconButton, Box, Modal, Button } from '@mui/material';
import { Facebook, Twitter, Instagram, WhatsApp } from '@mui/icons-material';
import axios from 'axios';

const availableSocials = [
  { label: 'Facebook', name: 'facebook', link: 'https://facebook.com', icon: <Facebook /> },
  { label: 'Twitter', name: 'twitter', link: 'https://twitter.com', icon: <Twitter /> },
  { label: 'Instagram', name: 'instagram', link: 'https://instagram.com', icon: <Instagram /> },
  { label: 'WhatsApp', name: 'whatsapp', link: 'https://whatsapp.com', icon: <WhatsApp /> },
];

const Footer = () => {
  const [privacyPolicy, setPrivacyPolicy] = useState([]);
  const [termsConditions, setTermsConditions] = useState([]);
  const [disclaimer, setDisclaimer] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  // Obtener datos del backend
  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        const response = await axios.get(
          'https://backendgislive.onrender.com/api/politicas/politicas_privacidad'
        );
        const activePolicy = response.data.filter((policy) => policy.estado === 'activo');
        setPrivacyPolicy(activePolicy);
      } catch (error) {
        console.error('Error al obtener las políticas de privacidad:', error);
      }
    };

    const fetchTermsConditions = async () => {
      try {
        const response = await axios.get(
          'https://backendgislive.onrender.com/api/termiCondicion/terminos_condiciones'
        );
        const activeTerms = response.data.filter((term) => term.estado === 'activo');
        setTermsConditions(activeTerms);
      } catch (error) {
        console.error('Error al obtener los términos y condiciones:', error);
      }
    };

    const fetchDisclaimer = async () => {
      try {
        const response = await axios.get('https://backendgislive.onrender.com/api/deslinde/deslinde');
        const activeDisclaimer = response.data.filter((disclaimer) => disclaimer.estado === 'activo');
        setDisclaimer(activeDisclaimer);
      } catch (error) {
        console.error('Error al obtener el deslinde legal:', error);
      }
    };

    fetchPrivacyPolicy();
    fetchTermsConditions();
    fetchDisclaimer();
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

  return (
    <footer
      style={{
        backgroundColor: '#00bcd4',
        color: '#ffffff',
        padding: '20px',
        position: 'fixed',
        width: '100%',
        bottom: 0,
      }}
    >
      <Container maxWidth="lg">
        {/* Redes sociales */}
        <Grid container spacing={3} justifyContent="center" sx={{ mb: 2 }}>
          {availableSocials.map((social) => (
            <Grid item key={social.name}>
              <IconButton
                aria-label={social.label}
                onClick={() => window.open(social.link, '_blank', 'noopener,noreferrer')}
                sx={{
                  color: '#ffffff',
                  backgroundColor: '#0097a7',
                  '&:hover': { backgroundColor: '#00796b' },
                }}
              >
                {social.icon}
              </IconButton>
            </Grid>
          ))}
        </Grid>

        {/* Enlaces a políticas */}
        <Grid container justifyContent="center" spacing={2} sx={{ mb: 2 }}>
          <Grid item>
            <Button
              color="inherit"
              onClick={() =>
                handleOpenModal(
                  'Política de Privacidad',
                  privacyPolicy[0]?.contenido || 'Contenido no disponible'
                )
              }
            >
              Política de Privacidad
            </Button>
          </Grid>
          <Grid item>
            <Button
              color="inherit"
              onClick={() =>
                handleOpenModal(
                  'Términos y Condiciones',
                  termsConditions[0]?.contenido || 'Contenido no disponible'
                )
              }
            >
              Términos y Condiciones
            </Button>
          </Grid>
          <Grid item>
            <Button
              color="inherit"
              onClick={() =>
                handleOpenModal('Deslinde Legal', disclaimer[0]?.contenido || 'Contenido no disponible')
              }
            >
              Deslinde Legal
            </Button>
          </Grid>
        </Grid>

        <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
          © 2024 Gislive. Todos los derechos reservados.
        </Typography>

        {/* Modal para mostrar contenido adicional */}
        <Modal open={modalOpen} onClose={handleCloseModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              border: '2px solid #00bcd4',
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6">{modalTitle}</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              {modalContent}
            </Typography>
            <Button variant="contained" color="primary" onClick={handleCloseModal} sx={{ mt: 2 }}>
              Cerrar
            </Button>
          </Box>
        </Modal>
      </Container>
    </footer>
  );
};

export default Footer;

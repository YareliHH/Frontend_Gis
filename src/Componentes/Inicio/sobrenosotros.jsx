import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SobreNosotros = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Box sx={{ padding: 3, backgroundColor: '#f9f9f9', borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" align="center" gutterBottom sx={{ color: '#1565c0', fontWeight: 'bold' }}>
          Sobre Nosotros
        </Typography>
        <Typography variant="body2" paragraph>
          En <strong>GisLive Boutique Clínica</strong>, ofrecemos uniformes clínicos de alta calidad, 
          diseñados para brindar comodidad y estilo a los profesionales de la salud.
        </Typography>
      </Box>

      <Box sx={{ padding: 3, backgroundColor: '#e3f2fd', borderRadius: 2, boxShadow: 3, mt: 3 }}>
        <Typography variant="h5" align="center" gutterBottom sx={{ color: '#1565c0', fontWeight: 'bold' }}>
          Visión
        </Typography>
        <Typography variant="body2" paragraph>
          Ser líderes en uniformes clínicos, destacándonos por calidad e innovación, y apoyando la imagen profesional de nuestros clientes.
        </Typography>
      </Box>

      <Box sx={{ padding: 3, backgroundColor: '#f1f8e9', borderRadius: 2, boxShadow: 3, mt: 3 }}>
        <Typography variant="h5" align="center" gutterBottom sx={{ color: '#1565c0', fontWeight: 'bold' }}>
          Misión
        </Typography>
        <Typography variant="body2" paragraph>
          Proveer uniformes funcionales y elegantes para garantizar comodidad y proyectar confianza en los profesionales de la salud.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleBackClick} 
          sx={{ backgroundColor: '#1565c0', color: '#fff' }}
        >
          Atrás
        </Button>
      </Box>
    </Container>
  );
};

export default SobreNosotros;

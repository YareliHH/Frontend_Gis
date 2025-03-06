import React from 'react';
import { Button, Box, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 

const PaginaAdministrativa = () => {
  const navigate = useNavigate(); // Hook para la navegación

  const handleBack = () => {
    navigate('/'); // Navegar a la página principal
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: '100vh',
        textAlign: 'center',
        background: 'linear-gradient(135deg,rgb(155, 181, 200) 30%,rgb(110, 121, 131) 90%)',
        color: 'white',
        p: 4,
      }}
    >
      <Container maxWidth="sm" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: 4, borderRadius: 3, backdropFilter: 'blur(10px)' }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 'bold' }}
        >
          ¡Bienvenido, Administrador!
        </Typography>
        <Typography 
          variant="h5" 
          component="h2" 
          gutterBottom 
          sx={{ fontFamily: 'Montserrat, sans-serif', fontStyle: 'italic' }}
        >
          Gestiona y optimiza tu tienda con facilidad
        </Typography>
        <Button
          variant="contained"
          onClick={handleBack}
          color="secondary"
          sx={{ mt: 3, fontFamily: 'Montserrat, sans-serif', fontWeight: 'bold', backgroundColor: '#FFFFFF', color: '#1E90FF' }}
        >
          Volver a la Página Principal
        </Button>
      </Container>
    </Box>
  );
};

export default PaginaAdministrativa;

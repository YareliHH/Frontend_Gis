import React from 'react';
import { Button, Box, Typography } from '@mui/material';
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
      sx={{ minHeight: '100vh', textAlign: 'center' }} // Centra el contenido vertical y horizontalmente
    >
      <Typography variant="h3" component="h1" gutterBottom>
        Bienvenido a la Página Administrativa
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        ADMIN
      </Typography>
      <Button
        variant="contained"
        onClick={handleBack}
        color="primary"
        sx={{ mt: 3 }} // Margen superior para el botón
      >
        Volver a la Página Principal
      </Button>
    </Box>
  );
};

export default PaginaAdministrativa;

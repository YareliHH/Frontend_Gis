import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 

const EmailVerification = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate(); 

  const validateEmail = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);

    // Regex para validar el formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(emailValue)) {
      setEmailError('El correo electrónico no es válido');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailError && email) {
      // Aquí puedes agregar la lógica para enviar o procesar el correo
      alert(`Correo válido: ${email}`);
    } else {
      alert('Por favor, ingrese un correo electrónico válido.');
    }
  };

  const handleBack = () => {
    navigate(-1); // Navegar hacia atrás
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ mt: 4 }}
    >
      <Paper elevation={3} sx={{ padding: 4, width: '400px' }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Verificación de Correo Electrónico
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Correo Electrónico"
            variant="outlined"
            type="email"
            value={email}
            onChange={validateEmail}
            required
            fullWidth
            error={!!emailError}
            helperText={emailError}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            type="submit"
            color="primary"
            fullWidth
            sx={{ mb: 2 }}
          >
            Verificar
          </Button>
          <Button
            variant="outlined"
            onClick={handleBack} // Llamar a la función para regresar
            fullWidth
          >
            Atrás
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default EmailVerification;

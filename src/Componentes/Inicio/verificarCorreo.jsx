import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

const EmailVerification = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

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

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ mt: 4 }}
    >
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
        >
          Verificar
        </Button>
      </form>
    </Box>
  );
};

export default EmailVerification;

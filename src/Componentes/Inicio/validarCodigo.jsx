import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Container, Typography, TextField, Button, Box, Paper } from '@mui/material';

const MySwal = withReactContent(Swal);

function ValidarCodigo() {
  const [codigo, setCodigo] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state; 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://backendgislive.onrender.com/api/codigo/validar_codigo', { email, codigo });

      if (response.data.success) {
        MySwal.fire({
          icon: 'success',
          title: 'Código verificado',
          text: 'El código es correcto. Puedes cambiar tu contraseña.',
        });

        navigate('/cambiar_password', { state: { email } });
      }
    } catch (error) {
      MySwal.fire({
        icon: 'error',
        title: 'Código incorrecto',
        text: 'El código ingresado es incorrecto. Intenta nuevamente.',
      });
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, marginTop: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          Verificar Código
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            variant="outlined"
            label="Código de 6 dígitos"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            required
            margin="normal"
            InputProps={{
              style: { borderRadius: 8 },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{
              marginTop: 2,
              borderRadius: 2,
              textTransform: 'none',
            }}
          >
            Validar Código
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default ValidarCodigo;

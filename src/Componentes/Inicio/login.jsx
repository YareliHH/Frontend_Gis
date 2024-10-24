import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ReCAPTCHA from "react-google-recaptcha"; 
import { Container, Typography,TextField, Button,Box,Snackbar,Alert,InputAdornment} from '@mui/material';
import { Email as EmailIcon, Lock as LockIcon } from '@mui/icons-material';

const MySwal = withReactContent(Swal);

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaValue, setCaptchaValue] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaValue) {
      setErrorMessage('Por favor, resuelve el reCAPTCHA.');
      setOpenSnackbar(true);
      return;
    }

    // Agregando logs para depurar los valores de email y password
    console.log('Correo enviado:', email);
    console.log('Contraseña enviada:', password);
    console.log('Valor de reCAPTCHA:', captchaValue);

    try {
      const response = await axios.post('https://backendgislive.onrender.com/api/login', {
        email,
        password,
        captchaValue,
      });
      
      console.log('Respuesta del servidor:', response.data);  // Depurar respuesta del servidor
      
      const { tipo } = response.data;
      localStorage.setItem('usuario', JSON.stringify(response.data));
      let ruta = '/';
      let mensaje = 'Has iniciado sesión correctamente.';

      switch (tipo) {
        case "usuario":
          ruta = '/cliente';  
          break;
        case "admin": 
          ruta = '/admin'; 
          break;
        default:
          setErrorMessage('Tipo de usuario desconocido');
          setOpenSnackbar(true);
          return;
      }

      MySwal.fire({
        position: 'center',
        icon: 'success',
        title: mensaje,
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        navigate(ruta);  
      });
    } catch (error) {
      console.error('Error al iniciar sesión:', error);  // Depurar cualquier error de la solicitud
      if (error.response) {
        setErrorMessage('Correo o contraseña incorrectos');
      } else {
        setErrorMessage('Error al iniciar sesión. Inténtalo de nuevo más tarde.');
      }
      setOpenSnackbar(true);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8, display: 'flex',  minHeight: '50vh' }}>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          backgroundColor: '#e3f2fd', 
          padding: 4, 
          borderRadius: 3, 
          boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)' 
        }}
      >
        <Typography variant="h4" component="h1" sx={{ mb: 3, color: '#1565c0', fontWeight: 'bold' }}>
          Iniciar Sesión
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="Correo electrónico"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: '#1565c0' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              },
            }}
          />
          <TextField
            label="Contraseña"
            type="password"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: '#1565c0' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              },
            }}
          />
          <Box sx={{ my: 2 }}>
            <ReCAPTCHA
              sitekey="6LcKwWEqAAAAAMe2IRU4TukPaY92LJnE6c8pZtSo" 
              onChange={(value) => setCaptchaValue(value)}
            />
          </Box>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth
            sx={{
              padding: '10px 0',
              backgroundColor: '#1565c0',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#1e88e5',
              },
              boxShadow: '0px 4px 15px rgba(21, 101, 192, 0.5)'
            }}
          >
            Iniciar Sesión
          </Button>

          {/* Enlace a "¿Olvidaste tu contraseña?" */}
          <Link to="/recuperar_password" style={{ textDecoration: 'none' }}>
            <Typography variant="body2" sx={{ mt: 2, color: '#1565c0', fontWeight: 'bold' }}>
              ¿Olvidaste tu contraseña?
            </Typography>
          </Link>

          {/* Enlace a "Regístrate" */}
          <Link to="/registro" style={{ textDecoration: 'none' }}>
            <Typography variant="body2" sx={{ mt: 1, color: '#1565c0', fontWeight: 'bold' }}>
              Regístrate
            </Typography>
          </Link>
        </form>

        {/* Snackbar para mostrar los mensajes de error */}
        <Snackbar 
          open={openSnackbar} 
          autoHideDuration={6000} 
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert 
            onClose={() => setOpenSnackbar(false)} 
            severity="error" 
            sx={{ width: '100%' }}
          >
            {errorMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}

export default Login;

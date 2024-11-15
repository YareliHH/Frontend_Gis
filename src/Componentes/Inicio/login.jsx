import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ReCAPTCHA from "react-google-recaptcha"; 
import { Container, Typography, TextField, Button, Box, Snackbar, Alert, InputAdornment, CircularProgress, IconButton } from '@mui/material';
import { Email as EmailIcon, Lock as LockIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import Notificaciones from '../Compartidos/Notificaciones.jsx'; // Importar el componente Notificaciones

const MySwal = withReactContent(Swal);

function Login() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar la visibilidad de la contraseña
  const [captchaValue, setCaptchaValue] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaValue) {
      setErrorMessage('Por favor, resuelve el reCAPTCHA.');
      setOpenSnackbar(true);
      return;
    }

    setLoading(true); 

    try {
      const response = await axios.post('https://backendgislive.onrender.com/api/login', {
        correo,
        password,
        captchaValue,
      });
      
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
          setLoading(false); 
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
      console.error('Error al iniciar sesión:', error); 
      setErrorMessage(error.response ? 'Correo o contraseña incorrectos' : 'Error al iniciar sesión. Inténtalo de nuevo más tarde.');
      setOpenSnackbar(true);
    } finally {
      setLoading(false); 
    }
  };

  // Cambiar la visibilidad de la contraseña
  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          backgroundColor: '#e3f2fd', 
          padding: 4, 
          borderRadius: 3, 
          boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)' 
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
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
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
            type={showPassword ? 'text' : 'password'} // Cambia el tipo según el estado de showPassword
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
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
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
          <Box sx={{ my: 2, display: 'flex', justifyContent: 'center' }}>
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
            disabled={loading} 
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{
              padding: '10px 0',
              backgroundColor: loading ? '#1565c0' : '#1565c0',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: loading ? '#1565c0' : '#1e88e5',
              },
              boxShadow: '0px 4px 15px rgba(21, 101, 192, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </Button>

          {/* Enlace a "¿Olvidaste tu contraseña?" */}
          <Link to="/recuperar_password" style={{ textDecoration: 'none' }}>
            <Typography variant="body2" sx={{ mt: 2, color: '#1565c0', fontWeight: 'bold', textAlign: 'center' }}>
              ¿Olvidaste tu contraseña?
            </Typography>
          </Link>

          {/* Enlace a "Regístrate" */}
          <Link to="/registro" style={{ textDecoration: 'none' }}>
            <Typography variant="body2" sx={{ mt: 1, color: '#1565c0', fontWeight: 'bold', textAlign: 'center' }}>
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

import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ReCAPTCHA from "react-google-recaptcha";
import { Grid, Container, Typography, TextField, Button, Box, Snackbar, Alert, InputAdornment, CircularProgress, IconButton } from '@mui/material';
import { Email as EmailIcon, Lock as LockIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

import img7 from '../imagenes/img7.jpg';
import img9 from '../imagenes/img9.jpg';
import img10 from '../imagenes/img10.jpg';
import img23 from '../imagenes/img23.jpg';
import img25 from '../imagenes/img25h.jpg';

const MySwal = withReactContent(Swal);

function Login() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      const response = await axios.post('http://localhost:3001/api/login', { correo, password, captchaValue }, { withCredentials: true });
      const { tipo } = response.data;
      localStorage.setItem('usuario', JSON.stringify(response.data));
      let ruta = tipo === "usuario" ? '/cliente' : tipo === "admin" ? '/admin' : '/';
      MySwal.fire({
        position: 'center',
        icon: 'success',
        title: 'Has iniciado sesión correctamente.',
        showConfirmButton: false,
        timer: 2000,
      }).then(() => navigate(ruta));
    } catch (error) {
      setErrorMessage(error.response ? 'Correo o contraseña incorrectos' : 'Error al iniciar sesión. Inténtalo de nuevo más tarde.');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
    
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <Box
    
    >
      <Container maxWidth="md" sx={{ boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)', borderRadius: 3, backgroundColor: 'rgb(255, 255, 255)', overflow: 'hidden', padding: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Carousel autoPlay infiniteLoop showThumbs={false}>
              <div><img src={img7} alt="Imagen 1" /></div>
              <div><img src={img9} alt="Imagen 2" /></div>
              <div><img src={img10} alt="Imagen 3" /></div>
              <div><img src={img23} alt="Imagen 4" /></div>
              <div><img src={img25} alt="Imagen 5" /></div>
            </Carousel>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 4, borderRadius: 3 }}>
              <Typography variant="h4" sx={{ mb: 3, color: '#1565c0', fontWeight: 'bold', textAlign: 'center' }}>¡Nos alegra que regreses pronto!</Typography>
              <Typography variant="h5" sx={{ mb: 3, color: '#1565c0', fontWeight: 'medium', textAlign: 'center' }}>Bienvenido/a de nuevo a GisLive</Typography>
              <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <TextField label="Correo electrónico" variant="outlined" margin="normal" required fullWidth value={correo} onChange={(e) => setCorreo(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><EmailIcon sx={{ color: '#1565c0' }} /></InputAdornment>) }} />
                <TextField label="Contraseña" type={showPassword ? 'text' : 'password'} variant="outlined" margin="normal" required fullWidth value={password} onChange={(e) => setPassword(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><LockIcon sx={{ color: '#1565c0' }} /></InputAdornment>), endAdornment: (<InputAdornment position="end"><IconButton onClick={handleClickShowPassword} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>) }} />
                <Box sx={{ my: 2, display: 'flex', justifyContent: 'center' }}>
                 
                  <ReCAPTCHA sitekey="6LcKwWEqAAAAAMe2IRU4TukPaY92LJnE6c8pZtSo" onChange={(value) => setCaptchaValue(value)} />
                </Box>
                <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}>{loading ? 'Cargando...' : 'Iniciar Sesión'}</Button>
                <Link to="/recuperar_password" style={{ textDecoration: 'none' }}><Typography variant="body2" sx={{ mt: 2, color: '#1565c0', textAlign: 'center' }}>¿Olvidaste tu contraseña?</Typography></Link>
                <Link to="/registro" style={{ textDecoration: 'none' }}><Typography variant="body2" sx={{ mt: 1, color: '#1565c0', textAlign: 'center' }}>Regístrate</Typography></Link>
                <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={() => navigate("/")}>Inicio</Button>
              </form>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Login;

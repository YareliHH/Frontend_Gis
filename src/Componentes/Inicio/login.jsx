import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ReCAPTCHA from "react-google-recaptcha";
import { 
  Grid, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Snackbar, 
  Alert, 
  InputAdornment, 
  CircularProgress, 
  IconButton,
  Paper,
  useMediaQuery,
  useTheme,
  Divider,
  Fade,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { 
  Email as EmailIcon, 
  Lock as LockIcon, 
  Visibility, 
  VisibilityOff, 
  LoginOutlined,
  ArrowBack,
  HealthAndSafety
} from '@mui/icons-material';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

// Importación de imágenes
import img7 from '../imagenes/img7.jpg';
import img9 from '../imagenes/img9.jpg';
import img10 from '../imagenes/img10.jpg';
import img23 from '../imagenes/img23.jpg';
import img25 from '../imagenes/img25h.jpg';

const MySwal = withReactContent(Swal);

function Login() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Estados
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Colores personalizados para GisLive
  const primaryColor = '#1E88E5'; // Azul médico más profesional
  const accentColor = '#F5F5F5';  // Fondo suave
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaValue) {
      setErrorMessage('Por favor, resuelve el reCAPTCHA.');
      setOpenSnackbar(true);
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post('https://backend-gis-1.onrender.com/api/login', 
        { correo, password, captchaValue }, 
        { withCredentials: true }
      );
      
      const { tipo } = response.data;
      localStorage.setItem('usuario', JSON.stringify(response.data));
      
      let ruta = tipo === "usuario" ? '/cliente' : 
                tipo === "admin" ? '/admin' : '/';
                
      MySwal.fire({
        position: 'center',
        icon: 'success',
        title: 'Has iniciado sesión correctamente.',
        showConfirmButton: false,
        timer: 2000
      }).then(() => navigate(ruta));
    } catch (error) {
      setErrorMessage(
        error.response ? 'Correo o contraseña incorrectos' : 
        'Error al iniciar sesión. Inténtalo de nuevo más tarde.'
      );
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleCloseSnackbar = () => setOpenSnackbar(false);

  // Imágenes para el carrusel optimizadas para mostrar uniformes clínicos
  const carouselImages = [
    { src: img7, alt: "Uniformes médicos GisLive" },
    { src: img9, alt: "Uniformes quirúrgicos GisLive" },
    { src: img10, alt: "Uniformes clínicos GisLive" },
    { src: img23, alt: "Colección GisLive" },
    { src: img25, alt: "Uniformes profesionales" }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        py: 4,
        px: { xs: 2, md: 4 }
      }}
    >
      <Fade in={true} timeout={800}>
        <Paper
          elevation={6}
          sx={{
            width: '100%',
            maxWidth: '1100px',
            borderRadius: 3,
            overflow: 'hidden'
          }}
        >
          <Grid container>
            {/* Logo mobile visible solo en dispositivos pequeños */}
            {isMobile && (
              <Grid item xs={12}>
                <Box 
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 3,
                    backgroundColor: 'white'
                  }}
                >
                  <Box 
                    sx={{
                      backgroundColor: accentColor,
                      borderRadius: '50%',
                      p: 1,
                      display: 'flex',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    <HealthAndSafety 
                      sx={{ 
                        fontSize: 40, 
                        color: primaryColor 
                      }} 
                    />
                  </Box>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      ml: 2, 
                      fontWeight: 700, 
                      color: '#333',
                      letterSpacing: '-0.5px'
                    }}
                  >
                    GisLive
                  </Typography>
                </Box>
              </Grid>
            )}
            
            {/* Sección de carrusel */}
            <Grid 
              item 
              xs={12} 
              md={6} 
              sx={{ 
                display: { xs: 'none', md: 'block' },
                position: 'relative',
                backgroundColor: '#f8f9fa'
              }}
            >
              <Box sx={{ height: '100%' }}>
                <Carousel 
                  autoPlay 
                  infiniteLoop 
                  showThumbs={false}
                  showStatus={false}
                  interval={5000}
                  showArrows={true}
                  emulateTouch={true}
                  dynamicHeight={false}
                  swipeable={true}
                  renderIndicator={(clickHandler, isSelected, index) => {
                    return (
                      <div
                        style={{
                          display: 'inline-block',
                          width: 8,
                          height: 8,
                          margin: '0 6px',
                          borderRadius: '50%',
                          background: isSelected ? primaryColor : '#bbb',
                          cursor: 'pointer'
                        }}
                        onClick={clickHandler}
                        key={index}
                      />
                    );
                  }}
                >
                  {carouselImages.map((img, index) => (
                    <div key={index} style={{ height: '100%' }}>
                      <img 
                        src={img.src} 
                        alt={img.alt} 
                        style={{ 
                          width: '100%',
                          objectFit: 'cover',
                          height: '550px'
                        }} 
                      />
                      <div className="legend" style={{ 
                        background: 'rgba(0,0,0,0.5)', 
                        padding: '10px'
                      }}>
                        <Typography variant="body1">{img.alt}</Typography>
                      </div>
                    </div>
                  ))}
                </Carousel>
                
                {/* Logo o branding superpuesto en la esquina */}
                <Box 
                  sx={{
                    position: 'absolute',
                    top: 20,
                    left: 20,
                    zIndex: 1,
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    borderRadius: 2,
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                >
                  <HealthAndSafety 
                    sx={{ 
                      fontSize: 30, 
                      color: primaryColor 
                    }} 
                  />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      ml: 1, 
                      fontWeight: 700, 
                      color: '#333' 
                    }}
                  >
                    GisLive
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            {/* Sección de formulario */}
            <Grid 
              item 
              xs={12} 
              md={6} 
              sx={{ 
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <Box 
                sx={{ 
                  p: { xs: 3, sm: 5 },
                  width: '100%',
                  maxWidth: '450px',
                  mx: 'auto'
                }}
              >
                {/* Encabezado */}
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700, 
                      color: primaryColor,
                      letterSpacing: '-0.5px',
                      mb: 1
                    }}
                  >
                    ¡Bienvenido a GisLive!
                  </Typography>
                  
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'text.secondary',
                      mb: 1
                    }}
                  >
                    La mejor boutique de uniformes clínicos de alta calidad
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                </Box>
                
                {/* Formulario */}
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
                          <EmailIcon sx={{ color: primaryColor }} />
                        </InputAdornment>
                      )
                    }}
                    sx={{ 
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: primaryColor,
                        }
                      }
                    }}
                  />
                  
                  <TextField 
                    label="Contraseña" 
                    type={showPassword ? 'text' : 'password'} 
                    variant="outlined" 
                    margin="normal" 
                    required 
                    fullWidth 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{ 
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: primaryColor }} />
                        </InputAdornment>
                      ), 
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton 
                            onClick={handleClickShowPassword} 
                            edge="end"
                            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    sx={{ 
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: primaryColor,
                        }
                      }
                    }}
                  />
                  
                  {/* Enlaces y opciones adicionales */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    width: '100%',
                    flexDirection: isSmallMobile ? 'column' : 'row',
                    gap: isSmallMobile ? 1 : 0
                  }}>
                    <FormControlLabel
                      control={<Checkbox sx={{ color: primaryColor }} />}
                      label={
                        <Typography 
                          variant="body2" 
                          sx={{ fontWeight: 500 }}
                        >
                          Recuérdame
                        </Typography>
                      }
                    />
                    <Link 
                      to="/recuperar_password" 
                      style={{ textDecoration: 'none' }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: primaryColor, 
                          fontWeight: 500,
                          '&:hover': {
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        ¿Olvidaste tu contraseña?
                      </Typography>
                    </Link>
                  </Box>

                  {/* Captcha */}
                  <Box 
                    sx={{ 
                      my: 2, 
                      display: 'flex', 
                      justifyContent: 'center',
                      transform: isMobile ? 'scale(0.85)' : 'scale(1)',
                      transformOrigin: 'center'
                    }}
                  >
                    <ReCAPTCHA 
                      sitekey="6LcKwWEqAAAAAMe2IRU4TukPaY92LJnE6c8pZtSo" 
                      onChange={(value) => setCaptchaValue(value)} 
                    />
                  </Box>
                  
                  {/* Botón login */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginOutlined />}
                      sx={{ 
                        py: 1.5,
                        px: 4,
                        backgroundColor: primaryColor,
                        color: 'white',
                        fontWeight: 600,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1rem',
                        boxShadow: '0 4px 12px rgba(30, 136, 229, 0.2)',
                        '&:hover': {
                          backgroundColor: '#1565C0',
                          boxShadow: '0 6px 15px rgba(30, 136, 229, 0.3)'
                        }
                      }}
                    >
                      {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
                    </Button>
                  </Box>
                  
                  {/* Enlace de registro */}
                  <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <Link to="/registro" style={{ textDecoration: 'none' }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: primaryColor,
                          fontWeight: 600,
                          cursor: 'pointer',
                          '&:hover': {
                            textDecoration: 'underline',
                          }
                        }}
                      >
                        ¿Aún no tienes cuenta? Regístrate
                      </Typography>
                    </Link>
                  </Box>
                </form>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Fade>
      
      {/* Mensaje de error */}
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Login;
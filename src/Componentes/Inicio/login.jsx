import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  Checkbox,
  Tooltip,
  Zoom,
  Grow,
  Collapse,
  Card,
  CardContent,
  Chip,
  alpha
} from '@mui/material';
import { 
  Email as EmailIcon, 
  Lock as LockIcon, 
  Visibility, 
  VisibilityOff, 
  LoginOutlined,
  ArrowBack,
  HealthAndSafety,
  Info as InfoIcon,
  Help as HelpIcon,
  Security as SecurityIcon,
  VerifiedUser as VerifiedUserIcon,
  QuestionAnswer as QuestionAnswerIcon
} from '@mui/icons-material';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { keyframes } from '@mui/system';

// Importar el hook de autenticación
import { useAuth } from '../Autenticacion/AuthContext';

// Importación de imágenes
import img7 from '../imagenes/img7.jpg';
import img9 from '../imagenes/img9.jpg';
import img10 from '../imagenes/img10.jpg';
import img23 from '../imagenes/img23.jpg';
import img25 from '../imagenes/img25h.jpg';

const MySwal = withReactContent(Swal);

// Animaciones personalizadas
const pulseAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0 ${alpha('#1E88E5', 0.7)};
  }
  70% {
    box-shadow: 0 0 0 10px ${alpha('#1E88E5', 0)};
  }
  100% {
    box-shadow: 0 0 0 0 ${alpha('#1E88E5', 0)};
  }
`;

const floatAnimation = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0px);
  }
`;

function Login() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Usar el contexto de autenticación
  const { login } = useAuth();
  
  // Estados
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showPasswordTips, setShowPasswordTips] = useState(false);
  
  // Colores personalizados para GisLive
  const primaryColor = '#1E88E5'; // Azul médico más profesional
  const accentColor = '#F5F5F5';  // Fondo suave

  // Cargar correo electrónico guardado al iniciar
  useEffect(() => {
    const savedEmail = localStorage.getItem('gislive_remembered_email');
    if (savedEmail) {
      setCorreo(savedEmail);
      setRememberMe(true);
    }
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Guardar el correo si está marcada la opción "Recuérdame"
    if (rememberMe) {
      localStorage.setItem('gislive_remembered_email', correo);
    } else {
      localStorage.removeItem('gislive_remembered_email');
    }
    
    if (!captchaValue) {
      setErrorMessage('Por favor, resuelve el reCAPTCHA.');
      setOpenSnackbar(true);
      return;
    }
    
    setLoading(true);
    try {
      // Usar la función login del contexto de autenticación
      const result = await login(correo, password, captchaValue);
      
      if (result.success) {
        // Determinar a dónde redirigir según el tipo de usuario
        let redirectPath = '/';
        
        if (result.tipo === 'usuario') {
          redirectPath = '/cliente';
        } else if (result.tipo === 'admin') {
          redirectPath = '/admin';
        } else if (result.tipo === 'empleado') {
          redirectPath = '/empleado';
        }
        
        // Si hay una ubicación anterior guardada, redirigir allí
        const from = location.state?.from?.pathname || redirectPath;
        
        MySwal.fire({
          position: 'center',
          icon: 'success',
          title: '¡Bienvenido de nuevo!',
          text: 'Has iniciado sesión correctamente.',
          showConfirmButton: false,
          timer: 2000,
          background: '#ffffff',
          iconColor: primaryColor,
          customClass: {
            popup: 'custom-swal-popup',
            title: 'custom-swal-title',
            content: 'custom-swal-content'
          }
        }).then(() => navigate(from));
      } else {
        setErrorMessage(result.error || 'Error al iniciar sesión');
        setOpenSnackbar(true);
      }
    } catch (error) {
      setErrorMessage('Error al iniciar sesión. Inténtalo de nuevo más tarde.');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleCloseSnackbar = () => setOpenSnackbar(false);
  const handleToggleHelp = () => setShowHelp(prev => !prev);
  const handleRememberChange = (event) => setRememberMe(event.target.checked);

  // Imágenes para el carrusel optimizadas para mostrar uniformes clínicos
  const carouselImages = [
    { src: img7, alt: "Uniformes médicos GisLive" },
    { src: img9, alt: "Uniformes quirúrgicos GisLive" },
    { src: img10, alt: "Uniformes clínicos GisLive" },
    { src: img23, alt: "Colección GisLive" },
    { src: img25, alt: "Uniformes profesionales" }
  ];

  // Preguntas frecuentes sobre inicio de sesión
  const faqItems = [
    {
      question: "¿Qué pasa si olvidé mi contraseña?",
      answer: "Puedes restablecerla haciendo clic en '¿Olvidaste tu contraseña?' debajo del formulario de inicio de sesión."
    },
    {
      question: "¿Qué hace la opción 'Recuérdame'?",
      answer: "Guarda tu correo electrónico para que no tengas que escribirlo la próxima vez que inicies sesión en este dispositivo."
    },
    {
      question: "¿Por qué necesito resolver un CAPTCHA?",
      answer: "El CAPTCHA ayuda a proteger tu cuenta contra intentos automatizados de inicio de sesión no autorizados."
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '90vh', // Reducido un poco para adaptarse al LayoutEncabezado
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
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {/* Botón de ayuda flotante */}
          <Tooltip title="¿Necesitas ayuda?" placement="left">
            <IconButton
              onClick={handleToggleHelp}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 10,
                backgroundColor: alpha(primaryColor, 0.1),
                '&:hover': {
                  backgroundColor: alpha(primaryColor, 0.2),
                },
                animation: `${floatAnimation} 2s ease-in-out infinite`
              }}
            >
              <QuestionAnswerIcon color="primary" />
            </IconButton>
          </Tooltip>
          
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
                
                {/* Chip flotante con mensaje */}
                <Zoom in={true} style={{ transitionDelay: '500ms' }}>
                  <Chip
                    icon={<VerifiedUserIcon />}
                    label="Acceso Seguro"
                    color="primary"
                    variant="filled"
                    sx={{
                      position: 'absolute',
                      top: 80,
                      right: 20,
                      zIndex: 1,
                      fontWeight: 'bold',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                      px: 1
                    }}
                  />
                </Zoom>
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
                justifyContent: 'center',
                position: 'relative'
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
                  <Grow in={true} timeout={1000}>
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
                  </Grow>
                  
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
                      ),
                      endAdornment: rememberMe && correo && (
                        <InputAdornment position="end">
                          <Tooltip title="Email recordado" placement="top">
                            <InfoIcon fontSize="small" color="primary" sx={{ opacity: 0.7 }} />
                          </Tooltip>
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
                    onChange={(e) => {
                      setPassword(e.target.value);
                      // Mostrar los consejos si comienza a escribir
                      if (e.target.value.length > 0 && !showPasswordTips) {
                        setShowPasswordTips(true);
                      } else if (e.target.value.length === 0) {
                        setShowPasswordTips(false);
                      }
                    }}
                    InputProps={{ 
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: primaryColor }} />
                        </InputAdornment>
                      ), 
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
                            <IconButton 
                              onClick={handleClickShowPassword} 
                              edge="end"
                              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      )
                    }}
                    sx={{ 
                      mb: 1, // Reducido para dejar espacio a los consejos
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: primaryColor,
                        }
                      }
                    }}
                  />
                  
                  {/* Consejos de contraseña */}
                  <Collapse in={showPasswordTips}>
                    <Box 
                      sx={{ 
                        backgroundColor: alpha(primaryColor, 0.05),
                        borderRadius: 1,
                        p: 1,
                        mb: 2,
                        display: 'flex',
                        alignItems: 'flex-start'
                      }}
                    >
                      <SecurityIcon 
                        fontSize="small" 
                        color="primary" 
                        sx={{ mr: 1, mt: 0.2 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        Para mayor seguridad, usa una contraseña con al menos 8 caracteres que incluya mayúsculas, 
                        minúsculas, números y caracteres especiales.
                      </Typography>
                    </Box>
                  </Collapse>
                  
                  {/* Enlaces y opciones adicionales */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    width: '100%',
                    flexDirection: isSmallMobile ? 'column' : 'row',
                    gap: isSmallMobile ? 1 : 0
                  }}>
                    <Tooltip title="Guarda tu correo para futuros inicios de sesión" placement="top-start">
                      <FormControlLabel
                        control={
                          <Checkbox 
                            sx={{ color: primaryColor }} 
                            checked={rememberMe}
                            onChange={handleRememberChange}
                          />
                        }
                        label={
                          <Typography 
                            variant="body2" 
                            sx={{ fontWeight: 500 }}
                          >
                            Recuérdame
                          </Typography>
                        }
                      />
                    </Tooltip>
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
                        animation: loading ? 'none' : `${pulseAnimation} 2s infinite`,
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
          
          {/* Panel de ayuda desplegable */}
          <Collapse in={showHelp}>
            <Box sx={{ 
              p: 3, 
              backgroundColor: alpha(primaryColor, 0.05),
              borderTop: `1px solid ${alpha(primaryColor, 0.2)}`
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <HelpIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="primary" fontWeight="bold">
                  Preguntas Frecuentes
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                {faqItems.map((item, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Card 
                      variant="outlined" 
                      sx={{ 
                        height: '100%',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                          {item.question}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.answer}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button 
                  size="small" 
                  endIcon={<ArrowBack sx={{ transform: 'rotate(270deg)' }} />} 
                  onClick={handleToggleHelp}
                >
                  Cerrar ayuda
                </Button>
              </Box>
            </Box>
          </Collapse>
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
          variant="filled"
          sx={{ 
            width: '100%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Login;
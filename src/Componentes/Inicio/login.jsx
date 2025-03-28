import React, { useState, useEffect, useRef } from 'react';
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

// Hook de autenticación
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

// Componente principal de Login
function Login() {
  // Hooks y referencias
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const captchaRef = useRef(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Contexto de autenticación
  const { login } = useAuth();
  
  // Estados
  const [formData, setFormData] = useState({
    correo: '',
    password: '',
    showPassword: false,
    captchaValue: null,
    rememberMe: false
  });
  
  const [uiState, setUiState] = useState({
    errorMessage: '',
    openSnackbar: false,
    loading: false,
    showHelp: false,
    showPasswordTips: false
  });
  
  // Colores personalizados
  const primaryColor = '#1E88E5';
  const accentColor = '#F5F5F5';

  // Cargar correo electrónico guardado al iniciar
  useEffect(() => {
    const savedEmail = localStorage.getItem('gislive_remembered_email');
    if (savedEmail) {
      setFormData(prev => ({
        ...prev,
        correo: savedEmail,
        rememberMe: true
      }));
    }
  }, []);
  
  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Mostrar consejos de contraseña si corresponde
    if (name === 'password') {
      setUiState(prev => ({
        ...prev,
        showPasswordTips: value.length > 0
      }));
    }
  };
  
  const handleCheckboxChange = (e) => {
    setFormData(prev => ({
      ...prev,
      rememberMe: e.target.checked
    }));
  };
  
  const handleTogglePassword = () => {
    setFormData(prev => ({
      ...prev,
      showPassword: !prev.showPassword
    }));
  };
  
  const handleToggleHelp = () => {
    setUiState(prev => ({
      ...prev,
      showHelp: !prev.showHelp
    }));
  };
  
  const handleSnackbarClose = () => {
    setUiState(prev => ({
      ...prev,
      openSnackbar: false
    }));
  };
  
  const handleCaptchaChange = (value) => {
    setFormData(prev => ({
      ...prev,
      captchaValue: value
    }));
  };
  
  // Función para resetear el reCAPTCHA
  const resetCaptcha = () => {
    if (captchaRef.current) {
      captchaRef.current.reset();
      setFormData(prev => ({
        ...prev,
        captchaValue: null
      }));
    }
  };
  
  // Mostrar error con reCAPTCHA reseteado
  const showError = (message) => {
    setUiState(prev => ({
      ...prev,
      errorMessage: message,
      openSnackbar: true,
      loading: false
    }));
    resetCaptcha();
  };
  
  // Manejo del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { correo, password, captchaValue, rememberMe } = formData;
    
    // Persistir o eliminar el correo según "Recuérdame"
    if (rememberMe) {
      localStorage.setItem('gislive_remembered_email', correo);
    } else {
      localStorage.removeItem('gislive_remembered_email');
    }
    
    if (!captchaValue) {
      showError('Por favor, resuelve el reCAPTCHA.');
      return;
    }
    
    setUiState(prev => ({
      ...prev,
      loading: true
    }));
    
    try {
      // Intentar iniciar sesión
      const result = await login(correo, password, captchaValue);
      
      if (result.success) {
        // Determinar redirección según tipo de usuario
        let redirectPath = '/';
        
        if (result.tipo === 'usuario') {
          redirectPath = '/cliente';
        } else if (result.tipo === 'admin') {
          redirectPath = '/admin';
        } else if (result.tipo === 'empleado') {
          redirectPath = '/empleado';
        }
        
        // Usar ubicación anterior si existe
        const from = location.state?.from?.pathname || redirectPath;
        
        // Mensaje de éxito
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
        showError(result.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      showError('Error al iniciar sesión. Inténtalo de nuevo más tarde.');
    }
  };
  
  // Imágenes para el carrusel
  const carouselImages = [
    { src: img7, alt: "Uniformes médicos GisLive" },
    { src: img9, alt: "Uniformes quirúrgicos GisLive" },
    { src: img10, alt: "Uniformes clínicos GisLive" },
    { src: img23, alt: "Colección GisLive" },
    { src: img25, alt: "Uniformes profesionales" }
  ];

  // Preguntas frecuentes
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

  // Componente de logo para reutilización
  const Logo = ({ size = 'medium' }) => {
    const iconSize = size === 'small' ? 30 : 40;
    const textVariant = size === 'small' ? 'h6' : 'h5';
    
    return (
      <Box 
        sx={{
          display: 'flex',
          alignItems: 'center'
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
              fontSize: iconSize, 
              color: primaryColor 
            }} 
          />
        </Box>
        <Typography 
          variant={textVariant} 
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
    );
  };

  return (
    <Box
      sx={{
        minHeight: '90vh',
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
            position: 'relative',
            transition: 'box-shadow 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
            }
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
            {/* Logo mobile */}
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
                  <Logo />
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
                
                {/* Logo superpuesto */}
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
                  <Logo size="small" />
                </Box>
                
                {/* Chip de acceso seguro */}
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
                    name="correo"
                    value={formData.correo} 
                    onChange={handleChange}
                    InputProps={{ 
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: primaryColor }} />
                        </InputAdornment>
                      ),
                      endAdornment: formData.rememberMe && formData.correo && (
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
                    type={formData.showPassword ? 'text' : 'password'} 
                    variant="outlined" 
                    margin="normal" 
                    required 
                    fullWidth 
                    name="password"
                    value={formData.password} 
                    onChange={handleChange}
                    InputProps={{ 
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: primaryColor }} />
                        </InputAdornment>
                      ), 
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title={formData.showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
                            <IconButton 
                              onClick={handleTogglePassword} 
                              edge="end"
                              aria-label={formData.showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            >
                              {formData.showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      )
                    }}
                    sx={{ 
                      mb: 1,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: primaryColor,
                        }
                      }
                    }}
                  />
                  
                  {/* Consejos de contraseña */}
                  <Collapse in={uiState.showPasswordTips}>
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
                            checked={formData.rememberMe}
                            onChange={handleCheckboxChange}
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

                  {/* Captcha con referencia para reinicio */}
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
                      ref={captchaRef}
                      sitekey="6LcKwWEqAAAAAMe2IRU4TukPaY92LJnE6c8pZtSo" 
                      onChange={handleCaptchaChange}
                    />
                  </Box>
                  
                  {/* Botón login */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      disabled={uiState.loading}
                      startIcon={uiState.loading ? <CircularProgress size={20} color="inherit" /> : <LoginOutlined />}
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
                        animation: uiState.loading ? 'none' : `${pulseAnimation} 2s infinite`,
                        '&:hover': {
                          backgroundColor: '#1565C0',
                          boxShadow: '0 6px 15px rgba(30, 136, 229, 0.3)'
                        }
                      }}
                    >
                      {uiState.loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
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
          <Collapse in={uiState.showHelp}>
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
        open={uiState.openSnackbar} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity="error" 
          variant="filled"
          sx={{ 
            width: '100%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          {uiState.errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Login;
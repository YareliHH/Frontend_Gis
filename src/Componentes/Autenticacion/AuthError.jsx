import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Container,
  useTheme,
  useMediaQuery,
  Stack,
  Fade,
  Grow,
  Divider,
  Avatar,
  Card,
  CardContent,
  alpha,
  Tooltip,
  Grid,
  Chip
} from '@mui/material';
import { 
  LockOutlined, 
  ErrorOutline, 
  Home as HomeIcon, 
  Login as LoginIcon,
  ArrowBack,
  Info as InfoIcon,
  Security as SecurityIcon,
  VpnKey as VpnKeyIcon,
  Warning as WarningIcon,
  NoEncryption as NoEncryptionIcon,
  EmojiPeople as EmojiPeopleIcon,
  HelpOutline as HelpOutlineIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { keyframes } from '@mui/system';

// Animación de destello para el botón principal
const pulseAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0 ${alpha('#1976d2', 0.7)};
  }
  70% {
    box-shadow: 0 0 0 10px ${alpha('#1976d2', 0)};
  }
  100% {
    box-shadow: 0 0 0 0 ${alpha('#1976d2', 0)};
  }
`;

// Animación para el icono
const floatAnimation = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

/**
 * Componente para mostrar errores de autenticación o acceso denegado
 * Incluye animaciones, diseño moderno y experiencia de usuario mejorada
 */
const AuthError = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  
  // Estado para manejar animaciones escalonadas
  const [showHelp, setShowHelp] = useState(false);
  
  // Extraer los parámetros de la URL para determinar el tipo de error
  const queryParams = new URLSearchParams(location.search);
  const errorType = queryParams.get('type') || 'auth'; // Valores posibles: 'auth', 'permission'
  const from = queryParams.get('from') || '';
  
  // Mostrar el panel de ayuda después de un breve retraso
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHelp(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Configurar el contenido según el tipo de error
  const errorContent = {
    auth: {
      title: 'Autenticación Requerida',
      subtitle: 'Inicia sesión para continuar',
      description: 'Esta sección está protegida y requiere autenticación. Por favor inicia sesión con tus credenciales para acceder al contenido.',
      icon: <LockOutlined sx={{ 
        fontSize: 70, 
        color: 'primary.main',
        animation: `${floatAnimation} 3s ease-in-out infinite`
      }} />,
      avatarColor: '#bbdefb',
      avatarBgColor: 'primary.main',
      primaryButton: {
        text: 'Iniciar Sesión',
        icon: <LoginIcon />,
        action: () => navigate('/login', { state: { from: from } }),
        color: 'primary'
      },
      helpTitle: '¿Por qué necesito iniciar sesión?',
      helpItems: [
        {
          icon: <SecurityIcon color="primary" />,
          text: 'Protegemos el acceso a información y funciones exclusivas'
        },
        {
          icon: <VpnKeyIcon color="primary" />,
          text: 'Tu cuenta te da acceso personalizado a nuestros servicios'
        },
        {
          icon: <EmojiPeopleIcon color="primary" />,
          text: 'Podrás acceder a tu perfil, historial y preferencias'
        }
      ],
      chipText: 'Acceso Restringido',
      chipColor: 'primary',
      chipIcon: <SecurityIcon fontSize="small" />
    },
    permission: {
      title: 'Acceso Denegado',
      subtitle: 'Permisos insuficientes',
      description: 'No tienes los permisos necesarios para acceder a esta sección. Si crees que deberías tener acceso, contacta con el administrador.',
      icon: <NoEncryptionIcon sx={{ 
        fontSize: 70, 
        color: theme.palette.error.main,
        animation: `${floatAnimation} 3s ease-in-out infinite`
      }} />,
      avatarColor: '#ffcdd2',
      avatarBgColor: 'error.main',
      primaryButton: {
        text: 'Ir a mi Panel',
        icon: <HomeIcon />,
        action: () => navigate(determineHomePage()),
        color: 'error'
      },
      helpTitle: '¿Por qué no puedo acceder?',
      helpItems: [
        {
          icon: <WarningIcon color="error" />,
          text: 'Tu cuenta no tiene el rol necesario para esta sección'
        },
        {
          icon: <InfoIcon color="error" />,
          text: 'Cada área de la aplicación requiere permisos específicos'
        },
        {
          icon: <HelpOutlineIcon color="error" />,
          text: 'Si necesitas acceso, contacta con un administrador'
        }
      ],
      chipText: 'Acceso Prohibido',
      chipColor: 'error',
      chipIcon: <ErrorOutline fontSize="small" />
    }
  };

  // Determinar la página principal según el rol del usuario (si está autenticado)
  function determineHomePage() {
    // Intentar obtener el usuario del localStorage para saber su rol
    try {
      const userData = JSON.parse(localStorage.getItem('usuario'));
      if (userData && userData.tipo) {
        switch (userData.tipo) {
          case 'admin':
            return '/admin';
          case 'usuario':
            return '/cliente';
          case 'empleado':
            return '/empleado';
          default:
            return '/';
        }
      }
    } catch (error) {
      console.error('Error al obtener datos de usuario:', error);
    }
    return '/';
  }

  const content = errorContent[errorType] || errorContent.auth;

  // Estilo para la tarjeta de ayuda
  const helpCardStyle = {
    backgroundColor: alpha(theme.palette[content.primaryButton.color].main, 0.04),
    borderLeft: `4px solid ${theme.palette[content.primaryButton.color].main}`,
    borderRadius: 2,
    boxShadow: '0px 3px 15px rgba(0,0,0,0.05)',
    mb: 3,
    '&:hover': {
      boxShadow: '0px 6px 20px rgba(0,0,0,0.08)',
      transform: 'translateY(-2px)',
      transition: 'all 0.3s ease'
    }
  };

  return (
    <Container maxWidth="lg">
      <Fade in={true} timeout={800}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 3, sm: 5 }, 
            mt: { xs: 4, sm: 8 }, 
            mb: { xs: 4, sm: 8 },
            borderRadius: 4,
            overflow: 'hidden',
            position: 'relative',
            backgroundColor: theme.palette.background.paper,
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
          }}
        >
          {/* Burbuja de color de fondo estilizada - efecto visual */}
          <Box 
            sx={{
              position: 'absolute',
              top: -100,
              right: -100,
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${alpha(theme.palette[content.primaryButton.color].main, 0.2)}, ${alpha(theme.palette[content.primaryButton.color].main, 0.05)})`,
              zIndex: 0
            }}
          />
          
          <Grid container spacing={4}>
            {/* Columna izquierda - Información principal */}
            <Grid item xs={12} md={6} sx={{ position: 'relative', zIndex: 1 }}>
              {/* Chip de estado */}
              <Chip
                icon={content.chipIcon}
                label={content.chipText}
                color={content.chipColor}
                size="medium"
                sx={{ mb: 3, px: 1, fontWeight: 500 }}
              />
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: content.avatarColor,
                    width: 80, 
                    height: 80,
                    mr: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  {content.icon}
                </Avatar>
                
                <Box>
                  <Typography 
                    variant="h3" 
                    component="h1" 
                    fontWeight="bold"
                    sx={{ 
                      fontSize: { xs: '1.5rem', sm: '2rem', md: '2.2rem' },
                      color: content.primaryButton.color + '.main'
                    }}
                  >
                    {content.title}
                  </Typography>
                  
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'text.secondary',
                      fontWeight: 'normal',
                      fontSize: { xs: '1rem', sm: '1.1rem' }
                    }}
                  >
                    {content.subtitle}
                  </Typography>
                </Box>
              </Box>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 4, 
                  color: 'text.secondary',
                  fontSize: '1.05rem',
                  lineHeight: 1.7
                }}
              >
                {content.description}
              </Typography>

              {from && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 4,
                    py: 1,
                    px: 2,
                    borderRadius: 1,
                    display: 'inline-block',
                    backgroundColor: alpha(theme.palette.grey[500], 0.1),
                    fontFamily: 'monospace',
                    color: 'text.secondary'
                  }}
                >
                  <InfoIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5, opacity: 0.7 }} />
                  Intentaste acceder a: {from}
                </Typography>
              )}
              
              <Stack 
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ mb: { xs: 4, md: 0 } }}
              >
                <Button
                  variant="contained"
                  color={content.primaryButton.color}
                  size="large"
                  startIcon={content.primaryButton.icon}
                  onClick={content.primaryButton.action}
                  sx={{ 
                    px: 3, 
                    py: 1.2, 
                    fontSize: '1rem',
                    borderRadius: 2,
                    fontWeight: 'bold',
                    animation: `${pulseAnimation} 2s infinite`,
                    boxShadow: `0 4px 14px ${alpha(theme.palette[content.primaryButton.color].main, 0.4)}`
                  }}
                >
                  {content.primaryButton.text}
                </Button>
                
                <Button
                  variant="outlined"
                  color={content.primaryButton.color}
                  size="large"
                  startIcon={<HomeIcon />}
                  onClick={() => navigate('/')}
                  sx={{ 
                    px: 3, 
                    py: 1.2, 
                    fontSize: '1rem',
                    borderRadius: 2,
                    fontWeight: 'bold'
                  }}
                >
                  Ir a Inicio
                </Button>
                
                {from && (
                  <Tooltip title="Volver a la página anterior">
                    <Button
                      variant="text"
                      color="inherit"
                      size="large"
                      startIcon={<ArrowBack />}
                      onClick={() => navigate(-1)}
                      sx={{ 
                        px: 3, 
                        py: 1.2,
                        fontSize: '1rem',
                        borderRadius: 2
                      }}
                    >
                      Volver
                    </Button>
                  </Tooltip>
                )}
              </Stack>
            </Grid>
            
            {/* Columna derecha - Panel de ayuda */}
            <Grid 
              item 
              xs={12} 
              md={6}
              sx={{ 
                borderLeft: { xs: 'none', md: `1px solid ${alpha(theme.palette.divider, 0.1)}` },
                pl: { xs: 0, md: 5 },
                position: 'relative',
                zIndex: 1
              }}
            >
              <Grow in={showHelp} timeout={1000}>
                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 3,
                      fontWeight: 'bold',
                      color: 'text.primary',
                      borderBottom: `2px solid ${alpha(theme.palette[content.primaryButton.color].main, 0.2)}`,
                      pb: 1,
                      display: 'inline-block'
                    }}
                  >
                    {content.helpTitle}
                  </Typography>
                  
                  {content.helpItems.map((item, index) => (
                    <Grow 
                      key={index} 
                      in={showHelp} 
                      timeout={1000} 
                      style={{ transformOrigin: '0 0 0', transitionDelay: `${300 + index * 200}ms` }}
                    >
                      <Card sx={helpCardStyle}>
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                              sx={{ 
                                width: 40, 
                                height: 40, 
                                mr: 2,
                                bgcolor: alpha(theme.palette[content.primaryButton.color].main, 0.1)
                              }}
                            >
                              {item.icon}
                            </Avatar>
                            <Typography variant="body1" sx={{ color: 'text.primary' }}>
                              {item.text}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grow>
                  ))}
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Grow 
                    in={showHelp} 
                    timeout={1000} 
                    style={{ transformOrigin: '0 0 0', transitionDelay: '900ms' }}
                  >
                    <Box sx={{ mt: 2, backgroundColor: alpha(theme.palette.grey[500], 0.05), p: 2, borderRadius: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'text.secondary' }}>
                        ¿Necesitas ayuda adicional?
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Si tienes problemas para acceder, contacta con soporte o verifica tus credenciales de acceso.
                      </Typography>
                    </Box>
                  </Grow>
                </Box>
              </Grow>
            </Grid>
          </Grid>
        </Paper>
      </Fade>
    </Container>
  );
};

export default AuthError;
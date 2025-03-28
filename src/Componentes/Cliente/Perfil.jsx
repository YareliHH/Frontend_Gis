import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  TextField, 
  Button, 
  Paper, 
  Avatar,
  CircularProgress,
  Divider,
  Snackbar,
  Alert,
  ThemeProvider,
  createTheme,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
  LinearProgress,
  Chip,
  Tooltip,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import { 
  Edit, 
  Save, 
  Person,
  Lock,
  Visibility,
  VisibilityOff,
  Check,
  Close,
  Security,
  Email,
  Phone,
  KeyboardArrowRight
} from '@mui/icons-material';
import { useAuth } from '../Autenticacion/AuthContext';
import axios from 'axios';

// Crear tema personalizado con colores turquesa
const theme = createTheme({
  palette: {
    primary: {
      main: '#00bcd4',
      light: '#4dd0e1',
      dark: '#0097a7',
      contrastText: '#fff',
    },
    secondary: {
      main: '#26a69a',
      light: '#4db6ac',
      dark: '#00796b',
      contrastText: '#fff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff'
    },
    success: {
      main: '#2ecc71',
    },
    warning: {
      main: '#f39c12'
    },
    error: {
      main: '#e74c3c',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#7f8c8d'
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
    subtitle1: {
      fontWeight: 500,
    }
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 6,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
          }
        }
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 6
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          overflow: 'visible'
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
        }
      }
    }
  }
});

const UserProfile = () => {
  // Acceso al contexto de autenticación
  const { user: authUser, loading: authLoading } = useAuth();
  
  const [user, setUser] = useState({
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    correo: '',
    telefono: '',
    tipo: '',
    estado: ''
  });

  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [tempUser, setTempUser] = useState(user);
  
  // Estado para validaciones instantáneas
  const [validations, setValidations] = useState({
    nombre: { valid: true, message: '' },
    apellido_paterno: { valid: true, message: '' },
    apellido_materno: { valid: true, message: '' },
    telefono: { valid: true, message: '' },
  });

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Estado para diálogo de cambio de contraseña
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    number: false,
    uppercase: false,
    special: false
  });
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Cargar datos del perfil desde el servidor
  useEffect(() => {
    if (authUser) {
      fetchUserProfile();
    }
  }, [authUser]);

  // Función para obtener datos del perfil
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/api/perfil', {
        withCredentials: true
      });
      
      // Mapeo de datos según la estructura de tu BDD
      const userData = {
        nombre: response.data.nombre || '',
        apellido_paterno: response.data.apellido_paterno || '',
        apellido_materno: response.data.apellido_materno || '',
        correo: response.data.correo || authUser.correo,
        telefono: response.data.telefono || '',
        tipo: response.data.tipo || authUser.tipo,
        estado: response.data.estado || ''
      };

      setUser(userData);
      setTempUser(userData);

      // Inicializar validaciones
      validateAllFields(userData);
      
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      showNotification('Error al cargar datos del perfil', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Validación de todos los campos
  const validateAllFields = (userData) => {
    const newValidations = {
      nombre: validateName(userData.nombre),
      apellido_paterno: validateLastName(userData.apellido_paterno),
      apellido_materno: validateLastName(userData.apellido_materno),
      telefono: validatePhone(userData.telefono)
    };
    setValidations(newValidations);
  };

  // Validar nombre
  const validateName = (name) => {
    if (!name.trim()) {
      return { valid: false, message: 'El nombre es requerido' };
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name)) {
      return { valid: false, message: 'Solo se permiten letras' };
    }
    return { valid: true, message: '' };
  };

  // Validar apellido
  const validateLastName = (lastName) => {
    if (!lastName.trim()) {
      return { valid: false, message: 'El apellido es requerido' };
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(lastName)) {
      return { valid: false, message: 'Solo se permiten letras' };
    }
    return { valid: true, message: '' };
  };

  // Validar teléfono
  const validatePhone = (phone) => {
    if (!phone.trim()) {
      return { valid: true, message: '' }; // Teléfono opcional
    }
    if (!/^\d{10}$/.test(phone)) {
      return { valid: false, message: 'Debe contener 10 dígitos' };
    }
    return { valid: true, message: '' };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Prevenir números en campos de texto para nombres y apellidos
    if ((name === 'nombre' || name === 'apellido_paterno' || name === 'apellido_materno') && 
        /\d/.test(value)) {
      return; // No actualizar el estado si se detectan números
    }
    
    setTempUser(prev => ({
      ...prev,
      [name]: value
    }));

    // Validar el campo inmediatamente
    let validation = { valid: true, message: '' };
    
    switch (name) {
      case 'nombre':
        validation = validateName(value);
        break;
      case 'apellido_paterno':
        validation = validateLastName(value);
        break;
      case 'apellido_materno':
        validation = validateLastName(value);
        break;
      case 'telefono':
        validation = validatePhone(value);
        break;
      default:
        break;
    }

    setValidations(prev => ({
      ...prev,
      [name]: validation
    }));
  };

  // Verificar si todos los campos son válidos
  const isFormValid = () => {
    return Object.values(validations).every(val => val.valid);
  };

  const handleSave = async () => {
    if (!isFormValid()) {
      showNotification('Por favor corrige los errores en el formulario', 'error');
      return;
    }

    try {
      setLoading(true);
      // Enviar datos actualizados al servidor
      await axios.put('http://localhost:3001/api/perfil', tempUser, {
        withCredentials: true
      });
      
      setUser(tempUser);
      setEditMode(false);
      showNotification('Perfil actualizado correctamente', 'success');
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      showNotification('Error al guardar los cambios', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Abrir/cerrar diálogo de cambio de contraseña
  const handlePasswordDialogOpen = () => {
    setPasswordDialogOpen(true);
  };

  const handlePasswordDialogClose = () => {
    setPasswordDialogOpen(false);
    // Reiniciar estados
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordChecks({
      length: false,
      number: false,
      uppercase: false,
      special: false
    });
    setPasswordStrength(0);
    setPasswordMatchError('');
  };

  // Manejar cambios en los campos de contraseña
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validar y evaluar fortaleza solo para la nueva contraseña
    if (name === 'newPassword') {
      validatePassword(value);
      
      // Verificar coincidencia si ya hay confirmación
      if (passwordData.confirmPassword) {
        if (passwordData.confirmPassword !== value) {
          setPasswordMatchError('Las contraseñas no coinciden');
        } else {
          setPasswordMatchError('');
        }
      }
    }

    // Validar coincidencia para confirmación
    if (name === 'confirmPassword') {
      if (value !== passwordData.newPassword) {
        setPasswordMatchError('Las contraseñas no coinciden');
      } else {
        setPasswordMatchError('');
      }
    }
  };

  // Validar fortaleza de contraseña
  const validatePassword = (password) => {
    let strength = 0;
    const checks = {
      length: password.length >= 8,
      number: /\d/.test(password),
      uppercase: /[A-Z]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    // Calcular fortaleza
    if (checks.length) strength += 25;
    if (checks.number) strength += 25;
    if (checks.uppercase) strength += 25;
    if (checks.special) strength += 25;

    setPasswordStrength(strength);
    setPasswordChecks(checks);
  };

  // Verificar si la contraseña es válida
  const isPasswordValid = () => {
    return Object.values(passwordChecks).every(check => check);
  };

  // Cambiar contraseña
  const handleChangePassword = async () => {
    // Validar datos
    if (!isPasswordValid() || passwordMatchError) {
      showNotification('Por favor corrige los errores de contraseña', 'error');
      return;
    }

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      showNotification('Todos los campos son obligatorios', 'error');
      return;
    }

    try {
      setLoading(true);
      // Enviar solicitud de cambio de contraseña
      await axios.post('http://localhost:3001/api/cambiar-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        withCredentials: true
      });
      
      handlePasswordDialogClose();
      showNotification('Contraseña actualizada correctamente', 'success');
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      if (error.response && error.response.status === 401) {
        showNotification('La contraseña actual es incorrecta', 'error');
      } else {
        showNotification('Error al cambiar la contraseña', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, severity) => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({
      ...prev,
      open: false
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Obtener la primera letra del nombre para el avatar
  const getAvatarLetter = () => {
    if (user.nombre && user.nombre.length > 0) {
      return user.nombre.charAt(0).toUpperCase();
    }
    return '?';
  };

  // Obtener color para el avatar basado en tipo de usuario
  const getAvatarColor = () => {
    const colors = {
      admin: '#f50057',
      usuario: '#00bcd4',
      empleado: '#26a69a'
    };
    return colors[user.tipo] || '#00bcd4';
  };

  // Mostrar spinner mientras carga la autenticación
  if (authLoading || loading) {
    return (
      <ThemeProvider theme={theme}>
        <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress color="primary" />
        </Container>
      </ThemeProvider>
    );
  }

  // Redirigir o mostrar mensaje si no hay usuario autenticado
  if (!authUser) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="md" sx={{ py: 6, textAlign: 'center' }}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 5, 
              borderRadius: 3,
              background: 'linear-gradient(to right, #f5f5f5, #e0f7fa)'
            }}
          >
            <Typography variant="h5" color="error" gutterBottom>
              Acceso restringido
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              Necesitas iniciar sesión para ver tu perfil
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              href="/login"
              startIcon={<Person />}
              color="primary"
              sx={{ px: 4, py: 1.2 }}
            >
              Iniciar sesión
            </Button>
          </Paper>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ py: 5 }}>
        {/* Header con información básica */}
        <Paper 
          elevation={2} 
          sx={{ 
            mb: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #00bcd4 0%, #26a69a 100%)',
            color: 'white',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ p: 4, position: 'relative' }}>
            {/* Botón de edición en esquina superior derecha */}
            <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
              {!editMode ? (
                <Button 
                  variant="contained" 
                  startIcon={<Edit />}
                  onClick={() => setEditMode(true)}
                  size="medium"
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.25)',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.4)',
                    },
                    boxShadow: 'none',
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  Editar Perfil
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button 
                    variant="outlined" 
                    onClick={() => {
                      setTempUser(user);
                      setEditMode(false);
                      validateAllFields(user);
                    }}
                    size="medium"
                    sx={{ 
                      color: 'white',
                      borderColor: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)',
                      }
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    variant="contained" 
                    startIcon={<Save />}
                    onClick={handleSave}
                    disabled={!isFormValid()}
                    size="medium"
                    sx={{ 
                      bgcolor: 'white',
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.9)',
                      }
                    }}
                  >
                    Guardar
                  </Button>
                </Box>
              )}
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              flexDirection: { xs: 'column', sm: 'row' }
            }}>
              <Avatar
                sx={{ 
                  width: 100, 
                  height: 100, 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  border: '3px solid rgba(255,255,255,0.8)',
                  mr: { xs: 0, sm: 4 },
                  mb: { xs: 2, sm: 0 },
                  boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
                }}
              >
                {getAvatarLetter()}
              </Avatar>
              
              <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {user.nombre || 'Nombre'} {user.apellido_paterno || 'Apellido'}
                </Typography>
                <Typography variant="h6" sx={{ mb: 1.5, opacity: 0.9 }}>
                  {user.correo}
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  gap: 2,
                  justifyContent: { xs: 'center', sm: 'flex-start' }
                }}>
                  {user.tipo && (
                    <Chip
                      label={user.tipo.charAt(0).toUpperCase() + user.tipo.slice(1)}
                      size="medium"
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.25)',
                        color: 'white',
                        fontWeight: 500,
                        backdropFilter: 'blur(8px)',
                        pl: 1,
                        pr: 1
                      }}
                    />
                  )}
                  {user.estado && (
                    <Chip
                      label={user.estado.charAt(0).toUpperCase() + user.estado.slice(1)}
                      size="medium"
                      sx={{
                        bgcolor: user.estado === 'activo' ? 'rgba(46,204,113,0.8)' : 'rgba(231,76,60,0.8)',
                        color: 'white',
                        fontWeight: 'bold',
                        pl: 1,
                        pr: 1
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
          
          {/* Botón de cambio de contraseña en una barra separada */}
          <Box sx={{ 
            bgcolor: 'rgba(0,0,0,0.1)', 
            py: 1.5, 
            px: 4,
            backdropFilter: 'blur(5px)',
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
            <Button
              startIcon={<Security />}
              onClick={handlePasswordDialogOpen}
              sx={{ 
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Cambiar contraseña
            </Button>
          </Box>
        </Paper>

        {/* Tarjeta principal de datos personales */}
        <Card elevation={2}>
          <CardHeader
            title={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Person sx={{ mr: 1.5, color: 'primary.main' }} />
                <Typography variant="h6" color="primary.main">
                  Información Personal
                </Typography>
              </Box>
            }
            sx={{ 
              pb: 1,
              pt: 3,
              px: 3,
              '& .MuiCardHeader-title': { 
                fontWeight: 600 
              }
            }}
          />
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Nombre"
                  name="nombre"
                  value={editMode ? tempUser.nombre : user.nombre}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  error={editMode && !validations.nombre.valid}
                  helperText={editMode && !validations.nombre.valid ? validations.nombre.message : ''}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person fontSize="small" color={editMode && !validations.nombre.valid ? "error" : "inherit"} />
                      </InputAdornment>
                    ),
                    endAdornment: editMode && (
                      <InputAdornment position="end">
                        {validations.nombre.valid ? 
                          <Check fontSize="small" color="success" /> : 
                          validations.nombre.message && <Close fontSize="small" color="error" />
                        }
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Apellido Paterno"
                  name="apellido_paterno"
                  value={editMode ? tempUser.apellido_paterno : user.apellido_paterno}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  error={editMode && !validations.apellido_paterno.valid}
                  helperText={editMode && !validations.apellido_paterno.valid ? validations.apellido_paterno.message : ''}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person fontSize="small" color={editMode && !validations.apellido_paterno.valid ? "error" : "inherit"} />
                      </InputAdornment>
                    ),
                    endAdornment: editMode && (
                      <InputAdornment position="end">
                        {validations.apellido_paterno.valid ? 
                          <Check fontSize="small" color="success" /> : 
                          validations.apellido_paterno.message && <Close fontSize="small" color="error" />
                        }
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Apellido Materno"
                  name="apellido_materno"
                  value={editMode ? tempUser.apellido_materno : user.apellido_materno}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  error={editMode && !validations.apellido_materno.valid}
                  helperText={editMode && !validations.apellido_materno.valid ? validations.apellido_materno.message : ''}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person fontSize="small" color={editMode && !validations.apellido_materno.valid ? "error" : "inherit"} />
                      </InputAdornment>
                    ),
                    endAdornment: editMode && tempUser.apellido_materno && (
                      <InputAdornment position="end">
                        {validations.apellido_materno.valid ? 
                          <Check fontSize="small" color="success" /> : 
                          validations.apellido_materno.message && <Close fontSize="small" color="error" />
                        }
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Correo Electrónico"
                  name="correo"
                  value={user.correo}
                  variant="outlined"
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email fontSize="small" />
                      </InputAdornment>
                    ),
                    readOnly: true
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  name="telefono"
                  value={editMode ? tempUser.telefono : user.telefono}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  error={editMode && !validations.telefono.valid}
                  helperText={editMode && !validations.telefono.valid ? validations.telefono.message : ''}
                  inputProps={{ maxLength: 10 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone fontSize="small" color={editMode && !validations.telefono.valid ? "error" : "inherit"} />
                      </InputAdornment>
                    ),
                    endAdornment: editMode && tempUser.telefono && (
                      <InputAdornment position="end">
                        {validations.telefono.valid ? 
                          <Check fontSize="small" color="success" /> : 
                          validations.telefono.message && <Close fontSize="small" color="error" />
                        }
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Diálogo para cambiar contraseña */}
        <Dialog 
          open={passwordDialogOpen} 
          onClose={handlePasswordDialogClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Security sx={{ mr: 1.5, color: 'primary.main' }} />
              <Typography variant="h6" color="primary.main" fontWeight={600}>
                Cambiar Contraseña
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Contraseña Actual"
                  name="currentPassword"
                  type={showPassword.current ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility('current')}
                          edge="end"
                        >
                          {showPassword.current ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nueva Contraseña"
                  name="newPassword"
                  type={showPassword.new ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility('new')}
                          edge="end"
                        >
                          {showPassword.new ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />

                {/* Indicador de fortaleza con mejor visualización */}
                {passwordData.newPassword && (
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Fortaleza de la contraseña
                      </Typography>
                      <Typography variant="body2" sx={{
                        fontWeight: 600,
                        color: passwordStrength < 40 ? 'error.main' :
                          passwordStrength < 80 ? 'warning.main' : 'success.main'
                      }}>
                        {passwordStrength < 40 ? 'Débil' :
                          passwordStrength < 80 ? 'Moderada' : 'Fuerte'}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={passwordStrength}
                      color={
                        passwordStrength < 40 ? 'error' :
                          passwordStrength < 80 ? 'warning' : 'success'
                      }
                      sx={{ borderRadius: 5, height: 8 }}
                    />
                  </Box>
                )}

                {/* Requisitos de contraseña más visuales */}
                {passwordData.newPassword && (
                  <Box sx={{ mb: 3, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5 }}>
                    <Tooltip title="Mínimo 8 caracteres" placement="top">
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        color: passwordChecks.length ? 'success.main' : 'text.secondary',
                        p: 1,
                        bgcolor: passwordChecks.length ? 'rgba(46,204,113,0.1)' : 'transparent',
                        borderRadius: 1
                      }}>
                        {passwordChecks.length ? 
                          <Check color="success" /> : 
                          <Close color="action" />
                        }
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          8+ caracteres
                        </Typography>
                      </Box>
                    </Tooltip>
                    
                    <Tooltip title="Al menos un número" placement="top">
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        color: passwordChecks.number ? 'success.main' : 'text.secondary',
                        p: 1,
                        bgcolor: passwordChecks.number ? 'rgba(46,204,113,0.1)' : 'transparent',
                        borderRadius: 1
                      }}>
                        {passwordChecks.number ? 
                          <Check color="success" /> : 
                          <Close color="action" />
                        }
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          Un número
                        </Typography>
                      </Box>
                    </Tooltip>
                    
                    <Tooltip title="Al menos una mayúscula" placement="top">
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        color: passwordChecks.uppercase ? 'success.main' : 'text.secondary',
                        p: 1,
                        bgcolor: passwordChecks.uppercase ? 'rgba(46,204,113,0.1)' : 'transparent',
                        borderRadius: 1
                      }}>
                        {passwordChecks.uppercase ? 
                          <Check color="success" /> : 
                          <Close color="action" />
                        }
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          Una mayúscula
                        </Typography>
                      </Box>
                    </Tooltip>
                    
                    <Tooltip title="Al menos un carácter especial" placement="top">
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        color: passwordChecks.special ? 'success.main' : 'text.secondary',
                        p: 1,
                        bgcolor: passwordChecks.special ? 'rgba(46,204,113,0.1)' : 'transparent',
                        borderRadius: 1
                      }}>
                        {passwordChecks.special ? 
                          <Check color="success" /> : 
                          <Close color="action" />
                        }
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          Carácter especial
                        </Typography>
                      </Box>
                    </Tooltip>
                  </Box>
                )}
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirmar Contraseña"
                  name="confirmPassword"
                  type={showPassword.confirm ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  variant="outlined"
                  error={!!passwordMatchError}
                  helperText={passwordMatchError}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility('confirm')}
                          edge="end"
                        >
                          {showPassword.confirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
            <Button onClick={handlePasswordDialogClose} variant="outlined">
              Cancelar
            </Button>
            <Button 
              onClick={handleChangePassword}
              variant="contained" 
              color="primary"
              disableElevation
              disabled={
                !isPasswordValid() || 
                !!passwordMatchError || 
                !passwordData.currentPassword || 
                !passwordData.newPassword || 
                !passwordData.confirmPassword
              }
            >
              Actualizar Contraseña
            </Button>
          </DialogActions>
        </Dialog>

        {/* Notificación para feedback */}
        <Snackbar 
          open={notification.open} 
          autoHideDuration={5000} 
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseNotification} 
            severity={notification.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default UserProfile;
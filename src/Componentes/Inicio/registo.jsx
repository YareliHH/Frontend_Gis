import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  InputAdornment,
  CircularProgress,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Divider,
  LinearProgress,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Lock,
  AccountBox,
  Visibility,
  VisibilityOff,
  ChevronRight,
  ChevronLeft,
  CheckCircleOutline,
  HealthAndSafety
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Notificaciones from '../Compartidos/Notificaciones';
import zxcvbn from 'zxcvbn';

const Registro = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  // Estados para el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correo: '',
    telefono: '',
    password: '',
    confirmPassword: '',
    token: '',
  });

  // Estados para el manejo de errores y validación
  const [errors, setErrors] = useState({});
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenVerified, setTokenVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [showTokenField, setShowTokenField] = useState(false);

  // Estados para el stepper
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Verificación de correo', 'Datos personales', 'Seguridad', 'Confirmación'];

  // Estados para notificaciones
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Expresiones regulares para validación
  const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook|yahoo|live|uthh\.edu)\.(com|mx)$/;
  const phoneRegex = /^[0-9]{10}$/;

  // Color principal
  const primaryColor = '#4e67e5';

  // Función para verificar reglas de contraseña
  const checkPasswordRules = (password) => {
    const errors = [];
    let strength = 0;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 8;
    const noRepeatingChars = !/(.)\1{2}/.test(password);

    if (!hasUpperCase) errors.push('Al menos una letra mayúscula');
    if (!hasNumber) errors.push('Al menos un número');
    if (!hasSpecialChar) errors.push('Al menos un símbolo especial');
    if (!hasMinLength) errors.push('Mínimo 8 caracteres');
    if (!noRepeatingChars) errors.push('No más de 2 caracteres iguales seguidos');

    if (hasUpperCase) strength += 20;
    if (hasNumber) strength += 20;
    if (hasSpecialChar) strength += 20;
    if (hasMinLength) strength += 20;
    if (noRepeatingChars) strength += 20;

    setPasswordStrength(strength);
    return errors;
  };

  // Función para manejar cambios en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    const trimmedValue = value.trim();
    setFormData({
      ...formData,
      [name]: trimmedValue,
    });

    const newErrors = { ...errors };

    if (name === 'nombre' && !nameRegex.test(trimmedValue)) {
      newErrors.nombre = 'El nombre debe contener solo letras.';
    } else {
      delete newErrors.nombre;
    }

    if (name === 'apellidoPaterno' && !nameRegex.test(trimmedValue)) {
      newErrors.apellidoPaterno = 'El apellido paterno debe contener solo letras.';
    } else {
      delete newErrors.apellidoPaterno;
    }

    if (name === 'apellidoMaterno' && !nameRegex.test(trimmedValue)) {
      newErrors.apellidoMaterno = 'El apellido materno debe contener solo letras.';
    } else {
      delete newErrors.apellidoMaterno;
    }

    if (name === 'correo' && !emailRegex.test(trimmedValue)) {
      newErrors.correo = 'El correo electrónico no es válido.';
    } else {
      delete newErrors.correo;
    }

    if (name === 'telefono' && !phoneRegex.test(trimmedValue)) {
      newErrors.telefono = 'El teléfono debe contener 10 dígitos numéricos.';
    } else {
      delete newErrors.telefono;
    }

    if (name === 'password') {
      const passwordErrors = checkPasswordRules(trimmedValue);
      setPasswordError(passwordErrors.length > 0 ? passwordErrors : []);
    }

    if (name === 'confirmPassword') {
      setPasswordMatchError(trimmedValue !== formData.password ? 'Las contraseñas no coinciden.' : '');
    }

    setErrors(newErrors);
  };

  // Función para verificar email
  const handleVerifyEmail = async () => {
    if (!formData.correo) {
      setErrors({ ...errors, correo: 'Ingresa un correo electrónico válido.' });
      return;
    }

    if (errors.correo) {
      return;
    }

    setIsVerifying(true);
    try {
      const response = await axios.post('https://backend-gis-1.onrender.com/api/verificar-correo', { correo: formData.correo });
      if (response.data.exists) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          correo: 'El correo ya está registrado. Intenta con otro.',
        }));
      } else {
        setSnackbarMessage('Código de verificación enviado a tu correo.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setShowTokenField(true);
        setEmailVerified(true);
      }
    } catch (error) {
      setSnackbarMessage('Error al enviar el código de verificación.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsVerifying(false);
    }
  };

  // Función para verificar token
  const handleVerifyToken = async () => {
    if (!formData.token) {
      setSnackbarMessage('Ingresa el código de verificación.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await axios.post('https://backend-gis-1.onrender.com/api/verify-token', {
        correo: formData.correo,
        token: formData.token
      });

      if (response.data.valid) {
        // Actualiza inmediatamente el estado
        setTokenVerified(true);

        // Guarda el estado en localStorage para mayor seguridad
        localStorage.setItem('tokenVerified', 'true');

        setSnackbarMessage('Código verificado correctamente.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);

        // Avanza al siguiente paso sin usar setTimeout
        setActiveStep(1);
      } else {
        setSnackbarMessage('Código inválido o expirado.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error en la verificación:', error);
      setSnackbarMessage('Error al verificar el código.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Función para manejar el registro
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!tokenVerified) {
      setSnackbarMessage('Debes verificar el código antes de registrarte.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    // Verificar que todos los campos necesarios estén completos
    const requiredFields = [
      'nombre', 'apellidoPaterno', 'apellidoMaterno', 'correo', 'telefono', 'password', 'confirmPassword'
    ];

    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      setSnackbarMessage('Por favor, completa todos los campos obligatorios.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (Object.keys(errors).length > 0 || passwordError.length > 0 || passwordMatchError) {
      setSnackbarMessage('Por favor, corrige los errores en el formulario.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    setIsLoading(true);

    try {
      await axios.post('https://backend-gis-1.onrender.com/api/registro', formData);
      setSnackbarMessage('¡Usuario registrado exitosamente!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      setSnackbarMessage('Error al registrar usuario. Inténtalo de nuevo.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Funciones para controlar el stepper
  const handleNext = () => {
    let canProceed = true;

    // Validaciones según el paso actual
    if (activeStep === 0) {
      const isVerified = tokenVerified || localStorage.getItem('tokenVerified') === 'true';

      if (!isVerified) {
        setSnackbarMessage('Debes verificar el código de verificación primero.');
        setSnackbarSeverity('warning');
        setSnackbarOpen(true);
        canProceed = false;
      }
    }
    else if (activeStep === 1) {
      const personalFields = ['nombre', 'apellidoPaterno', 'apellidoMaterno', 'telefono'];
      const missingPersonal = personalFields.filter(field => !formData[field]);
      const hasPersonalErrors = personalFields.some(field => errors[field]);

      if (missingPersonal.length > 0 || hasPersonalErrors) {
        setSnackbarMessage('Por favor, completa correctamente todos los datos personales.');
        setSnackbarSeverity('warning');
        setSnackbarOpen(true);
        canProceed = false;
      }
    }
    else if (activeStep === 2) {
      if (passwordError.length > 0 || passwordMatchError || !formData.password || !formData.confirmPassword) {
        setSnackbarMessage('Por favor, configura correctamente tu contraseña.');
        setSnackbarSeverity('warning');
        setSnackbarOpen(true);
        canProceed = false;
      }
    }

    if (canProceed) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);

      // Si llegamos al último paso, enviar el formulario
      if (activeStep === steps.length - 2) {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Función para renderizar el paso de verificación de correo (Paso 1)
  const renderEmailVerification = () => (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: primaryColor }}>
        Verificación de correo electrónico
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
        Comienza ingresando tu correo electrónico para verificar que no esté registrado.
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Correo electrónico"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: primaryColor }} />
                </InputAdornment>
              ),
              readOnly: emailVerified,
            }}
            required
            error={!!errors.correo}
            helperText={errors.correo || (emailVerified ? 'El correo ya fue validado para su registro.' : '')}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />

          {!emailVerified ? (
            <Button
              onClick={handleVerifyEmail}
              variant="contained"
              fullWidth
              disabled={isVerifying || !!errors.correo || !formData.correo}
              startIcon={isVerifying ? <CircularProgress size={20} color="inherit" /> : <Email />}
              sx={{
                mt: 2,
                py: 1.2,
                borderRadius: 2,
                backgroundColor: primaryColor
              }}
            >
              {isVerifying ? 'Enviando código...' : 'Enviar código de verificación'}
            </Button>
          ) : (
            <Alert
              severity="success"
              icon={<CheckCircleOutline />}
              sx={{ mt: 2 }}
            >
              Correo electrónico validado
            </Alert>
          )}
        </Grid>

        {showTokenField && (
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
              Ingresa el código de verificación enviado a tu correo electrónico
            </Typography>

            <TextField
              fullWidth
              label="Código de verificación"
              name="token"
              value={formData.token}
              onChange={handleChange}
              InputProps={{
                readOnly: tokenVerified,
              }}
              helperText={tokenVerified ? 'Código validado correctamente.' : 'Ingresa el código de 6 dígitos enviado a tu correo.'}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />

            {!tokenVerified ? (
              <Button
                onClick={handleVerifyToken}
                variant="contained"
                fullWidth
                disabled={!formData.token}
                sx={{
                  mt: 2,
                  py: 1.2,
                  borderRadius: 2,
                  backgroundColor: primaryColor
                }}
              >
                Verificar código
              </Button>
            ) : (
              <Alert
                severity="success"
                icon={<CheckCircleOutline />}
                sx={{ mt: 2 }}
              >
                Código verificado correctamente. Puedes continuar con el registro.
              </Alert>
            )}
          </Grid>
        )}
      </Grid>
    </Box>
  );

  // Función para renderizar el paso de datos personales (Paso 2)
  const renderPersonalInfo = () => (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: primaryColor }}>
        Datos personales
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
        Ingresa tus datos personales para completar tu perfil.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Nombre(s)"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person sx={{ color: primaryColor }} />
                </InputAdornment>
              ),
            }}
            required
            error={!!errors.nombre}
            helperText={errors.nombre}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Apellido Paterno"
            name="apellidoPaterno"
            value={formData.apellidoPaterno}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountBox sx={{ color: primaryColor }} />
                </InputAdornment>
              ),
            }}
            required
            error={!!errors.apellidoPaterno}
            helperText={errors.apellidoPaterno}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Apellido Materno"
            name="apellidoMaterno"
            value={formData.apellidoMaterno}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountBox sx={{ color: primaryColor }} />
                </InputAdornment>
              ),
            }}
            required
            error={!!errors.apellidoMaterno}
            helperText={errors.apellidoMaterno}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Teléfono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone sx={{ color: primaryColor }} />
                </InputAdornment>
              ),
            }}
            required
            error={!!errors.telefono}
            helperText={errors.telefono || "Ejemplo: 7775553333"}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );

  // Función para renderizar el paso de seguridad (Paso 3)
  const renderSecurityInfo = () => (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: primaryColor }}>
        Configura tu contraseña
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
        Tu contraseña debe ser segura y cumplir con los siguientes requisitos.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Contraseña"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: primaryColor }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            required
            error={passwordError.length > 0}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />

          {/* Indicador de fortaleza de contraseña */}
          {formData.password && (
            <Box sx={{ mt: 1, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" color="text.secondary">
                  Fortaleza de la contraseña:
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

          {/* Requisitos de contraseña */}
          {passwordError.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" color="error" gutterBottom>
                La contraseña debe cumplir con:
              </Typography>
              {passwordError.map((error, index) => (
                <Typography key={index} variant="body2" color="error" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  • {error}
                </Typography>
              ))}
            </Box>
          )}
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Confirmar Contraseña"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: primaryColor }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            required
            error={!!passwordMatchError}
            helperText={passwordMatchError}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );

  // Función para renderizar el paso de confirmación (Paso 4)
  const renderConfirmation = () => (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: primaryColor }}>
        Confirmación de registro
      </Typography>

      {isLoading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress size={60} sx={{ color: primaryColor, mb: 3 }} />
          <Typography variant="h6">
            Procesando tu registro...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Esto puede tomar unos momentos.
          </Typography>
        </Box>
      ) : (
        <Box>
          <Alert severity="success" sx={{ mb: 3 }}>
            ¡Tu cuenta ha sido creada con éxito!
          </Alert>

          <Typography variant="body1" paragraph>
            En unos momentos serás redirigido a la página de inicio de sesión.
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            Ya puedes acceder a GisLive usando tu correo y contraseña.
          </Typography>

          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate('/login')}
            sx={{
              mt: 2,
              py: 1.2,
              borderRadius: 2,
              backgroundColor: primaryColor
            }}
          >
            Ir a Iniciar Sesión
          </Button>
        </Box>
      )}
    </Box>
  );

  // Renderizar el contenido según el paso activo
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderEmailVerification();
      case 1:
        return renderPersonalInfo();
      case 2:
        return renderSecurityInfo();
      case 3:
        return renderConfirmation();
      default:
        return 'Paso desconocido';
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 5,
        backgroundColor: '#f5f7fa'
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            borderRadius: 3,
            overflow: 'hidden'
          }}
        >
          {/* Cabecera */}
          <Box sx={{
            p: 3,
            background: 'linear-gradient(90deg, #6a77dc 0%, #53caeb 100%)',
            display: 'flex',
            alignItems: 'center'
          }}>
            <HealthAndSafety sx={{ color: 'white', fontSize: 36, mr: 2 }} />
            <Box>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 600 }}>
                Registro de nueva cuenta
              </Typography>
            </Box>
          </Box>

          {/* Stepper */}
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Stepper
              activeStep={activeStep}
              alternativeLabel={!isMobile}
              orientation={isMobile ? "vertical" : "horizontal"}
              sx={{ mb: 4 }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Divider sx={{ mb: 4 }} />

            {/* Contenido del paso actual */}
            <Box sx={{ p: { xs: 1, sm: 2 } }}>
              {getStepContent(activeStep)}
            </Box>

            {/* Botones de navegación */}
            {activeStep !== steps.length - 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  startIcon={<ChevronLeft />}
                  sx={{
                    borderRadius: 2,
                    borderColor: primaryColor,
                    color: primaryColor
                  }}
                >
                  Anterior
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={activeStep === 0 && !tokenVerified}
                  endIcon={<ChevronRight />}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: primaryColor
                  }}
                >
                  {activeStep === steps.length - 2 ? 'Finalizar' : 'Siguiente'}
                </Button>
              </Box>
            )}
          </Box>
        </Paper>

        {/* Botón para volver al login */}
        {activeStep !== steps.length - 1 && (
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              onClick={() => navigate('/login')}
              sx={{
                color: 'text.secondary',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              ¿Ya tienes cuenta? Iniciar sesión
            </Button>
          </Box>
        )}
      </Container>

      {/* Notificaciones */}
      <Notificaciones
        open={snackbarOpen}
        message={snackbarMessage}
        type={snackbarSeverity}
        handleClose={handleSnackbarClose}
      />
    </Box>
  );
};

export default Registro;

//nose que hacer pitsotl
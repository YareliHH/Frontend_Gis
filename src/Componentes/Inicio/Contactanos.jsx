import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  Snackbar, 
  Alert 
} from '@mui/material';
import ReCAPTCHA from "react-google-recaptcha";

const Contactanos = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    correo:'',
    telefono: '',
    mensaje: '',
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [openSuccessNotification, setOpenSuccessNotification] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  useEffect(() => {
    const matchDarkTheme = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(matchDarkTheme.matches);

    const handleThemeChange = (e) => {
      setIsDarkMode(e.matches);
    };

    matchDarkTheme.addEventListener('change', handleThemeChange);

    return () => {
      matchDarkTheme.removeEventListener('change', handleThemeChange);
    };
  }, []);

  const validate = () => {
    let newErrors = {};
  
    // Nombre completo validation
    if (!form.nombre.trim()) {
      newErrors.nombre = 'Por favor, ingresa tu nombre';
    }
  
    // Correo electrónico validation
    if (!form.correo.trim()) {
      newErrors.correo = 'Por favor, ingresa tu correo electrónico';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) {
      newErrors.correo = 'Por favor, ingresa un correo electrónico válido';
    }
  
    // Número de teléfono validation
    if (!form.telefono.trim()) {
      newErrors.telefono = 'Por favor, ingresa tu número de teléfono';
    } else if (!/^\d+$/.test(form.telefono)) {
      newErrors.telefono = 'Por favor, ingresa un número de teléfono válido';
    }
  
    // Mensaje validation
    if (!form.mensaje.trim()) {
      newErrors.mensaje = 'Por favor, escribe tu mensaje';
    }

    // reCAPTCHA validation
    if (!recaptchaToken) {
      newErrors.recaptcha = 'Por favor, verifica que no eres un robot';
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  const handleCloseSuccessNotification = () => {
    setOpenSuccessNotification(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar si la validación es exitosa
    if (validate()) {
        try {
            // Realizar la solicitud POST al backend con Axios
            const response = await axios.post('https://backend-gis-1.onrender.com/api/contacto', {
                ...form,
                recaptchaToken
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Preparar mensaje de éxito con los datos enviados
            const successText = `Mensaje enviado exitosamente:\n`;

            // Mostrar notificación de éxito
            setSuccessMessage(successText);
            setOpenSuccessNotification(true);

            // Limpiar formulario
            setForm({ nombre: '', correo: '', telefono: '', mensaje: '' });
            setRecaptchaToken(null);

        } catch (error) {
            console.error('Error al enviar el formulario:', error.response?.data || error.message);
        }
    } else {
        console.log('Formulario no válido');
    }
};
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '20px',
      }}
    >
      <Grid container spacing={4} sx={{ maxWidth: '1000px', textAlign: 'left' }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: '20px', borderRadius: '8px', backgroundColor: '#FFFFFF' }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ textAlign: 'center' }}>
              Contacto
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, textAlign: 'center', color: '#555' }}>
              Estaremos encantados de recibir tu mensaje.
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Nombre"
                name="nombre"
                margin="normal"
                variant="outlined"
                value={form.nombre}
                onChange={handleChange}
                error={!!errors.nombre}
                helperText={errors.nombre}
              />
              <TextField
                fullWidth
                label="Correo "
                name="correo"
                margin="normal"
                variant="outlined"
                value={form.correo}
                onChange={handleChange}
                error={!!errors.correo}
                helperText={errors.correo}
              />
              <TextField
                fullWidth
                label="Teléfono"
                name="telefono"
                margin="normal"
                variant="outlined"
                value={form.telefono}
                onChange={handleChange}
                error={!!errors.telefono}
                helperText={errors.telefono}
              />
              <TextField
                fullWidth
                label="Mensaje"
                name="mensaje"
                margin="normal"
                variant="outlined"
                multiline
                rows={4}
                value={form.mensaje}
                onChange={handleChange}
                error={!!errors.mensaje}
                helperText={errors.mensaje}
              />
              <Box sx={{ my: 2 }}>
                <ReCAPTCHA
                  sitekey="6LcKwWEqAAAAAMe2IRU4TukPaY92LJnE6c8pZtSo"
                  onChange={handleRecaptchaChange}
                />
                {errors.recaptcha && (
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    {errors.recaptcha}
                  </Typography>
                )}
              </Box>
              <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, mb: 3 }}>
                Enviar
              </Button>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ textAlign: 'center' }}>
            Nuestra Ubicación
          </Typography>
          <Box sx={{ width: '100%', height: 500, borderRadius: '8px', overflow: 'hidden', boxShadow: 3 }}>
            <iframe
              title="Ubicación"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src="https://www.google.com/maps/embed?pb=!3m2!1ses!2smx!4v1738279572591!5m2!1ses!2smx!6m8!1m7!1sfptv_59OOGwWnICTLujcAQ!2m2!1d21.14024956987548!2d-98.42112377080686!3f282.3148371518607!4f7.436404529233116!5f0.7820865974627469"
              allowFullScreen
            ></iframe>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={openSuccessNotification}
        autoHideDuration={6000}
        onClose={handleCloseSuccessNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSuccessNotification} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contactanos;
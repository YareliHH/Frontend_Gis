import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  Paper,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom';

const DireccionForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    calleNumero: '',
    codigoPostal: '',
    estado: '',
    municipio: '',
    colonia: '',
    instrucciones: '',
    predeterminada: false,
  });

  const [errors, setErrors] = useState({
    calleNumero: '',
    codigoPostal: '',
    estado: '',
    municipio: '',
    colonia: '',
  });

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.calleNumero.trim()) {
      newErrors.calleNumero = 'La calle y número son requeridos';
      isValid = false;
    }
    if (!formData.codigoPostal.match(/^\d{5}$/)) {
      newErrors.codigoPostal = 'El código postal debe tener 5 dígitos';
      isValid = false;
    }
    if (!formData.estado.trim()) {
      newErrors.estado = 'El estado es requerido';
      isValid = false;
    }
    if (!formData.municipio.trim()) {
      newErrors.municipio = 'El municipio es requerido';
      isValid = false;
    }
    if (!formData.colonia.trim()) {
      newErrors.colonia = 'La colonia es requerida';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Datos de envío:', formData);
      navigate('/cliente/mercadopago');
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: 'auto',
        my: 6,
        px: { xs: 2, sm: 3, md: 0 },
      }}
    >
      {/* Botón de regreso */}
      <Box sx={{ mb: 3 }}>
        <Button
          onClick={() => navigate('/cliente/carrito-compras')}
          startIcon={<ArrowBackIosIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            textTransform: 'none',
            border: 'none',
            background: 'none',
            color: 'primary.main',
            fontSize: '1rem',
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
              background: 'none',
            },
            pl: 0,
          }}
        >
          Regresar al carrito
        </Button>
      </Box>

      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: 'primary.main',
          mb: 1,
        }}
      >
        Mi Dirección
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        mb={4}
        sx={{ fontSize: '1.1rem' }}
      >
        Administra tu dirección de envío y facturación
      </Typography>

      <Paper
        elevation={4}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Calle y número"
                name="calleNumero"
                fullWidth
                value={formData.calleNumero}
                onChange={handleChange}
                error={!!errors.calleNumero}
                helperText={errors.calleNumero}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                placeholder="Ej: Av. Insurgentes 123"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Código Postal"
                name="codigoPostal"
                fullWidth
                value={formData.codigoPostal}
                onChange={handleChange}
                error={!!errors.codigoPostal}
                helperText={errors.codigoPostal}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                placeholder="Ej: 12345"
                inputProps={{ maxLength: 5 }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Estado"
                name="estado"
                fullWidth
                value={formData.estado}
                onChange={handleChange}
                error={!!errors.estado}
                helperText={errors.estado}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                placeholder="Ej: Hidalgo"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Municipio"
                name="municipio"
                fullWidth
                value={formData.municipio}
                onChange={handleChange}
                error={!!errors.municipio}
                helperText={errors.municipio}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                placeholder="Ej: Mexico"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Colonia"
                name="colonia"
                fullWidth
                value={formData.colonia}
                onChange={handleChange}
                error={!!errors.colonia}
                helperText={errors.colonia}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                placeholder="Ej: Lomas"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Instrucciones de entrega (opcional)"
                name="instrucciones"
                fullWidth
                multiline
                minRows={4}
                value={formData.instrucciones}
                onChange={handleChange}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                placeholder="Ej: Dejar en recepción si no hay nadie"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="predeterminada"
                    checked={formData.predeterminada}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="Establecer como dirección predeterminada"
                sx={{ color: 'text.secondary', fontSize: '0.9rem' }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  onClick={() => navigate('/cliente/mercadopago')}
                  variant="contained"
                  sx={{
                    px: 3,
                    py: 1,
                    fontSize: '0.9rem',
                    textTransform: 'none',
                    borderRadius: 2,
                    bgcolor: 'primary.main',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  Continuar pago  
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default DireccionForm;
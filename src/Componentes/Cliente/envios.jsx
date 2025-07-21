import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom';

const DireccionForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    calle: '',
    numero: '',
    codigo_postal: '',
    estado: '',
    municipio: '',
    colonia: '',
    instrucciones: '',
    es_predeterminada: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes hacer validación si gustas
    // Luego enviar los datos al backend si es necesario
    console.log('Datos enviados:', formData);
  };

  return (
    <Box maxWidth={1000} mx="auto" mt={4} p={2}>
      <Typography
        onClick={() => navigate('/cliente/carrito-compras')}
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: '#1976d2',
          cursor: 'pointer',
          mb: 2,
          '&:hover': {
            textDecoration: 'underline',
          },
        }}
      >
        <ArrowBackIosIcon sx={{ mr: 1 }} />
        Regresar
      </Typography>

      <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
        Mi Dirección
      </Typography>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Calle"
                name="calle"
                placeholder="Ej. Av. Reforma"
                fullWidth
                value={formData.calle}
                onChange={handleChange}
                error={!!errors.calle}
                helperText={errors.calle}
                variant="outlined"
                InputProps={{ sx: { borderRadius: 1 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Número"
                name="numero"
                placeholder="Ej. 123"
                fullWidth
                value={formData.numero}
                onChange={handleChange}
                error={!!errors.numero}
                helperText={errors.numero}
                variant="outlined"
                InputProps={{ sx: { borderRadius: 1 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Código Postal"
                name="codigo_postal"
                placeholder="Ej. 43000"
                fullWidth
                value={formData.codigo_postal}
                onChange={handleChange}
                error={!!errors.codigo_postal}
                helperText={errors.codigo_postal}
                variant="outlined"
                InputProps={{ sx: { borderRadius: 1 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Estado"
                name="estado"
                placeholder="Ej. Hidalgo"
                fullWidth
                value={formData.estado}
                onChange={handleChange}
                error={!!errors.estado}
                helperText={errors.estado}
                variant="outlined"
                InputProps={{ sx: { borderRadius: 1 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Municipio"
                name="municipio"
                placeholder="Ej. Huejutla"
                fullWidth
                value={formData.municipio}
                onChange={handleChange}
                error={!!errors.municipio}
                helperText={errors.municipio}
                variant="outlined"
                InputProps={{ sx: { borderRadius: 1 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Colonia"
                name="colonia"
                placeholder="Ej. Centro"
                fullWidth
                value={formData.colonia}
                onChange={handleChange}
                error={!!errors.colonia}
                helperText={errors.colonia}
                variant="outlined"
                InputProps={{ sx: { borderRadius: 1 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Instrucciones"
                name="instrucciones"
                placeholder="Ej. Dejar en recepción o con el vigilante"
                fullWidth
                value={formData.instrucciones}
                onChange={handleChange}
                variant="outlined"
                multiline
                rows={3}
                InputProps={{ sx: { borderRadius: 1 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="es_predeterminada"
                    checked={formData.es_predeterminada}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="Establecer como dirección predeterminada"
                sx={{ ml: 0 }}
              />
            </Grid>
            <Grid item xs={12}>
             <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/cliente/mercadopago')}
              sx={{ mt: 2, px: 4, borderRadius: 2 }}
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

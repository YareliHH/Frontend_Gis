import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  Paper,
  CircularProgress,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom';

const DireccionForm = ({ usuarioId }) => {
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
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.calle.trim()) newErrors.calle = 'Requerido';
    if (!formData.numero.trim()) newErrors.numero = 'Requerido';
    if (!/^\d{5}$/.test(formData.codigo_postal))
      newErrors.codigo_postal = 'Debe ser 5 dígitos';
    if (!formData.estado.trim()) newErrors.estado = 'Requerido';
    if (!formData.municipio.trim()) newErrors.municipio = 'Requerido';
    if (!formData.colonia.trim()) newErrors.colonia = 'Requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await axios.post('https://backend-gis-1.onrender.com/api/direcciones/upsert', {
        ...formData,
        usuario_id: usuarioId,
      });
      navigate('/cliente/mercadopago');
    } catch (err) {
      console.error(err);
      alert('Error al guardar la dirección');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      maxWidth={800}
      mx="auto"
      mt={4}
      p={3}
      sx={{ bgcolor: '#f5f5f5', borderRadius: 2 }}
    >
      <Button
        onClick={() => navigate('/cliente/carrito-compras')}
        startIcon={<ArrowBackIosIcon />}
        variant="outlined"
        sx={{
          mb: 3,
          color: '#1976d2',
          borderColor: '#1976d2',
          '&:hover': { borderColor: '#1565c0', color: '#1565c0' },
        }}
      >
        Regresar
      </Button>
      <Typography
        variant="h4"
        component="h1"
        align="center"
        gutterBottom
        sx={{ fontWeight: 700, color: '#333', mb: 4 }}
      >
        Mi Dirección
      </Typography>

      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 2,
          bgcolor: 'white',
          transition: 'box-shadow 0.3s',
          '&:hover': { boxShadow: 8 },
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Calle"
                name="calle"
                fullWidth
                value={formData.calle}
                onChange={handleChange}
                error={!!errors.calle}
                helperText={errors.calle}
                variant="outlined"
                InputProps={{
                  sx: { borderRadius: 1, bgcolor: '#fafafa' },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Número"
                name="numero"
                fullWidth
                value={formData.numero}
                onChange={handleChange}
                error={!!errors.numero}
                helperText={errors.numero}
                variant="outlined"
                InputProps={{
                  sx: { borderRadius: 1, bgcolor: '#fafafa' },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Código Postal"
                name="codigo_postal"
                fullWidth
                value={formData.codigo_postal}
                onChange={handleChange}
                error={!!errors.codigo_postal}
                helperText={errors.codigo_postal}
                variant="outlined"
                InputProps={{
                  sx: { borderRadius: 1, bgcolor: '#fafafa' },
                }}
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
                InputProps={{
                  sx: { borderRadius: 1, bgcolor: '#fafafa' },
                }}
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
                InputProps={{
                  sx: { borderRadius: 1, bgcolor: '#fafafa' },
                }}
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
                InputProps={{
                  sx: { borderRadius: 1, bgcolor: '#fafafa' },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Instrucciones"
                name="instrucciones"
                fullWidth
                value={formData.instrucciones}
                onChange={handleChange}
                variant="outlined"
                multiline
                rows={4}
                InputProps={{
                  sx: { borderRadius: 1, bgcolor: '#fafafa' },
                }}
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
                    sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }}
                  />
                }
                label="Establecer como dirección predeterminada"
                sx={{ ml: 0, '& .MuiTypography-root': { fontSize: '1rem' } }}
              />
            </Grid>
            <Grid item xs={12} textAlign="center">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                sx={{
                  mt: 3,
                  px: 5,
                  borderRadius: 2,
                  '&:disabled': { bgcolor: '#b0bec5', cursor: 'not-allowed' },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Guardar y continuar'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default DireccionForm;
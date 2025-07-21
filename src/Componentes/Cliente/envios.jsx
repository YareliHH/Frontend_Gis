import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Paper, Grid, Checkbox, FormControlLabel
} from '@mui/material';
import { ArrowBackIos as ArrowBackIosIcon } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Direcciones = ({ usuarioId }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    calle: '',
    numero: '',
    codigo_postal: '',
    estado: '',
    municipio: '',
    colonia: '',
    instrucciones: '',
    es_predeterminada: false,
  });

  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [colorMensaje, setColorMensaje] = useState('success.main');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (usuarioId) obtenerDirecciones();
  }, [usuarioId]);

  const obtenerDirecciones = async () => {
    try {
      const res = await axios.get(`https://backend-gis-1.onrender.com/api/direcciones/usuario/${usuarioId}`);
      // console.log(res.data);
    } catch (error) {
      console.error('Error al obtener direcciones:', error);
    }
  };

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validarCampos = () => {
    const nuevosErrores = {};
    const camposObligatorios = ['calle', 'numero', 'codigo_postal', 'estado', 'municipio', 'colonia'];

    camposObligatorios.forEach((campo) => {
      if (!form[campo] || form[campo].trim() === '') {
        nuevosErrores[campo] = 'Este campo es obligatorio';
      }
    });

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const registrarDireccion = async () => {
    setMensaje('');
    if (!validarCampos()) return;

    setCargando(true);
    try {
      const res = await axios.post('https://backend-gis-1.onrender.com/api/direcciones/upsert', {
        usuario_id: usuarioId,
        ...form,
      });

      setMensaje(res.data.mensaje || 'Dirección registrada correctamente');
      setColorMensaje('success.main');

      setForm({
        calle: '',
        numero: '',
        codigo_postal: '',
        estado: '',
        municipio: '',
        colonia: '',
        instrucciones: '',
        es_predeterminada: false,
      });

      return true;
    } catch (error) {
      const mensajeError = error.response?.data?.mensaje || 'Error al registrar dirección.';
      setMensaje(mensajeError);
      setColorMensaje('error.main');
      return false;
    } finally {
      setCargando(false);
    }
  };

  const placeholders = {
    calle: 'Ej: Av. Juárez',
    numero: 'Ej: 123',
    codigo_postal: 'Ej: 43000',
    estado: 'Ej: Hidalgo',
    municipio: 'Ej: Huejutla de Reyes',
    colonia: 'Ej: Centro',
    instrucciones: 'Ej: Entregar en portón negro, tocar claxon',
  };

  return (
    <Box maxWidth={900} mx="auto" mt={4}>
      <Typography
        onClick={() => navigate('/cliente/carrito-compras')}
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: '#1976d2',
          cursor: 'pointer',
          mb: 2,
          '&:hover': { textDecoration: 'underline' },
        }}
      >
        <ArrowBackIosIcon sx={{ mr: 1 }} />
        Regresar
      </Typography>

      <Typography variant="h5" gutterBottom>Mis Direcciones</Typography>

      {mensaje && (
        <Typography sx={{ mb: 2, color: colorMensaje }}>
          {mensaje}
        </Typography>
      )}

      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2}>
          {['calle', 'numero', 'codigo_postal', 'estado', 'municipio', 'colonia'].map((campo) => (
            <Grid item xs={12} sm={6} key={campo}>
              <TextField
                fullWidth
                name={campo}
                label={campo.replace('_', ' ').toUpperCase()}
                value={form[campo]}
                onChange={manejarCambio}
                placeholder={placeholders[campo]}
                error={!!errores[campo]}
                helperText={errores[campo]}
              />
            </Grid>
          ))}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              name="instrucciones"
              label="Instrucciones"
              value={form.instrucciones}
              onChange={manejarCambio}
              placeholder={placeholders.instrucciones}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  name="es_predeterminada"
                  checked={form.es_predeterminada}
                  onChange={manejarCambio}
                />
              }
              label="Establecer como predeterminada"
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={async () => {
                  const exito = await registrarDireccion();
                  if (exito) {
                    navigate('/cliente/mercadopago');
                  }
                }}
                sx={{ mt: 2, px: 4, borderRadius: 2 }}
                disabled={cargando}
              >
                {cargando ? 'Guardando...' : 'Continuar pago'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Direcciones;

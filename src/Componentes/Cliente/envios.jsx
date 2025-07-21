import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Paper, Grid, Checkbox, FormControlLabel
} from '@mui/material';
import { ArrowBackIos as ArrowBackIosIcon } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Autenticacion/AuthContext';

const Direcciones = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const usuarioId = user?.id;
  const autenticado = Boolean(user);

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
  const [direcciones, setDirecciones] = useState([]);

  // Carga inicial de direcciones
  useEffect(() => {
    if (!loading && autenticado) {
      obtenerDirecciones();
    }
  }, [loading, autenticado]);

  const obtenerDirecciones = async () => {
    try {
      const res = await axios.get(
        `https://backend-gis-1.onrender.com/api/direcciones/usuario/${usuarioId}`,
        { withCredentials: true }
      );
      setDirecciones(res.data);
    } catch (error) {
      console.error('Error al obtener direcciones:', error);
    }
  };

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validarCampos = () => {
    const nuevos = {};
    ['calle','numero','codigo_postal','estado','municipio','colonia']
      .forEach(c => {
        if (!form[c]?.trim()) nuevos[c] = 'Este campo es obligatorio';
      });
    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  };

  const registrarDireccion = async () => {
    setMensaje('');
    if (!validarCampos()) return;
    if (!autenticado) {
      setMensaje('Usuario no autenticado');
      setColorMensaje('error.main');
      return;
    }
    setCargando(true);
    try {
      const res = await axios.post(
        'https://backend-gis-1.onrender.com/api/direcciones/upsert',
        { usuario_id: usuarioId, ...form },
        { withCredentials: true }
      );
      setMensaje(res.data.mensaje || 'Dirección registrada correctamente');
      setColorMensaje('success.main');
      setForm({
        calle: '', numero: '', codigo_postal: '',
        estado: '', municipio: '', colonia: '',
        instrucciones: '', es_predeterminada: false,
      });
      obtenerDirecciones();
      return true;
    } catch (err) {
      const msg = err.response?.data?.mensaje || 'Error al registrar dirección.';
      setMensaje(msg);
      setColorMensaje('error.main');
      return false;
    } finally {
      setCargando(false);
    }
  };

  if (loading) {
    return <Typography>Cargando…</Typography>;
  }

  return (
    <Box maxWidth={900} mx="auto" mt={4}>
      <Typography
        onClick={() => navigate('/cliente/carrito-compras')}
        sx={{
          display: 'flex', alignItems: 'center',
          color: '#1976d2', cursor: 'pointer', mb: 2,
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

      {autenticado && direcciones.length > 0 && (
        <Paper sx={{ p: 2, mb: 4 }}>
          {direcciones.map(dir => (
            <Box key={dir.id} sx={{ mb: 1 }}>
              {dir.calle} {dir.numero}, {dir.colonia}, {dir.municipio} — {dir.estado}
            </Box>
          ))}
        </Paper>
      )}

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2}>
          {['calle','numero','codigo_postal','estado','municipio','colonia']
            .map(campo => (
              <Grid item xs={12} sm={6} key={campo}>
                <TextField
                  fullWidth
                  name={campo}
                  label={campo.replace('_',' ').toUpperCase()}
                  value={form[campo]}
                  onChange={manejarCambio}
                  placeholder={`Ej: ${campo === 'codigo_postal' ? '43000' : campo}`}
                  error={!!errores[campo]}
                  helperText={errores[campo]}
                />
              </Grid>
          ))}
          <Grid item xs={12}>
            <TextField
              fullWidth multiline rows={2}
              name="instrucciones"
              label="Instrucciones"
              value={form.instrucciones}
              onChange={manejarCambio}
              placeholder="Ej: Entregar en portón negro, tocar claxon"
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
          <Grid item xs={12} sx={{ textAlign: 'right' }}>
            <Button
              variant="contained" size="large"
              onClick={async () => {
                const ok = await registrarDireccion();
                if (ok) navigate('/cliente/mercadopago');
              }}
              disabled={cargando}
              sx={{ borderRadius: 2, px: 4 }}
            >
              {cargando ? 'Guardando...' : 'Continuar pago'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Direcciones;

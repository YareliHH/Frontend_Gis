import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Paper, Grid, Checkbox, FormControlLabel,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Card, CardContent,
  Chip, Divider
} from '@mui/material';
import { 
  ArrowBackIos as ArrowBackIosIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Autenticacion/AuthContext';

const Direcciones = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const usuarioId = user?.id;
  const autenticado = Boolean(user);

  const [form, setForm] = useState({
    calle: '', numero: '', codigo_postal: '',
    estado: '', municipio: '', colonia: '',
    instrucciones: '', es_predeterminada: false,
  });
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [colorMensaje, setColorMensaje] = useState('success.main');
  const [cargando, setCargando] = useState(false);
  const [direcciones, setDirecciones] = useState([]);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [direccionEditando, setDireccionEditando] = useState(null);

  useEffect(() => {
    if (!loading && autenticado) {
      obtenerDirecciones();
    }
  }, [loading, autenticado]);

  // Obtener todas las direcciones del usuario
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

  const limpiarForm = () => {
    setForm({
      calle: '', numero: '', codigo_postal: '',
      estado: '', municipio: '', colonia: '',
      instrucciones: '', es_predeterminada: false,
    });
    setErrores({});
    setMensaje('');
  };

  // Abrir diálogo para nueva dirección
  const abrirNuevaDireccion = () => {
    limpiarForm();
    setModoEdicion(false);
    setDireccionEditando(null);
    setDialogoAbierto(true);
  };

  // Abrir diálogo para editar dirección
  const abrirEditarDireccion = (direccion) => {
    setForm({
      calle: direccion.calle,
      numero: direccion.numero,
      codigo_postal: direccion.codigo_postal,
      estado: direccion.estado,
      municipio: direccion.municipio,
      colonia: direccion.colonia,
      instrucciones: direccion.instrucciones || '',
      es_predeterminada: direccion.es_predeterminada === 1,
    });
    setModoEdicion(true);
    setDireccionEditando(direccion);
    setErrores({});
    setMensaje('');
    setDialogoAbierto(true);
  };

  // Guardar dirección (crear o actualizar)
  const guardarDireccion = async () => {
    setMensaje('');
    if (!validarCampos()) return;
    if (!autenticado) {
      setMensaje('Usuario no autenticado');
      setColorMensaje('error.main');
      return;
    }
    
    setCargando(true);
    try {
      let res;
      if (modoEdicion && direccionEditando) {
        // Actualizar dirección existente
        res = await axios.put(
          `https://backend-gis-1.onrender.com/api/direcciones/actualizar/${direccionEditando.id}`,
          form,
          { withCredentials: true }
        );
        
        // Si se marca como predeterminada, actualizar la relación
        if (form.es_predeterminada) {
          await axios.put(
            `https://backend-gis-1.onrender.com/api/direcciones/predeterminada/${usuarioId}/${direccionEditando.id}`,
            {},
            { withCredentials: true }
          );
        }
      } else {
        // Crear nueva dirección
        res = await axios.post(
          'https://backend-gis-1.onrender.com/api/direcciones/upsert',
          { usuario_id: usuarioId, ...form },
          { withCredentials: true }
        );
      }
      
      setMensaje(res.data.mensaje || `Dirección ${modoEdicion ? 'actualizada' : 'creada'} correctamente`);
      setColorMensaje('success.main');
      setDialogoAbierto(false);
      limpiarForm();
      obtenerDirecciones();
    } catch (err) {
      const msg = err.response?.data?.mensaje || `Error al ${modoEdicion ? 'actualizar' : 'crear'} dirección.`;
      setMensaje(msg);
      setColorMensaje('error.main');
    } finally {
      setCargando(false);
    }
  };

  // Eliminar dirección
  const eliminarDireccion = async (direccionId) => {
    if (!window.confirm('¿Estás seguro de eliminar esta dirección?')) return;
    
    try {
      await axios.delete(
        `https://backend-gis-1.onrender.com/api/direcciones/desvincular/${usuarioId}/${direccionId}`,
        { withCredentials: true }
      );
      setMensaje('Dirección eliminada correctamente');
      setColorMensaje('success.main');
      obtenerDirecciones();
    } catch (error) {
      setMensaje('Error al eliminar dirección');
      setColorMensaje('error.main');
    }
  };

  // Establecer como predeterminada
  const establecerPredeterminada = async (direccionId) => {
    try {
      await axios.put(
        `https://backend-gis-1.onrender.com/api/direcciones/predeterminada/${usuarioId}/${direccionId}`,
        {},
        { withCredentials: true }
      );
      setMensaje('Dirección establecida como predeterminada');
      setColorMensaje('success.main');
      obtenerDirecciones();
    } catch (error) {
      setMensaje('Error al establecer dirección predeterminada');
      setColorMensaje('error.main');
    }
  };

  if (loading) {
    return <Typography>Cargando…</Typography>;
  }

  return (
    <Box maxWidth={1000} mx="auto" mt={4} p={2}>
      <Typography
        onClick={() => navigate('/cliente/carrito-compras')}
        sx={{
          display: 'flex', alignItems: 'center',
          color: '#1976d2', cursor: 'pointer', mb: 2,
          '&:hover': { textDecoration: 'underline' },
        }}
      >
        <ArrowBackIosIcon sx={{ mr: 1 }} />
        Regresar al Carrito
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Mis Direcciones</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={abrirNuevaDireccion}
          sx={{ borderRadius: 2 }}
        >
          Agregar Dirección
        </Button>
      </Box>

      {mensaje && (
        <Typography sx={{ mb: 2, color: colorMensaje, textAlign: 'center' }}>
          {mensaje}
        </Typography>
      )}

      {/* Lista de direcciones existentes */}
      {autenticado && direcciones.length > 0 ? (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {direcciones.map(dir => (
            <Grid item xs={12} md={6} key={dir.id}>
              <Card sx={{ position: 'relative', height: '100%' }}>
                <CardContent>
                  {dir.es_predeterminada === 1 && (
                    <Chip
                      icon={<HomeIcon />}
                      label="Predeterminada"
                      color="primary"
                      size="small"
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                    />
                  )}
                  
                  <Typography variant="h6" gutterBottom>
                    {dir.calle} {dir.numero}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {dir.colonia}, {dir.municipio}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {dir.estado} - {dir.codigo_postal}
                  </Typography>
                  {dir.instrucciones && (
                    <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 2 }}>
                      "{dir.instrucciones}"
                    </Typography>
                  )}
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Box>
                      <IconButton
                        onClick={() => abrirEditarDireccion(dir)}
                        color="primary"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => eliminarDireccion(dir.id)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    
                    {dir.es_predeterminada !== 1 && (
                      <Button
                        size="small"
                        onClick={() => establecerPredeterminada(dir.id)}
                        variant="outlined"
                      >
                        Predeterminada
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        autenticado && (
          <Paper sx={{ p: 4, textAlign: 'center', mb: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No tienes direcciones guardadas
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Agrega tu primera dirección para continuar
            </Typography>
          </Paper>
        )
      )}

      {/* Botón continuar pago */}
      {direcciones.length > 0 && (
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/cliente/mercadopago')}
            sx={{ borderRadius: 2, px: 4, py: 1.5 }}
          >
            Continuar con el Pago
          </Button>
        </Box>
      )}

      {/* Diálogo para agregar/editar dirección */}
      <Dialog
        open={dialogoAbierto}
        onClose={() => setDialogoAbierto(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {modoEdicion ? 'Editar Dirección' : 'Agregar Nueva Dirección'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {['calle','numero','codigo_postal','estado','municipio','colonia']
              .map(campo => (
                <Grid item xs={12} sm={6} key={campo}>
                  <TextField
                    fullWidth
                    name={campo}
                    label={campo.replace('_',' ').replace(/\b\w/g, l => l.toUpperCase())}
                    value={form[campo]}
                    onChange={manejarCambio}
                    error={!!errores[campo]}
                    helperText={errores[campo]}
                  />
                </Grid>
            ))}
            <Grid item xs={12}>
              <TextField
                fullWidth multiline rows={2}
                name="instrucciones"
                label="Instrucciones de Entrega"
                value={form.instrucciones}
                onChange={manejarCambio}
                placeholder="Ej: Casa color verde, tocar timbre dos veces"
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
                label="Establecer como dirección predeterminada"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogoAbierto(false)}>
            Cancelar
          </Button>
          <Button
            onClick={guardarDireccion}
            variant="contained"
            disabled={cargando}
          >
            {cargando ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Agregar')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Direcciones;
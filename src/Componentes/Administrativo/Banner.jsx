import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Grid,
  Divider,
  Tooltip,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { Edit, Delete, Save, Add, Cancel } from '@mui/icons-material';

const BannersAdmin = () => {
  const [banners, setBanners] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentBannerId, setCurrentBannerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://backend-gis-1.onrender.com/api/banner/obtenerbanner');
      setBanners(response.data);
    } catch (error) {
      setNotification({ open: true, message: 'Error al cargar los banners', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddBanner = async () => {
    if (!titulo || !descripcion) {
      setNotification({ open: true, message: 'El título y la descripción son obligatorios', severity: 'warning' });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    if (imagen) formData.append('imagen', imagen);

    try {
      const response = await axios.post('https://backend-gis-1.onrender.com/api/banner/agregarbanner', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setBanners([...banners, { id: response.data.id, titulo, descripcion, imagen: response.data.url || '' }]);
      resetForm();
      setNotification({ open: true, message: 'Banner agregado con éxito', severity: 'success' });
    } catch (error) {
      setNotification({ open: true, message: 'Error al agregar el banner', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleEditBanner = (id) => {
    const banner = banners.find(b => b.id === id);
    setTitulo(banner.titulo);
    setDescripcion(banner.descripcion);
    setEditMode(true);
    setCurrentBannerId(id);
    setImagen(null);
  };

  const handleUpdateBanner = async () => {
    if (!titulo || !descripcion) {
      setNotification({ open: true, message: 'El título y la descripción son obligatorios', severity: 'warning' });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    if (imagen) formData.append('imagen', imagen);

    try {
      const response = await axios.put(`https://backend-gis-1.onrender.com/api/bannersedit/${currentBannerId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchBanners();
      resetForm();
      setNotification({ open: true, message: 'Banner actualizado con éxito', severity: 'success' });
    } catch (error) {
      setNotification({ open: true, message: 'Error al actualizar el banner', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBanner = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este banner?')) return;
    setLoading(true);
    try {
      await axios.delete(`https://backend-gis-1.onrender.com/api/banner/banners/${id}`);
      setBanners(banners.filter(b => b.id !== id));
      setNotification({ open: true, message: 'Banner eliminado con éxito', severity: 'success' });
    } catch (error) {
      setNotification({ open: true, message: 'Error al eliminar el banner', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitulo('');
    setDescripcion('');
    setImagen(null);
    setEditMode(false);
    setCurrentBannerId(null);
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>Administración de Banners</Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" align="center">{editMode ? 'Editar Banner' : 'Agregar Nuevo Banner'}</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}><TextField fullWidth label="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} /></Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={4} label="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} /></Grid>
            <Grid item xs={12}><input type="file" accept="image/*" onChange={(e) => setImagen(e.target.files[0])} /></Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                {editMode ? (
                  <>
                    <Button variant="contained" color="primary" onClick={handleUpdateBanner} startIcon={<Save />}>Actualizar</Button>
                    <Button variant="outlined" color="secondary" onClick={resetForm} startIcon={<Cancel />}>Cancelar</Button>
                  </>
                ) : (
                  <Button variant="contained" color="primary" onClick={handleAddBanner} startIcon={<Add />}>Agregar</Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" align="center">Lista de Banners</Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>
        ) : banners.length === 0 ? (
          <Alert severity="info">No hay banners disponibles.</Alert>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">ID</TableCell>
                  <TableCell align="center">Título</TableCell>
                  <TableCell align="center">Descripción</TableCell>
                  <TableCell align="center">Imagen</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {banners.map(banner => (
                  <TableRow key={banner.id}>
                    <TableCell align="center">{banner.id}</TableCell>
                    <TableCell align="center">{banner.titulo}</TableCell>
                    <TableCell align="center">{banner.descripcion}</TableCell>
                    <TableCell align="center">
                      {banner.url ? <img src={banner.url} alt={banner.titulo} style={{ maxHeight: 60 }} /> : 'Sin imagen'}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => handleEditBanner(banner.id)}><Edit /></IconButton>
                      <IconButton color="error" onClick={() => handleDeleteBanner(banner.id)}><Delete /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>{notification.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default BannersAdmin;

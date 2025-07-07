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
     const response = await axios.get('http://localhost:3001/obtbanner');
      setBanners(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los banners:', error);
      setNotification({
        open: true,
        message: 'Error al cargar los banners',
        severity: 'error'
      });
      setLoading(false);
    }
  };

  const handleAddBanner = async () => {
    if (!titulo || !descripcion) {
      setNotification({
        open: true,
        message: 'El título y la descripción son obligatorios',
        severity: 'warning'
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    if (imagen) formData.append('imagen', imagen);

    try {
   const response = await axios.post('http://localhost:3001/agregarbanner', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
      setBanners([...banners, { id: response.data.id, titulo, descripcion, imagen: response.data.imagen || '' }]);
      setTitulo('');
      setDescripcion('');
      setImagen(null);
      setNotification({
        open: true,
        message: 'Banner agregado con éxito',
        severity: 'success'
      });
      setLoading(false);
    } catch (error) {
      console.error('Error al agregar el banner:', error);
      setNotification({
        open: true,
        message: 'Error al agregar el banner',
        severity: 'error'
      });
      setLoading(false);
    }
  };

  const handleEditBanner = (id) => {
    const banner = banners.find(b => b.id === id);
    setTitulo(banner.titulo);
    setDescripcion(banner.descripcion);
    setEditMode(true);
    setCurrentBannerId(id);
    setImagen(null); // Resetear imagen para permitir subir una nueva
  };

  const handleUpdateBanner = async () => {
    if (!titulo || !descripcion) {
      setNotification({
        open: true,
        message: 'El título y la descripción son obligatorios',
        severity: 'warning'
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    if (imagen) formData.append('imagen', imagen);

    try {
     const response = await axios.put(`http://localhost:3001/bannersedit/${currentBannerId}`, formData, {
     headers: { 'Content-Type': 'multipart/form-data' } 
    });
      // Actualizar el banner en el estado con los nuevos datos
      setBanners(banners.map(b => 
        b.id === currentBannerId 
          ? { ...b, titulo, descripcion, imagen: imagen ? response.data.imagen || URL.createObjectURL(imagen) : b.imagen } 
          : b
      ));
      setTitulo('');
      setDescripcion('');
      setImagen(null);
      setEditMode(false);
      setCurrentBannerId(null);
      setNotification({
        open: true,
        message: 'Banner actualizado con éxito',
        severity: 'success'
      });
      setLoading(false);
      // Refrescar la lista para asegurar consistencia con el backend
      fetchBanners();
    } catch (error) {
      console.error('Error al actualizar el banner:', error);
      setNotification({
        open: true,
        message: 'Error al actualizar el banner',
        severity: 'error'
      });
      setLoading(false);
    }
  };

  const handleDeleteBanner = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este banner?')) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:3001/banners/${id}`);
        setBanners(banners.filter(b => b.id !== id));
        setNotification({
          open: true,
          message: 'Banner eliminado con éxito',
          severity: 'success'
        });
        setLoading(false);
      } catch (error) {
        console.error('Error al eliminar el banner:', error);
        setNotification({
          open: true,
          message: 'Error al eliminar el banner',
          severity: 'error'
        });
        setLoading(false);
      }
    }
  };

  const handleCancelEdit = () => {
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
    <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2, maxWidth: '800px', width: '100%' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          fontWeight: 'bold', 
          color: '#1976d2',
          textAlign: 'center', 
          mb: 3 
        }}>
          Administración de Banners
        </Typography>

        <Box sx={{ mb: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#555', textAlign: 'center' }}>
            {editMode ? 'Editar Banner' : 'Agregar Nuevo Banner'}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Título"
                variant="outlined"
                fullWidth
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Descripción"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImagen(e.target.files[0])}
                style={{ margin: '16px 0' }}
              />
              {imagen && <Typography variant="body2">Archivo seleccionado: {imagen.name}</Typography>}
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                {editMode ? (
                  <>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      startIcon={<Save />} 
                      onClick={handleUpdateBanner}
                    >
                      Actualizar
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="secondary" 
                      startIcon={<Cancel />} 
                      onClick={handleCancelEdit}
                    >
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<Add />} 
                    onClick={handleAddBanner}
                  >
                    Agregar
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom sx={{ color: '#555', textAlign: 'center' }}>
          Lista de Banners
        </Typography>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && banners.length === 0 ? (
          <Alert severity="info" sx={{ my: 2 }}>
            No hay banners disponibles. Agrega uno nuevo.
          </Alert>
        ) : (
          <TableContainer component={Paper} sx={{ 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
            borderRadius: 2,
            overflow: 'hidden',
            maxWidth: '100%',
            margin: '0 auto'
          }}>
            <Table>
              <TableHead sx={{ bgcolor: '#1976d2' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white', textAlign: 'center', width: '10%' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white', textAlign: 'center', width: '20%' }}>Título</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white', textAlign: 'center', width: '35%' }}>Descripción</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white', textAlign: 'center', width: '20%' }}>Imagen</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white', textAlign: 'center', width: '15%' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {banners.map(banner => (
                  <TableRow 
                    key={banner.id}
                    sx={{
                      '&:nth-of-type(odd)': { backgroundColor: '#f7faff' },
                      '&:hover': { backgroundColor: '#e3f2fd' },
                      transition: 'background-color 0.3s'
                    }}
                  >
                    <TableCell sx={{ textAlign: 'center', fontSize: '0.9rem', padding: '10px' }}>{banner.id}</TableCell>
                    <TableCell sx={{ textAlign: 'center', fontSize: '0.9rem', padding: '10px' }}>
                      <Tooltip title={banner.titulo}>
                        <span>{banner.titulo.length > 20 ? `${banner.titulo.substring(0, 20)}...` : banner.titulo}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ 
                      textAlign: 'center', 
                      fontSize: '0.9rem', 
                      padding: '10px',
                      maxWidth: '250px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      <Tooltip title={banner.descripcion}>
                        <span>{banner.descripcion.length > 30 ? `${banner.descripcion.substring(0, 30)}...` : banner.descripcion}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center', padding: '10px' }}>
                      {banner.imagen ? (
                        <Tooltip title="Ver imagen completa">
                          <img 
                            src={banner.imagen} 
                            alt={banner.titulo} 
                            style={{ maxWidth: '60px', maxHeight: '60px', borderRadius: '4px', cursor: 'pointer' }} 
                            onClick={() => window.open(banner.imagen, '_blank')}
                          />
                        </Tooltip>
                      ) : (
                        <Typography variant="body2" color="textSecondary">Sin imagen</Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center', padding: '10px' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Tooltip title="Editar">
                          <IconButton 
                            color="primary" 
                            onClick={() => handleEditBanner(banner.id)}
                            sx={{ padding: '6px', '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.1)' } }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton 
                            color="error" 
                            onClick={() => handleDeleteBanner(banner.id)}
                            sx={{ padding: '6px', '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' } }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BannersAdmin;
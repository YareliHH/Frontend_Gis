import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  CircularProgress,
  Snackbar,
  IconButton
} from '@mui/material';
import { Add, Edit, Delete, Close } from '@mui/icons-material';
import axios from 'axios';

const BannerList = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    url: ''
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/api/banners/obtenerbanner');
      setBanners(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching banners:', error);
      setSnackbar({
        open: true,
        message: 'Error al cargar los banners',
        severity: 'error'
      });
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenDialog = (banner = null) => {
    if (banner) {
      setCurrentBanner(banner);
      setFormData({
        titulo: banner.titulo,
        descripcion: banner.descripcion,
        url: banner.url
      });
      setImagePreview(banner.url);
    } else {
      setCurrentBanner(null);
      setFormData({
        titulo: '',
        descripcion: '',
        url: ''
      });
      setImagePreview(null);
      setImageFile(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDeleteDialog = (banner) => {
    setCurrentBanner(banner);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleSubmit = async () => {
    try {
      if (!formData.titulo || !formData.descripcion) {
        setSnackbar({
          open: true,
          message: 'Título y descripción son obligatorios',
          severity: 'error'
        });
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('titulo', formData.titulo);
      formDataToSend.append('descripcion', formData.descripcion);
      if (imageFile) {
        formDataToSend.append('imagen', imageFile);
      } else if (formData.url) {
        formDataToSend.append('url', formData.url);
      }

      if (currentBanner) {
        // Actualizar banner existente
        await axios.put(`http://localhost:3001/api/banners/actualizarbanner/${currentBanner.id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setSnackbar({
          open: true,
          message: 'Banner actualizado correctamente',
          severity: 'success'
        });
      } else {
        // Crear nuevo banner
        await axios.post('http://localhost:3001/api/banners/insertabanner', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setSnackbar({
          open: true,
          message: 'Banner creado correctamente',
          severity: 'success'
        });
      }

      fetchBanners();
      setOpenDialog(false);
    } catch (error) {
      console.error('Error saving banner:', error);
      setSnackbar({
        open: true,
        message: 'Error al guardar el banner',
        severity: 'error'
      });
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/banners/eliminarbanner/${currentBanner.id}`);
      setSnackbar({
        open: true,
        message: 'Banner eliminado correctamente',
        severity: 'success'
      });
      fetchBanners();
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting banner:', error);
      setSnackbar({
        open: true,
        message: 'Error al eliminar el banner',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Gestión de Banners
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={() => handleOpenDialog()}
        sx={{ mb: 3 }}
      >
        Nuevo Banner
      </Button>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {banners.map((banner) => (
            <Grid item key={banner.id} xs={12} sm={6} md={4}>
              <Card>
                {banner.url && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={banner.url}
                    alt={banner.titulo}
                  />
                )}
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {banner.titulo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {banner.descripcion}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    startIcon={<Edit />}
                    onClick={() => handleOpenDialog(banner)}
                  >
                    Editar
                  </Button>
                  <Button 
                    size="small" 
                    startIcon={<Delete />}
                    color="error"
                    onClick={() => handleOpenDeleteDialog(banner)}
                  >
                    Eliminar
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog para agregar/editar banner */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentBanner ? 'Editar Banner' : 'Nuevo Banner'}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Título"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChange}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Descripción"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                multiline
                rows={4}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              {imagePreview && (
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ 
                    width: '100%', 
                    maxHeight: '200px', 
                    objectFit: 'contain',
                    marginBottom: '16px'
                  }} 
                />
              )}
              <Button
                variant="contained"
                component="label"
                fullWidth
              >
                Subir Imagen
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para confirmar eliminación */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar el banner "{currentBanner?.titulo}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensajes */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseSnackbar}
          >
            <Close fontSize="small" />
          </IconButton>
        }
      />
    </Container>
  );
};

export default BannerList;
import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Button, TextField, Grid,  Card, CardContent, CardMedia, CardActions, Dialog,  DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Alert, IconButton, Box, CircularProgress} from '@mui/material';
import { Add, Edit, Delete, Close } from '@mui/icons-material';
import axios from 'axios';

const BannerManagement = () => {
  // State variables
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    imagen: null
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch all banners on component mount
  useEffect(() => {
    fetchBanners();
  }, []);

  // Function to fetch all banners
  const fetchBanners = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3001/obtenerbanner`);
      setBanners(response.data);
    } catch (error) {
      showSnackbar('Error al cargar los banners', 'error');
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        imagen: file
      });
      
      // Create a preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  // Open dialog for adding a new banner
  const handleAddBanner = () => {
    setCurrentBanner(null);
    setFormData({
      titulo: '',
      descripcion: '',
      imagen: null
    });
    setPreviewUrl(null);
    setOpenDialog(true);
  };

  // Open dialog for editing an existing banner
  const handleEditBanner = (banner) => {
    setCurrentBanner(banner);
    setFormData({
      titulo: banner.titulo,
      descripcion: banner.descripcion,
      imagen: null
    });
    setPreviewUrl(banner.url);
    setOpenDialog(true);
  };

  // Open dialog for confirming banner deletion
  const handleDeleteBannerClick = (banner) => {
    setCurrentBanner(banner);
    setOpenDeleteDialog(true);
  };

  // Close all dialogs
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setOpenDeleteDialog(false);
    setCurrentBanner(null);
  };

  // Submit the form to create or update a banner
  const handleSubmit = async () => {
    if (!formData.titulo || !formData.descripcion) {
      showSnackbar('Título y descripción son obligatorios', 'error');
      return;
    }

    setLoading(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append('titulo', formData.titulo);
      formDataObj.append('descripcion', formData.descripcion);
      
      if (formData.imagen) {
        formDataObj.append('imagen', formData.imagen);
      } else if (currentBanner && currentBanner.url) {
        formDataObj.append('url', currentBanner.url);
      }

      let response;
      if (currentBanner) {
        // Update existing banner
        response = await axios.put(
          `http://localhost:3001/actualizarbanner/${currentBanner.id}`, 
          formDataObj
        );
        showSnackbar('Banner actualizado correctamente', 'success');
      } else {
        // Create new banner
        response = await axios.post(`http://localhost:3001/api/insertabanner`, formDataObj);
        showSnackbar('Banner creado correctamente', 'success');
      }

      // Refresh banner list
      fetchBanners();
      handleCloseDialog();
    } catch (error) {
      showSnackbar('Error al guardar el banner', 'error');
      console.error('Error saving banner:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete a banner
  const handleDeleteBanner = async () => {
    if (!currentBanner) return;
    
    setLoading(true);
    try {
      await axios.delete(`http://localhost:3001/api/eliminarbanner/${currentBanner.id}`);
      showSnackbar('Banner eliminado correctamente', 'success');
      fetchBanners();
      handleCloseDialog();
    } catch (error) {
      showSnackbar('Error al eliminar el banner', 'error');
      console.error('Error deleting banner:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show snackbar notification
  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Gestión de Banners
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<Add />} 
            onClick={handleAddBanner}
          >
            Nuevo Banner
          </Button>
        </Box>

        {loading && banners.length === 0 ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : banners.length > 0 ? (
          <Grid container spacing={3}>
            {banners.map((banner) => (
              <Grid item xs={12} sm={6} md={4} key={banner.id}>
                <Card elevation={2}>
                  {banner.url && (
                    <CardMedia
                      component="img"
                      height="180"
                      image={banner.url}
                      alt={banner.titulo}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6" component="div" gutterBottom>
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
                      onClick={() => handleEditBanner(banner)}
                    >
                      Editar
                    </Button>
                    <Button 
                      size="small" 
                      color="error" 
                      startIcon={<Delete />}
                      onClick={() => handleDeleteBannerClick(banner)}
                    >
                      Eliminar
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box textAlign="center" my={4}>
            <Typography variant="h6" color="text.secondary">
              No hay banners disponibles
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Dialog for Add/Edit Banner */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentBanner ? 'Editar Banner' : 'Nuevo Banner'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="titulo"
            label="Título"
            type="text"
            fullWidth
            value={formData.titulo}
            onChange={handleInputChange}
            required
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="descripcion"
            label="Descripción"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={formData.descripcion}
            onChange={handleInputChange}
            required
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Box sx={{ mb: 2 }}>
            <Button
              variant="outlined"
              component="label"
              color="primary"
            >
              Seleccionar Imagen
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              {formData.imagen ? `Imagen seleccionada: ${formData.imagen.name}` : 'Ninguna imagen seleccionada'}
            </Typography>
          </Box>
          {previewUrl && (
            <Box sx={{ mt: 2, position: 'relative' }}>
              <Typography variant="subtitle2" gutterBottom>
                Vista previa:
              </Typography>
              <img 
                src={previewUrl} 
                alt="Vista previa" 
                style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }} 
              />
              <IconButton
                size="small"
                sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'rgba(255,255,255,0.7)' }}
                onClick={() => {
                  setPreviewUrl(null);
                  setFormData({...formData, imagen: null});
                }}
              >
                <Close fontSize="small" />
              </IconButton>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary" 
            disabled={!formData.titulo || !formData.descripcion}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Delete Confirmation */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro que desea eliminar el banner "{currentBanner?.titulo}"? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleDeleteBanner} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BannerManagement;
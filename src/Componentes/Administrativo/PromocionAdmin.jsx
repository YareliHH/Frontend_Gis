import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  Box,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormHelperText,
  CircularProgress,
  Backdrop
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import InventoryIcon from '@mui/icons-material/Inventory';

const Promociones = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [promociones, setPromociones] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState({
    id_producto: '',
    titulo: '',
    descripcion: '',
    tipo: '',
    fecha_inicio: '',
    fecha_fin: '',
    estado: 'activo'
  });
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [errors, setErrors] = useState({});

  const fetchPromociones = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/promo/get');
      const data = await response.json();
      setPromociones(data);
    } catch (err) {
      showNotification('Error al cargar promociones', 'error');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductos = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/obtener');
      const data = await response.json();
      setProductos(data);
    } catch (err) {
      console.error('Error al cargar productos:', err);
      showNotification('Error al cargar productos', 'error');
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.id_producto) newErrors.id_producto = 'Seleccione un producto';
    if (!formData.titulo.trim()) newErrors.titulo = 'El título es obligatorio';
    if (formData.titulo.length > 100) newErrors.titulo = 'El título no puede exceder 100 caracteres';
    if (!formData.tipo) newErrors.tipo = 'Seleccione un tipo de promoción';
    if (!formData.fecha_inicio) newErrors.fecha_inicio = 'La fecha de inicio es obligatoria';
    if (!formData.fecha_fin) newErrors.fecha_fin = 'La fecha de fin es obligatoria';
    if (!formData.estado) newErrors.estado = 'Seleccione un estado';
    
    if (formData.fecha_inicio && formData.fecha_fin) {
      const fechaInicio = new Date(formData.fecha_inicio);
      const fechaFin = new Date(formData.fecha_fin);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      if (fechaInicio < hoy) newErrors.fecha_inicio = 'La fecha de inicio no puede ser anterior a hoy';
      if (fechaFin <= fechaInicio) newErrors.fecha_fin = 'La fecha de fin debe ser posterior a la fecha de inicio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    fetchPromociones();
    fetchProductos();
  }, []);

  const handleOpenForm = (promo = null) => {
    if (promo) {
      setFormData({
        id_producto: promo.id_producto || '',
        titulo: promo.titulo || '',
        descripcion: promo.descripcion || '',
        tipo: promo.tipo || '',
        fecha_inicio: promo.fecha_inicio ? promo.fecha_inicio.split('T')[0] : '',
        fecha_fin: promo.fecha_fin ? promo.fecha_fin.split('T')[0] : '',
        estado: promo.estado || 'activo'
      });
      setEditId(promo.id_promocion);
    } else {
      setFormData({
        id_producto: '',
        titulo: '',
        descripcion: '',
        tipo: '',
        fecha_inicio: '',
        fecha_fin: '',
        estado: 'activo'
      });
      setEditId(null);
    }
    setErrors({});
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setFormData({
      id_producto: '',
      titulo: '',
      descripcion: '',
      tipo: '',
      fecha_inicio: '',
      fecha_fin: '',
      estado: 'activo'
    });
    setEditId(null);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showNotification('Por favor corrija los errores en el formulario', 'warning');
      return;
    }

    setLoading(true);
    try {
      const options = {
        method: editId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      };

      const url = editId 
        ? `http://localhost:3001/api/promo/update/${editId}`
        : 'http://localhost:3001/api/promo/create';

      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      showNotification(
        editId ? 'Promoción actualizada correctamente' : 'Promoción creada correctamente', 
        'success'
      );
      handleCloseForm();
      fetchPromociones();
    } catch (err) {
      console.error('Error:', err);
      showNotification(`Error al ${editId ? 'actualizar' : 'crear'} la promoción`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar esta promoción? Esta acción no se puede deshacer.')) return;
    
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/promo/delete/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      showNotification('Promoción eliminada correctamente', 'info');
      fetchPromociones();
    } catch (err) {
      console.error('Error:', err);
      showNotification('Error al eliminar la promoción', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getProductoNombre = (idProducto) => {
    if (!productos.length) return 'Cargando...';
    const producto = productos.find(p => p.id === parseInt(idProducto));
    return producto ? producto.nombre_producto : `Producto ID: ${idProducto}`;
  };

  const getStatusColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'activo': return 'success';
      case 'inactivo': return 'error';
      case 'pausado': return 'warning';
      default: return 'default';
    }
  };

  const handleCloseNotification = () => {
    setNotification({ show: false, message: '', type: 'success' });
  };

  const isFormValid = () => {
    return formData.id_producto && formData.titulo.trim() && formData.tipo && 
           formData.fecha_inicio && formData.fecha_fin && formData.estado;
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 4 } }}>
      <Backdrop open={loading} sx={{ zIndex: theme.zIndex.modal + 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CircularProgress color="primary" />
          <Typography color="white">Procesando...</Typography>
        </Box>
      </Backdrop>

      <Box 
        display="flex" 
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between" 
        alignItems={{ xs: 'stretch', sm: 'center' }}
        mb={4}
        gap={2}
      >
        <Box>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            fontWeight={700} 
            color="primary.main"
            gutterBottom
          >
            Gestión de Promociones
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Administre las promociones de sus productos
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
          disabled={loading}
          size={isMobile ? "medium" : "large"}
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
            px: 3,
            minWidth: { xs: '100%', sm: 'auto' },
            boxShadow: 2
          }}
        >
          Nueva Promoción
        </Button>
      </Box>

      <Dialog 
        open={openForm} 
        onClose={handleCloseForm}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: { 
            borderRadius: isMobile ? 0 : 3,
            minHeight: isMobile ? '100vh' : 'auto'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            pb: 2,
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            {editId ? 'Editar Promoción' : 'Nueva Promoción'}
          </Typography>
          <IconButton 
            onClick={handleCloseForm}
            size="small"
            sx={{ color: 'grey.500' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!!errors.id_producto}>
                  <InputLabel>Producto</InputLabel>
                  <Select
                    name="id_producto"
                    value={formData.id_producto}
                    onChange={handleChange}
                    label="Producto"
                    disabled={productos.length === 0}
                  >
                    {productos.length === 0 ? (
                      <MenuItem disabled>Cargando productos...</MenuItem>
                    ) : (
                      productos.map(producto => (
                        <MenuItem key={producto.id} value={producto.id}>
                          {producto.nombre_producto} - ${producto.precio}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                  {errors.id_producto && <FormHelperText>{errors.id_producto}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label="Título" 
                  name="titulo" 
                  value={formData.titulo} 
                  onChange={handleChange}
                  required
                  error={!!errors.titulo}
                  helperText={errors.titulo || `${formData.titulo.length}/100 caracteres`}
                  inputProps={{ maxLength: 100 }}
                  placeholder="Título de la promoción"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  label="Descripción" 
                  name="descripcion" 
                  value={formData.descripcion} 
                  onChange={handleChange}
                  multiline
                  rows={3}
                  inputProps={{ maxLength: 500 }}
                  helperText={`${formData.descripcion.length}/500 caracteres`}
                  placeholder="Descripción detallada de la promoción"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!!errors.tipo}>
                  <InputLabel>Tipo de Promoción</InputLabel>
                  <Select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    label="Tipo de Promoción"
                  >
                    <MenuItem value="descuento">Descuento</MenuItem>
                    <MenuItem value="2x1">2x1</MenuItem>
                  </Select>
                  {errors.tipo && <FormHelperText>{errors.tipo}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!!errors.estado}>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    label="Estado"
                  >
                    <MenuItem value="activo">Activo</MenuItem>
                    <MenuItem value="inactivo">Inactivo</MenuItem>
                    <MenuItem value="pausado">Pausado</MenuItem>
                  </Select>
                  {errors.estado && <FormHelperText>{errors.estado}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha de Inicio"
                  name="fecha_inicio"
                  InputLabelProps={{ shrink: true }}
                  value={formData.fecha_inicio}
                  onChange={handleChange}
                  required
                  error={!!errors.fecha_inicio}
                  helperText={errors.fecha_inicio}
                  inputProps={{ min: new Date().toISOString().split('T')[0] }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha de Fin"
                  name="fecha_fin"
                  InputLabelProps={{ shrink: true }}
                  value={formData.fecha_fin}
                  onChange={handleChange}
                  required
                  error={!!errors.fecha_fin}
                  helperText={errors.fecha_fin}
                  inputProps={{ 
                    min: formData.fecha_inicio || new Date().toISOString().split('T')[0] 
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button 
            onClick={handleCloseForm}
            sx={{ textTransform: 'none', px: 3 }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            disabled={!isFormValid() || loading}
            sx={{ textTransform: 'none', px: 3 }}
          >
            {editId ? 'Actualizar Promoción' : 'Crear Promoción'}
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        {promociones.length === 0 ? (
          <Grid item xs={12}>
            <Paper 
              elevation={0}
              sx={{ 
                textAlign: 'center', 
                py: 12,
                backgroundColor: 'grey.50',
                border: '2px dashed',
                borderColor: 'grey.300',
                borderRadius: 3
              }}
            >
              <Box sx={{ mb: 3 }}>
                <InventoryIcon sx={{ fontSize: 80, color: 'grey.400' }} />
              </Box>
              <Typography variant="h5" gutterBottom color="text.secondary" fontWeight={500}>
                No hay promociones registradas
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Use el botón "Nueva Promoción" para comenzar
              </Typography>
            </Paper>
          </Grid>
        ) : (
          promociones.map(promo => (
            <Grid item xs={12} sm={6} lg={4} key={promo.id_promocion}>
              <Card 
                elevation={2}
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    elevation: 8,
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography 
                      variant="h6" 
                      fontWeight={600} 
                      color="primary.main"
                      sx={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.3,
                        minHeight: '2.6em',
                        flex: 1,
                        mr: 1
                      }}
                    >
                      {promo.titulo}
                    </Typography>
                    <Chip
                      label={promo.estado}
                      color={getStatusColor(promo.estado)}
                      size="small"
                      sx={{ textTransform: 'capitalize', fontWeight: 500 }}
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Paper elevation={0} sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 2, mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Producto:</strong><br/>
                        {getProductoNombre(promo.id_producto)}
                      </Typography>
                    </Paper>
                    
                    {promo.descripcion && (
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          mb: 2
                        }}
                      >
                        <strong>Descripción:</strong><br/>
                        {promo.descripcion}
                      </Typography>
                    )}

                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Tipo:</strong>
                      </Typography>
                      <Chip
                        label={promo.tipo === 'descuento' ? 'Descuento %' : '2x1 / 3x2'}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>

                    <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Vigencia:</strong><br/>
                        <Box component="span" sx={{ color: 'success.main', fontWeight: 500 }}>
                          {formatDate(promo.fecha_inicio)}
                        </Box>
                        <Box component="span" sx={{ mx: 1 }}>→</Box>
                        <Box component="span" sx={{ color: 'error.main', fontWeight: 500 }}>
                          {formatDate(promo.fecha_fin)}
                        </Box>
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>

                <CardActions 
                  sx={{ 
                    justifyContent: 'flex-end', 
                    pt: 0,
                    borderTop: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <IconButton 
                    color="primary" 
                    onClick={() => handleOpenForm(promo)}
                    disabled={loading}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => handleDelete(promo.id_promocion)}
                    disabled={loading}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Snackbar
        open={notification.show}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={notification.type}
          variant="filled"
          onClose={handleCloseNotification}
          sx={{ borderRadius: 2 }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Promociones;
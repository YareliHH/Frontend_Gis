import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Typography,
  Box,
  Tooltip,
  Snackbar,
  Alert,
  Grid,
  Avatar,
  Card,
  CardContent,
  CardActions,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Stack,
  Chip,
} from '@mui/material';
import { Edit, Delete, Add, Close } from '@mui/icons-material';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [newProducto, setNewProducto] = useState({
    nombre_producto: '',
    descripcion: '',
    precio: '',
    talla: '',
    color: '',
    stock: '',
    categoria_id: '',
  });
  const [imagenes, setImagenes] = useState([]); // Array de archivos seleccionados
  const [imagePreviews, setImagePreviews] = useState([]); // Array de URLs para previsualización
  const [editId, setEditId] = useState(null);
  const [editProducto, setEditProducto] = useState({});
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Opciones de tallas predefinidas
  const tallas = ['XS', 'S', 'M', 'L', 'XL'];

  // Obtener todos los productos
  const fetchProductos = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/productosid');
      setProductos(response.data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      setSnackbarMessage('Error al cargar los productos');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Manejar cambios en los campos del nuevo producto
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProducto((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar la carga de imágenes
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImagenes((prev) => [...prev, ...files]); // Agregar nuevos archivos a los existentes

    // Crear URLs para previsualización
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  // Eliminar una imagen de la lista
  const handleRemoveImage = (index) => {
    setImagenes((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Crear un nuevo producto
  const handleCreateProducto = async () => {
    if (
      !newProducto.nombre_producto.trim() ||
      !newProducto.descripcion.trim() ||
      !newProducto.precio ||
      !newProducto.stock ||
      !newProducto.categoria_id
    ) {
      setSnackbarMessage('Por favor, complete todos los campos obligatorios.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    const formData = new FormData();
    Object.keys(newProducto).forEach((key) => {
      formData.append(key, newProducto[key]);
    });
    imagenes.forEach((imagen) => {
      formData.append('imagenes', imagen);
    });

    try {
      await axios.post('http://localhost:3001/api/agregar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setNewProducto({
        nombre_producto: '',
        descripcion: '',
        precio: '',
        talla: '',
        color: '',
        stock: '',
        categoria_id: '',
      });
      setImagenes([]);
      setImagePreviews([]);
      fetchProductos();
      setSnackbarMessage('Producto creado con éxito');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error al crear producto:', error);
      setSnackbarMessage('Error al crear el producto');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Actualizar un producto
  const handleUpdateProducto = async () => {
    if (
      !editProducto.nombre_producto.trim() ||
      !editProducto.descripcion.trim() ||
      !editProducto.precio ||
      !editProducto.stock ||
      !editProducto.categoria_id
    ) {
      setSnackbarMessage('Por favor, complete todos los campos obligatorios.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    try {
      await axios.put(`http://localhost:3001/api/actualizarproducto/${editId}`, editProducto);
      setEditId(null);
      setEditProducto({});
      setOpen(false);
      fetchProductos();
      setSnackbarMessage('Producto actualizado con éxito');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      setSnackbarMessage('Error al actualizar el producto');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Eliminar un producto
  const handleDeleteProducto = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/eliminarproducto/${id}`);
      fetchProductos();
      setSnackbarMessage('Producto eliminado con éxito');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      setSnackbarMessage('Error al eliminar el producto');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Abrir diálogo de edición
  const handleClickOpen = (producto) => {
    setEditId(producto.id);
    setEditProducto(producto);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditId(null);
    setEditProducto({});
  };

  // Cerrar el Snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  return (
    <Container
      maxWidth="lg"
      sx={{
        padding: '40px 20px',
        background: 'linear-gradient(135deg, #f5f7fa 0%)',
        minHeight: '100vh',
      }}
    >
      {/* Formulario */}
      <Card
        sx={{
          backgroundColor: '#ffffff',
          padding: '30px',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
          marginBottom: '40px',
        }}
      >
        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: '700', color: '#00050a', textAlign: 'center' }}>
            Gestión de Productos
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombre del producto"
                name="nombre_producto"
                value={newProducto.nombre_producto}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                sx={{ backgroundColor: '#fafafa' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Descripción"
                name="descripcion"
                value={newProducto.descripcion}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={2}
                margin="normal"
                sx={{ backgroundColor: '#fafafa' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Precio"
                name="precio"
                type="number"
                value={newProducto.precio}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                sx={{ backgroundColor: '#fafafa' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="talla-label">Talla</InputLabel>
                <Select
                  labelId="talla-label"
                  name="talla"
                  value={newProducto.talla}
                  onChange={handleInputChange}
                  label="Talla"
                  sx={{ backgroundColor: '#fafafa' }}
                >
                  {tallas.map((talla) => (
                    <MenuItem key={talla} value={talla}>
                      {talla}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Color"
                name="color"
                value={newProducto.color}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                sx={{ backgroundColor: '#fafafa' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Stock"
                name="stock"
                type="number"
                value={newProducto.stock}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                sx={{ backgroundColor: '#fafafa' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="ID de Categoría"
                name="categoria_id"
                type="number"
                value={newProducto.categoria_id}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                sx={{ backgroundColor: '#fafafa' }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ marginTop: '20px' }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<Add />}
                  sx={{
                    borderColor: '#1976d2',
                    color: '#1976d2',
                    '&:hover': { borderColor: '#115293', color: '#115293' },
                    textTransform: 'none',
                    padding: '10px 20px',
                  }}
                >
                  Seleccionar Imágenes
                  <input
                    type="file"
                    multiple
                    hidden
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </Button>
                {imagePreviews.length > 0 && (
                  <Stack direction="row" spacing={2} sx={{ marginTop: '20px', flexWrap: 'wrap', gap: '10px' }}>
                    {imagePreviews.map((preview, index) => (
                      <Box key={index} sx={{ position: 'relative' }}>
                        <Avatar
                          src={preview}
                          alt={`Previsualización ${index + 1}`}
                          sx={{ width: 60, height: 60, borderRadius: '8px' }}
                          variant="square"
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveImage(index)}
                          sx={{
                            position: 'absolute',
                            top: '-10px',
                            right: '-10px',
                            backgroundColor: '#d32f2f',
                            color: '#fff',
                            '&:hover': { backgroundColor: '#b71c1c' },
                          }}
                        >
                          <Close fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateProducto}
            startIcon={<Add />}
            sx={{ marginTop: '20px', padding: '12px 30px', fontWeight: '600' }}
          >
            Agregar Producto
          </Button>
        </CardActions>
      </Card>

      {/* Tabla */}
      <Card
        sx={{
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        }}
      >
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                {['Nombre', 'Descripción', 'Precio', 'Talla', 'Color', 'Stock', 'Categoría', 'Acciones'].map((header) => (
                  <TableCell
                    key={header}
                    sx={{ fontWeight: '700', backgroundColor: '#1976d2', color: '#fff', textAlign: 'center' }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {productos.length > 0 ? (
                productos.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell sx={{ textAlign: 'center' }}>{item.nombre_producto}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{item.descripcion}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{item.precio}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{item.talla || '-'}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{item.color || '-'}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{item.stock}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{item.categoria_id}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Tooltip title="Editar">
                        <IconButton onClick={() => handleClickOpen(item)} sx={{ color: '#3f51b5' }}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton onClick={() => handleDeleteProducto(item.id)} sx={{ color: '#d32f2f' }}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Diálogo de edición */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Editar Producto</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre del producto"
            name="nombre_producto"
            value={editProducto.nombre_producto || ''}
            onChange={(e) => setEditProducto({ ...editProducto, nombre_producto: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Descripción"
            name="descripcion"
            value={editProducto.descripcion || ''}
            onChange={(e) => setEditProducto({ ...editProducto, descripcion: e.target.value })}
            fullWidth
            multiline
            rows={2}
            margin="normal"
          />
          <TextField
            label="Precio"
            name="precio"
            type="number"
            value={editProducto.precio || ''}
            onChange={(e) => setEditProducto({ ...editProducto, precio: e.target.value })}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="edit-talla-label">Talla</InputLabel>
            <Select
              labelId="edit-talla-label"
              name="talla"
              value={editProducto.talla || ''}
              onChange={(e) => setEditProducto({ ...editProducto, talla: e.target.value })}
              label="Talla"
            >
              <MenuItem value="">
                <em>Ninguna</em>
              </MenuItem>
              {tallas.map((talla) => (
                <MenuItem key={talla} value={talla}>
                  {talla}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Color"
            name="color"
            value={editProducto.color || ''}
            onChange={(e) => setEditProducto({ ...editProducto, color: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Stock"
            name="stock"
            type="number"
            value={editProducto.stock || ''}
            onChange={(e) => setEditProducto({ ...editProducto, stock: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="ID de Categoría"
            name="categoria_id"
            type="number"
            value={editProducto.categoria_id || ''}
            onChange={(e) => setEditProducto({ ...editProducto, categoria_id: e.target.value })}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleUpdateProducto} variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbarOpen} autoHideDuration={3001} onClose={handleSnackbarClose}>
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ backgroundColor: snackbarSeverity === 'success' ? '#388e3c' : '#d32f2f', color: '#fff' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Productos;
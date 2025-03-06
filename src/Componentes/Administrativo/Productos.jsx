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
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';

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
  const [imagenes, setImagenes] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editProducto, setEditProducto] = useState({});
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Opciones de tallas predefinidas
const tallas = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  // Obtener todos los productos
  const fetchProductos = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/productos/');
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
    setImagenes(e.target.files);
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
    for (let i = 0; i < imagenes.length; i++) {
      formData.append('imagenes', imagenes[i]);
    }

    try {
      await axios.post('http://localhost:3001/api/productos/agregar', formData, {
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
      await axios.put(`http://localhost:3001/api/productos/actualizarproducto/${editId}`, editProducto);
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
      await axios.delete(`http://localhost:3001/api/productos/eliminarproducto/${id}`);
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
              <TextField
                label="Talla"
                name="talla"
                value={newProducto.talla}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                sx={{ backgroundColor: '#fafafa' }}
              />
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
              <input
                type="file"
                multiple
                onChange={handleImageChange}
                style={{ marginTop: '20px', display: 'block' }}
              />
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
                  <TableCell colSpan={8} sx={{ textAlign: 'center', padding: '20px' }}>
                    No hay productos disponibles
                  </TableCell>
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
          <TextField
            label="Talla"
            name="talla"
            value={editProducto.talla || ''}
            onChange={(e) => setEditProducto({ ...editProducto, talla: e.target.value })}
            fullWidth
            margin="normal"
          />
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
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
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
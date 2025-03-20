// src/components/CartManager.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Grid,
  Card,
  CardContent,
  Snackbar,
  Alert
} from '@mui/material';
import { Delete, AddShoppingCart } from '@mui/icons-material';
import axios from 'axios';

const CartManager = () => {
  const [cartItems, setCartItems] = useState([]);
  const [usuarioId, setUsuarioId] = useState('');
  const [productoId, setProductoId] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (usuarioId) {
      fetchCart();
    }
  }, [usuarioId]);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`/carrito/${usuarioId}`);
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setSnackbar({ open: true, message: 'Error al obtener el carrito', severity: 'error' });
    }
  };

  const handleAddToCart = async () => {
    if (!usuarioId || !productoId) {
      setSnackbar({ open: true, message: 'Por favor, ingrese el ID del usuario y del producto', severity: 'warning' });
      return;
    }

    try {
      const response = await axios.post('/carrito/agregar', {
        usuario_id: usuarioId,
        producto_id: productoId
      });
      setSnackbar({ open: true, message: response.data.message, severity: 'success' });
      setProductoId('');
      fetchCart();
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.message || 'Error al agregar el producto', severity: 'error' });
    }
  };

  const handleRemoveFromCart = async (productoId) => {
    try {
      const response = await axios.delete(`/carrito/eliminar/${usuarioId}/${productoId}`);
      setSnackbar({ open: true, message: response.data.message, severity: 'success' });
      setCartItems(prevItems => prevItems.filter(item => item.producto_id !== productoId));
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al eliminar el producto', severity: 'error' });
      fetchCart();
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('¿Estás seguro de vaciar el carrito?')) {
      try {
        const response = await axios.delete(`/carrito/vaciar/${usuarioId}`);
        setSnackbar({ open: true, message: response.data.message, severity: 'success' });
        setCartItems([]);
      } catch (error) {
        setSnackbar({ open: true, message: 'Error al vaciar el carrito', severity: 'error' });
        fetchCart();
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ open: false, message: '', severity: 'success' });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        Gestión del Carrito
      </Typography>

      {/* Formulario para agregar productos */}
      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={5}>
              <TextField
                label="ID del Usuario"
                value={usuarioId}
                onChange={(e) => setUsuarioId(e.target.value)}
                variant="outlined"
                fullWidth
                size="small"
                sx={{ bgcolor: '#f5f5f5' }}
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                label="ID del Producto"
                value={productoId}
                onChange={(e) => setProductoId(e.target.value)}
                variant="outlined"
                fullWidth
                size="small"
                sx={{ bgcolor: '#f5f5f5' }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                variant="contained"
                startIcon={<AddShoppingCart />}
                onClick={handleAddToCart}
                fullWidth
                sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#1565c0' } }}
              >
                Agregar
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabla de productos en el carrito */}
      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#1976d2' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID Producto</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha Creación</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha Actualización</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <TableRow key={item.producto_id} sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}>
                  <TableCell>{item.producto_id}</TableCell>
                  <TableCell>{item.nombre}</TableCell>
                  <TableCell>{new Date(item.fecha_creacion).toLocaleString()}</TableCell>
                  <TableCell>{item.fecha_actualizacion ? new Date(item.fecha_actualizacion).toLocaleString() : '-'}</TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveFromCart(item.producto_id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary">
                    El carrito está vacío
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Botón para vaciar el carrito */}
      {cartItems.length > 0 && (
        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Button
            variant="outlined"
            color="error"
            onClick={handleClearCart}
            sx={{ borderRadius: '20px', textTransform: 'none' }}
          >
            Vaciar Carrito
          </Button>
        </Box>
      )}

      {/* Notificación mejorada */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CartManager;
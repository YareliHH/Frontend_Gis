import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [venta, setVenta] = useState({
    id_producto: '',
    cantidad: '',
    precio_unitario: '',
    total: '',
    fecha: '',
    metodo_pago: '',
  });
  const [editing, setEditing] = useState(false);
  const [id, setId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [showForm, setShowForm] = useState(false); // State to toggle form visibility

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchVentas();
  }, []);

  const fetchVentas = async () => {
    try {
      const response = await axios.get('http://localhost:3000/ventas');
      setVentas(response.data);
    } catch (error) {
      console.error('Error fetching ventas:', error);
    }
  };

  const fetchVenta = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/ventas/${id}`);
      setVenta({
        id_producto: response.data.id_producto || '',
        cantidad: response.data.cantidad || '',
        precio_unitario: response.data.precio_unitario || '',
        total: response.data.total || '',
        fecha: response.data.fecha || '',
        metodo_pago: response.data.metodo_pago || '',
      });
      setEditing(true);
      setId(id);
      setOpenDialog(true);
    } catch (error) {
      console.error('Error fetching venta:', error);
    }
  };

  const createVenta = async () => {
    try {
      const response = await axios.post('http://localhost:3000/ventas', venta);
      setVentas([...ventas, response.data]);
      handleCloseForm();
    } catch (error) {
      console.error('Error creating venta:', error);
    }
  };

  const updateVenta = async () => {
    try {
      await axios.put(`http://localhost:3000/ventas/${id}`, venta);
      setVentas(ventas.map((v) => (v.id === id ? { ...venta, id } : v)));
      setOpenDialog(false);
    } catch (error) {
      console.error('Error updating venta:', error);
    }
  };

  const deleteVenta = async (id) => {
    if (!window.confirm('¿Eliminar esta venta?')) return;
    try {
      await axios.delete(`http://localhost:3000/ventas/${id}`);
      setVentas(ventas.filter((v) => v.id !== id));
    } catch (error) {
      console.error('Error deleting venta:', error);
    }
  };

  const handleChange = (e) => {
    setVenta({
      ...venta,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate numeric fields
    if (isNaN(venta.cantidad) || isNaN(venta.precio_unitario) || isNaN(venta.total)) {
      alert('Cantidad, Precio Unitario y Total deben ser números válidos');
      return;
    }
    if (editing) {
      updateVenta();
    } else {
      createVenta();
    }
  };

  const handleOpenForm = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setVenta({
      id_producto: '',
      cantidad: '',
      precio_unitario: '',
      total: '',
      fecha: '',
      metodo_pago: '',
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setVenta({
      id_producto: '',
      cantidad: '',
      precio_unitario: '',
      total: '',
      fecha: '',
      metodo_pago: '',
    });
    setEditing(false);
    setId(null);
  };

  const isFormValid = () => {
    return (
      venta.id_producto.trim() !== '' &&
      venta.cantidad.trim() !== '' &&
      venta.precio_unitario.trim() !== '' &&
      venta.total.trim() !== '' &&
      venta.fecha.trim() !== '' &&
      venta.metodo_pago.trim() !== '' &&
      !isNaN(venta.cantidad) &&
      !isNaN(venta.precio_unitario) &&
      !isNaN(venta.total)
    );
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 3,
          color: '#3B8D99',
          textAlign: { xs: 'center', md: 'left' },
          fontSize: { xs: '1.8rem', md: '2.2rem' },
        }}
      >
        Gestión de Ventas
      </Typography>

      {/* Add Sale Button or Form */}
      <Box sx={{ mb: 3 }}>
        {!showForm ? (
          <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}>
            <Button
              variant="contained"
              onClick={handleOpenForm}
              sx={{
                bgcolor: '#3B8D99',
                color: '#fff',
                px: 3,
                py: 0.8,
                fontSize: '0.9rem',
                borderRadius: 1.5,
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#2A7F62',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              }}
            >
              Agregar Venta
            </Button>
          </Box>
        ) : (
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              p: { xs: 2, md: 3 },
              bgcolor: '#fff',
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="ID Producto"
                  name="id_producto"
                  value={venta.id_producto}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      '&:hover fieldset': { borderColor: '#3B8D99' },
                      '&.Mui-focused fieldset': { borderColor: '#2A7F62' },
                    },
                    '& .MuiInputLabel-root': { fontSize: '0.9rem' },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Cantidad"
                  name="cantidad"
                  type="number"
                  value={venta.cantidad}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      '&:hover fieldset': { borderColor: '#3B8D99' },
                      '&.Mui-focused fieldset': { borderColor: '#2A7F62' },
                    },
                    '& .MuiInputLabel-root': { fontSize: '0.9rem' },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Precio Unitario ($)"
                  name="precio_unitario"
                  type="number"
                  value={venta.precio_unitario}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      '&:hover fieldset': { borderColor: '#3B8D99' },
                      '&.Mui-focused fieldset': { borderColor: '#2A7F62' },
                    },
                    '& .MuiInputLabel-root': { fontSize: '0.9rem' },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Total ($)"
                  name="total"
                  type="number"
                  value={venta.total}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      '&:hover fieldset': { borderColor: '#3B8D99' },
                      '&.Mui-focused fieldset': { borderColor: '#2A7F62' },
                    },
                    '& .MuiInputLabel-root': { fontSize: '0.9rem' },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Fecha"
                  name="fecha"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={venta.fecha}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      '&:hover fieldset': { borderColor: '#3B8D99' },
                      '&.Mui-focused fieldset': { borderColor: '#2A7F62' },
                    },
                    '& .MuiInputLabel-root': { fontSize: '0.9rem' },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Método de Pago"
                  name="metodo_pago"
                  value={venta.metodo_pago}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      '&:hover fieldset': { borderColor: '#3B8D99' },
                      '&.Mui-focused fieldset': { borderColor: '#2A7F62' },
                    },
                    '& .MuiInputLabel-root': { fontSize: '0.9rem' },
                  }}
                />
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' }, gap: 2, mt: 2 }}>
                <Button
                  onClick={handleCloseForm}
                  sx={{
                    color: '#3B8D99',
                    fontSize: '0.9rem',
                    textTransform: 'none',
                    '&:hover': { color: '#2A7F62' },
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    bgcolor: '#3B8D99',
                    color: '#fff',
                    fontSize: '0.9rem',
                    px: 3,
                    py: 0.8,
                    borderRadius: 1.5,
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: '#2A7F62',
                      transform: 'scale(1.05)',
                    },
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  }}
                  disabled={!isFormValid()}
                >
                  Registrar
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>

      {/* Dialog for Edit Sale */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
        sx={{ '& .MuiDialog-paper': { borderRadius: 2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' } }}
      >
        <DialogTitle
          sx={{
            bgcolor: '#3B8D99',
            color: '#fff',
            fontWeight: 600,
            fontSize: '1.2rem',
          }}
        >
          Editar Venta
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="ID Producto"
              name="id_producto"
              value={venta.id_producto}
              onChange={handleChange}
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  '&:hover fieldset': { borderColor: '#3B8D99' },
                  '&.Mui-focused fieldset': { borderColor: '#2A7F62' },
                },
                '& .MuiInputLabel-root': { fontSize: '0.9rem' },
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Cantidad"
              name="cantidad"
              type="number"
              value={venta.cantidad}
              onChange={handleChange}
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  '&:hover fieldset': { borderColor: '#3B8D99' },
                  '&.Mui-focused fieldset': { borderColor: '#2A7F62' },
                },
                '& .MuiInputLabel-root': { fontSize: '0.9rem' },
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Precio Unitario ($)"
              name="precio_unitario"
              type="number"
              value={venta.precio_unitario}
              onChange={handleChange}
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  '&:hover fieldset': { borderColor: '#3B8D99' },
                  '&.Mui-focused fieldset': { borderColor: '#2A7F62' },
                },
                '& .MuiInputLabel-root': { fontSize: '0.9rem' },
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Total ($)"
              name="total"
              type="number"
              value={venta.total}
              onChange={handleChange}
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  '&:hover fieldset': { borderColor: '#3B8D99' },
                  '&.Mui-focused fieldset': { borderColor: '#2A7F62' },
                },
                '& .MuiInputLabel-root': { fontSize: '0.9rem' },
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Fecha"
              name="fecha"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={venta.fecha}
              onChange={handleChange}
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  '&:hover fieldset': { borderColor: '#3B8D99' },
                  '&.Mui-focused fieldset': { borderColor: '#2A7F62' },
                },
                '& .MuiInputLabel-root': { fontSize: '0.9rem' },
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Método de Pago"
              name="metodo_pago"
              value={venta.metodo_pago}
              onChange={handleChange}
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  '&:hover fieldset': { borderColor: '#3B8D99' },
                  '&.Mui-focused fieldset': { borderColor: '#2A7F62' },
                },
                '& .MuiInputLabel-root': { fontSize: '0.9rem' },
              }}
            />
            <DialogActions sx={{ mt: 2, justifyContent: 'flex-end' }}>
              <Button
                onClick={handleCloseDialog}
                sx={{
                  color: '#3B8D99',
                  fontSize: '0.9rem',
                  textTransform: 'none',
                  '&:hover': { color: '#2A7F62' },
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: '#3B8D99',
                  color: '#fff',
                  fontSize: '0.9rem',
                  px: 3,
                  py: 0.8,
                  borderRadius: 1.5,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: '#2A7F62',
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                }}
                disabled={!isFormValid()}
              >
                Actualizar
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Sales Table */}
      <TableContainer
        component={Paper}
        sx={{
          mt: 3,
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          maxHeight: '70vh',
          overflowX: 'auto',
        }}
      >
        <Table
          sx={{
            minWidth: { xs: 600, sm: 650 },
            '& .MuiTableCell-root': {
              fontSize: { xs: '0.8rem', sm: '0.9rem' },
              padding: { xs: '10px', sm: '14px' },
              color: '#333',
            },
          }}
          stickyHeader
        >
          <TableHead>
            <TableRow
              sx={{
                bgcolor: '#3B8D99',
                '& th': {
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: { xs: '0.85rem', sm: '0.95rem' },
                  py: 1.5,
                  px: 2,
                },
              }}
            >
              <TableCell>ID Producto</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Precio Unitario ($)</TableCell>
              <TableCell>Total ($)</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Método de Pago</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ventas.map((v) => (
              <TableRow
                key={v.id}
                sx={{
                  '&:hover': {
                    bgcolor: 'rgba(59, 141, 153, 0.05)',
                    transition: 'background-color 0.3s ease',
                  },
                }}
              >
                <TableCell>{v.id_producto}</TableCell>
                <TableCell>{v.cantidad}</TableCell>
                <TableCell>{parseFloat(v.precio_unitario).toFixed(2)}</TableCell>
                <TableCell>{parseFloat(v.total).toFixed(2)}</TableCell>
                <TableCell>{new Date(v.fecha).toLocaleDateString()}</TableCell>
                <TableCell>{v.metodo_pago}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => fetchVenta(v.id)}
                    sx={{
                      color: '#3B8D99',
                      '&:hover': { color: '#2A7F62', transform: 'scale(1.1)' },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() => deleteVenta(v.id)}
                    sx={{
                      color: '#d32f2f',
                      '&:hover': { color: '#b71c1c', transform: 'scale(1.1)' },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Ventas;
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
  IconButton,
  Typography,
  Box,
  Tooltip,
  Snackbar,
  Alert,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';

const CategoriasAdmin = () => {
  const [categorias, setCategorias] = useState([]);
  const [newCategoria, setNewCategoria] = useState('');
  const [editId, setEditId] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Obtener todas las categorías
  const fetchCategorias = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/categorias');
      setCategorias(response.data);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      setSnackbarMessage('Error al cargar las categorías');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Agregar una nueva categoría
  const handleCreateCategoria = async () => {
    if (!newCategoria.trim()) {
      setSnackbarMessage('Por favor, ingrese un nombre para la categoría.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/categorias', { nombre: newCategoria });
      setNewCategoria('');
      fetchCategorias();
      setSnackbarMessage('Categoría creada con éxito');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error al crear categoría:', error);
      setSnackbarMessage('Error al crear la categoría');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Actualizar una categoría
  const handleUpdateCategoria = async () => {
    if (!editNombre.trim()) {
      setSnackbarMessage('Por favor, ingrese un nombre para la categoría.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    try {
      await axios.put(`http://localhost:3001/api/categorias/${editId}`, { nombre: editNombre });
      setEditId(null);
      setEditNombre('');
      setOpen(false);
      fetchCategorias();
      setSnackbarMessage('Categoría actualizada con éxito');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      setSnackbarMessage('Error al actualizar la categoría');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Eliminar una categoría
  const handleDeleteCategoria = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/categorias/${id}`);
      fetchCategorias();
      setSnackbarMessage('Categoría eliminada con éxito');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      setSnackbarMessage('Error al eliminar la categoría');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Abrir diálogo de edición
  const handleClickOpen = (categoria) => {
    setEditId(categoria.id);
    setEditNombre(categoria.nombre);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditId(null);
    setEditNombre('');
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  return (
    <Container
      maxWidth="lg"
      sx={{
        padding: '40px 20px',
        background: 'linear-gradient(135deg, #f5f7fa 0%,)',
        minHeight: '100vh',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Formulario */}
      <Card
        sx={{
          backgroundColor: '#ffffff',
          padding: '30px',
          borderRadius: '20px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          marginBottom: '40px',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
          },
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: '700',
              color: '#0277bd',
              textAlign: 'center',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            Gestión de Categorías
          </Typography>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={8}>
              <TextField
                label="Nombre de la categoría"
                value={newCategoria}
                onChange={(e) => setNewCategoria(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{
                  backgroundColor: '#f9faff',
                  borderRadius: '12px',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#b3e5fc' },
                    '&:hover fieldset': { borderColor: '#0288d1' },
                    '&.Mui-focused fieldset': { borderColor: '#0277bd' },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateCategoria}
                startIcon={<Add />}
                fullWidth
                sx={{
                  padding: '12px',
                  fontWeight: '600',
                  borderRadius: '12px',
                  backgroundColor: '#0288d1',
                  '&:hover': {
                    backgroundColor: '#0277bd',
                    transform: 'scale(1.05)',
                    boxShadow: '0 6px 16px rgba(2, 136, 209, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Agregar
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card
        sx={{
          borderRadius: '20px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
        }}
      >
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                {['ID', 'Nombre', 'Acciones'].map((header) => (
                  <TableCell
                    key={header}
                    sx={{
                      fontWeight: '700',
                      backgroundColor: '#0288d1',
                      color: '#fff',
                      textAlign: 'center',
                      padding: '16px',
                      fontSize: '1.1rem',
                      borderBottom: '2px solid #0277bd',
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {categorias.length > 0 ? (
                categorias.map((item) => (
                  <TableRow
                    key={item.id}
                    sx={{
                      '&:hover': { backgroundColor: '#e1f5fe' },
                      transition: 'background-color 0.3s ease',
                    }}
                  >
                    <TableCell sx={{ textAlign: 'center', fontSize: '1rem', color: '#424242' }}>
                      {item.id}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center', fontSize: '1rem', color: '#424242' }}>
                      {item.nombre}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Tooltip title="Editar">
                        <IconButton
                          onClick={() => handleClickOpen(item)}
                          sx={{
                            color: '#0288d1',
                            '&:hover': { color: '#0277bd', backgroundColor: '#b3e5fc' },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          onClick={() => handleDeleteCategoria(item.id)}
                          sx={{
                            color: '#d32f2f',
                            '&:hover': { color: '#b71c1c', backgroundColor: '#ffcdd2' },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} sx={{ textAlign: 'center', padding: '20px', color: '#757575' }}>
                    No hay categorías disponibles
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Diálogo de edición */}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: '20px',
            padding: '20px',
            backgroundColor: '#fafafa',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: '700', color: '#0277bd', textAlign: 'center' }}>
          Editar Categoría
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre de la categoría"
            value={editNombre}
            onChange={(e) => setEditNombre(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              mt: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#b3e5fc' },
                '&:hover fieldset': { borderColor: '#0288d1' },
                '&.Mui-focused fieldset': { borderColor: '#0277bd' },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', paddingBottom: '20px' }}>
          <Button
            onClick={handleClose}
            sx={{
              color: '#757575',
              fontWeight: '600',
              padding: '8px 20px',
              borderRadius: '12px',
              '&:hover': { backgroundColor: '#e0e0e0' },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleUpdateCategoria}
            variant="contained"
            color="primary"
            sx={{
              fontWeight: '600',
              borderRadius: '12px',
              padding: '8px 20px',
              backgroundColor: '#0288d1',
              '&:hover': {
                backgroundColor: '#0277bd',
                transform: 'scale(1.05)',
                boxShadow: '0 6px 16px rgba(2, 136, 209, 0.4)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{
            backgroundColor:
              snackbarSeverity === 'success'
                ? '#388e3c'
                : snackbarSeverity === 'error'
                ? '#d32f2f'
                : '#ff9800',
            color: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            padding: '10px 20px',
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CategoriasAdmin;
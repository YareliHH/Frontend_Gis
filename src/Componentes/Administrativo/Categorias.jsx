import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [newCategoria, setNewCategoria] = useState('');
  const [newDescripcion, setNewDescripcion] = useState('');
  const [editId, setEditId] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [editDescripcion, setEditDescripcion] = useState('');
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Obtener categorías desde la base de datos
  const fetchCategorias = async () => {
    try {
      const response = await axios.get('https://backend-gis-1.onrender.com/api/categorias/obtenercat');
      setCategorias(response.data);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  // Insertar una nueva categoría en la base de datos
  const handleCreateCategoria = async () => {
    if (newCategoria.trim() === '' || newDescripcion.trim() === '') {
      setSnackbarSeverity('error');
      setSnackbarMessage('Nombre y descripción son requeridos');
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await axios.post('https://backend-gis-1.onrender.com/api/categorias/insertarcat', {
        nombre: newCategoria,
        descripcion: newDescripcion,
      });

      setCategorias([...categorias, response.data]);
      setNewCategoria('');
      setNewDescripcion('');
      setSnackbarSeverity('success');
      setSnackbarMessage('Categoría agregada correctamente');
      setSnackbarOpen(true);
      fetchCategorias();
    } catch (error) {
      console.error('Error al agregar categoría:', error);
    }
  };

  // Abrir modal de edición
  const handleClickOpen = (categoria) => {
    setEditId(categoria.id_categoria);
    setEditNombre(categoria.nombre);
    setEditDescripcion(categoria.descripcion);
    setOpen(true);
  };

  // Cerrar modal de edición
  const handleClose = () => {
    setOpen(false);
  };

  // Abrir modal de eliminación
  const handleDeleteClickOpen = (id) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  // Cerrar modal de eliminación
  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

// Actualizar una categoría
const handleUpdateCategoria = async () => {
  try {
    // Enviar la solicitud PUT para actualizar la categoría
    await axios.put(`https://backend-gis-1.onrender.com/api/categorias/editar/${editId}`, {
      nombre: editNombre,
      descripcion: editDescripcion,
    });

    // Actualizar la lista de categorías en el estado
    setCategorias((prevCategorias) =>
      prevCategorias.map((item) =>
        item.id_categoria === editId ? { ...item, nombre: editNombre, descripcion: editDescripcion } : item
      )
    );

    // Mostrar el mensaje de éxito
    setSnackbarSeverity('success');
    setSnackbarMessage('Categoría actualizada correctamente');
    setSnackbarOpen(true);

    // Cerrar el modal o formulario
    handleClose();
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    setSnackbarSeverity('error');
    setSnackbarMessage('Hubo un error al actualizar la categoría');
    setSnackbarOpen(true);
  }
};


  // Eliminar una categoría
const handleDeleteCategoria = async () => {
  try {
    // Enviar la solicitud DELETE para eliminar la categoría
    await axios.delete(`https://backend-gis-1.onrender.com/api/categorias/eliminar/${deleteId}`);

    // Actualizar la lista de categorías en el estado
    setCategorias((prevCategorias) => prevCategorias.filter((item) => item.id_categoria !== deleteId));

    // Mostrar el mensaje de éxito
    setSnackbarSeverity('success');
    setSnackbarMessage('Categoría eliminada correctamente');
    setSnackbarOpen(true);

    // Cerrar el modal o formulario de eliminación
    handleDeleteClose();
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    setSnackbarSeverity('error');
    setSnackbarMessage('Hubo un error al eliminar la categoría');
    setSnackbarOpen(true);
  }
};


  // Cerrar Snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ padding: '40px 20px', minHeight: '100vh', backgroundColor: '#f0f4f8' }}>
      <Card sx={{ padding: '30px', marginBottom: '40px', borderRadius: '16px', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
        <CardContent>
          <Typography variant="h4" gutterBottom align="center" sx={{ color: '#0277bd', fontWeight: '700' }}>
            Gestión de Categorías
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombre de la categoría"
                value={newCategoria}
                onChange={(e) => setNewCategoria(e.target.value)}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#3f51b5' },
                    '&:hover fieldset': { borderColor: '#303f9f' },
                    '&.Mui-focused fieldset': { borderColor: '#1a237e' },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Descripción"
                value={newDescripcion}
                onChange={(e) => setNewDescripcion(e.target.value)}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#3f51b5' },
                    '&:hover fieldset': { borderColor: '#303f9f' },
                    '&.Mui-focused fieldset': { borderColor: '#1a237e' },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateCategoria}
                startIcon={<Add />}
                sx={{
                  backgroundColor: '#0277bd',
                  '&:hover': { backgroundColor: '#0277bd' },
                  fontWeight: '600',
                  borderRadius: '12px',
                  padding: '10px 24px',
                }}
              >
                Agregar
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: '16px', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#0277bd' }}>
                <TableCell sx={{ color: '#ffffff', fontWeight: '700' }}>Id</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: '700' }}>Nombre</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: '700' }}>Descripción</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: '700' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categorias.length > 0 ? (
                categorias.map((item) => (
                  <TableRow key={item.id_categoria} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' } }}>
                    <TableCell>{item.id_categoria}</TableCell>
                    <TableCell>{item.nombre}</TableCell>
                    <TableCell>{item.descripcion}</TableCell>
                    <TableCell>
                      <Tooltip title="Editar">
                        <IconButton onClick={() => handleClickOpen(item)}>
                          <Edit sx={{ color: '#3f51b5' }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton onClick={() => handleDeleteClickOpen(item.id_categoria)}>
                          <Delete sx={{ color: '#d32f2f' }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
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
          sx: { borderRadius: '16px', padding: '20px', backgroundColor: '#fafafa' },
        }}
      >
        <DialogTitle sx={{ fontWeight: '700', color: '#1a237e', textAlign: 'center' }}>
          Actualizar
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre de la categoría"
            type="text"
            fullWidth
            value={editNombre}
            onChange={(e) => setEditNombre(e.target.value)}
            sx={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#c4c4c4' },
                '&:hover fieldset': { borderColor: '#3f51b5' },
                '&.Mui-focused fieldset': { borderColor: '#3f51b5' },
              },
            }}
          />
          <TextField
            margin="dense"
            label="Descripción de la categoría"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={editDescripcion}
            onChange={(e) => setEditDescripcion(e.target.value)}
            sx={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#c4c4c4' },
                '&:hover fieldset': { borderColor: '#3f51b5' },
                '&.Mui-focused fieldset': { borderColor: '#3f51b5' },
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
              backgroundColor: '#3f51b5',
              '&:hover': { backgroundColor: '#303f9f' },
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de eliminación */}
      <Dialog
        open={deleteOpen}
        onClose={handleDeleteClose}
        PaperProps={{
          sx: { borderRadius: '16px', padding: '20px', backgroundColor: '#fafafa' },
        }}
      >
        <DialogTitle sx={{ fontWeight: '700', color: '#1a237e', textAlign: 'center' }}>
          ¿Eliminar categoría?
        </DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar esta categoría? 
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', paddingBottom: '20px' }}>
          <Button
            onClick={handleDeleteClose}
            sx={{
              color: '#757575',
              fontWeight: '600',
              '&:hover': { backgroundColor: '#e0e0e0' },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteCategoria}
            variant="contained"
            color="error"
            sx={{
              fontWeight: '600',
              borderRadius: '12px',
              padding: '8px 20px',
              backgroundColor: '#d32f2f',
              '&:hover': { backgroundColor: '#b71c1c' },
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert severity={snackbarSeverity} onClose={handleSnackbarClose} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Categorias;
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

const Generos = () => {
  const [generos, setGeneros] = useState([]);
  const [newGenero, setNewGenero] = useState('');
  const [editId, setEditId] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Obtener géneros desde la base de datos
  const fetchGeneros = async () => {
    try {
      const response = await axios.get('https://backend-gis-1.onrender.com/api/generos');
      setGeneros(response.data);
    } catch (error) {
      console.error('Error al obtener géneros:', error);
    }
  };

  useEffect(() => {
    fetchGeneros();
  }, []);

  // Insertar un nuevo género en la base de datos
  const handleCreateGenero = async () => {
    if (newGenero.trim() === '') {
      setSnackbarSeverity('error');
      setSnackbarMessage('El nombre del género es requerido');
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await axios.post('https://backend-gis-1.onrender.com/api/agregargenero', {
        genero: newGenero,
      });

      setGeneros([...generos, response.data]);
      setNewGenero('');
      setSnackbarSeverity('success');
      setSnackbarMessage('Género agregado correctamente');
      setSnackbarOpen(true);
      fetchGeneros();
    } catch (error) {
      console.error('Error al agregar género:', error);
    }
  };

  // Abrir modal de edición
  const handleClickOpen = (genero) => {
    setEditId(genero.id);
    setEditNombre(genero.genero);
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

  // Actualizar un género
  const handleUpdateGenero = async () => {
    try {
      await axios.put(`https://backend-gis-1.onrender.com/api/editargenero/${editId}`, {
        genero: editNombre,
      });

      setGeneros((prevGeneros) =>
        prevGeneros.map((item) =>
          item.id === editId ? { ...item, genero: editNombre } : item
        )
      );

      setSnackbarSeverity('success');
      setSnackbarMessage('Género actualizado correctamente');
      setSnackbarOpen(true);

      handleClose();
    } catch (error) {
      console.error('Error al actualizar género:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage('Hubo un error al actualizar el género');
      setSnackbarOpen(true);
    }
  };

  // Eliminar un género
  const handleDeleteGenero = async () => {
    try {
      await axios.delete(`https://backend-gis-1.onrender.com/api/eliminargenero/${deleteId}`);

      setGeneros((prevGeneros) => prevGeneros.filter((item) => item.id !== deleteId));

      setSnackbarSeverity('success');
      setSnackbarMessage('Género eliminado correctamente');
      setSnackbarOpen(true);

      handleDeleteClose();
    } catch (error) {
      console.error('Error al eliminar género:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage('Hubo un error al eliminar el género');
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
            Gestión de Géneros
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombre del género"
                value={newGenero}
                onChange={(e) => setNewGenero(e.target.value)}
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
                onClick={handleCreateGenero}
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
                <TableCell sx={{ color: '#ffffff', fontWeight: '700' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {generos.length > 0 ? (
                generos.map((item) => (
                  <TableRow key={item.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' } }}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.genero}</TableCell>
                    <TableCell>
                      <Tooltip title="Editar">
                        <IconButton onClick={() => handleClickOpen(item)}>
                          <Edit sx={{ color: '#3f51b5' }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton onClick={() => handleDeleteClickOpen(item.id)}>
                          <Delete sx={{ color: '#d32f2f' }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No hay géneros disponibles
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
            label="Nombre del género"
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
            onClick={handleUpdateGenero}
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
          ¿Eliminar género?
        </DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar este género? 
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
            onClick={handleDeleteGenero}
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

export default Generos;
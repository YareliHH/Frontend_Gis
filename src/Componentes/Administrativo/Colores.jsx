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

const Colores = () => {
  const [colores, setColores] = useState([]);
  const [newColor, setNewColor] = useState('');
  const [editId, setEditId] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Obtener colores desde la base de datos
  const fetchColores = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/colores');
      setColores(response.data);
    } catch (error) {
      console.error('Error al obtener colores:', error);
    }
  };

  useEffect(() => {
    fetchColores();
  }, []);

  // Insertar un nuevo color en la base de datos
  const handleCreateColor = async () => {
    if (newColor.trim() === '') {
      setSnackbarSeverity('error');
      setSnackbarMessage('El nombre del color es requerido');
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/agregarcolor', {
        color: newColor,
      });

      setColores([...colores, response.data]);
      setNewColor('');
      setSnackbarSeverity('success');
      setSnackbarMessage('Color agregado correctamente');
      setSnackbarOpen(true);
      fetchColores();
    } catch (error) {
      console.error('Error al agregar color:', error);
    }
  };

  // Abrir modal de edición
  const handleClickOpen = (color) => {
    setEditId(color.id);
    setEditNombre(color.color);
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

  // Actualizar un color
  const handleUpdateColor = async () => {
    try {
      await axios.put(`http://localhost:3001/api/editarcolor/${editId}`, {
        color: editNombre,
      });

      setColores((prevColores) =>
        prevColores.map((item) =>
          item.id === editId ? { ...item, color: editNombre } : item
        )
      );

      setSnackbarSeverity('success');
      setSnackbarMessage('Color actualizado correctamente');
      setSnackbarOpen(true);

      handleClose();
    } catch (error) {
      console.error('Error al actualizar color:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage('Hubo un error al actualizar el color');
      setSnackbarOpen(true);
    }
  };

  // Eliminar un color
  const handleDeleteColor = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/eliminarcolor/${deleteId}`);

      setColores((prevColores) => prevColores.filter((item) => item.id !== deleteId));

      setSnackbarSeverity('success');
      setSnackbarMessage('Color eliminado correctamente');
      setSnackbarOpen(true);

      handleDeleteClose();
    } catch (error) {
      console.error('Error al eliminar color:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage('Hubo un error al eliminar el color');
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
            Gestión de Colores
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombre del color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
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
                onClick={handleCreateColor}
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
              {colores.length > 0 ? (
                colores.map((item) => (
                  <TableRow key={item.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' } }}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.color}</TableCell>
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
                    No hay colores disponibles
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
            label="Nombre del color"
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
            onClick={handleUpdateColor}
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
          ¿Eliminar color?
        </DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar este color? 
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
            onClick={handleDeleteColor}
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

export default Colores;
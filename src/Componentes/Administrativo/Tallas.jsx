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

const Tallas = () => {
  const [tallas, setTallas] = useState([]);
  const [newTalla, setNewTalla] = useState('');
  const [editId, setEditId] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Obtener tallas desde la base de datos
  const fetchTallas = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/tallas');
      setTallas(response.data);
    } catch (error) {
      console.error('Error al obtener tallas:', error);
    }
  };

  useEffect(() => {
    fetchTallas();
  }, []);

  // Insertar una nueva talla en la base de datos
  const handleCreateTalla = async () => {
    if (newTalla.trim() === '') {
      setSnackbarSeverity('error');
      setSnackbarMessage('El nombre de la talla es requerido');
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/agregartalla', {
        talla: newTalla,
      });

      setTallas([...tallas, response.data]);
      setNewTalla('');
      setSnackbarSeverity('success');
      setSnackbarMessage('Talla agregada correctamente');
      setSnackbarOpen(true);
      fetchTallas();
    } catch (error) {
      console.error('Error al agregar talla:', error);
    }
  };

  // Abrir modal de edición
  const handleClickOpen = (talla) => {
    setEditId(talla.id);
    setEditNombre(talla.talla);
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

  // Actualizar una talla
  const handleUpdateTalla = async () => {
    try {
      await axios.put(`http://localhost:3001/api/editartalla/${editId}`, {
        talla: editNombre,
      });

      setTallas((prevTallas) =>
        prevTallas.map((item) =>
          item.id === editId ? { ...item, talla: editNombre } : item
        )
      );

      setSnackbarSeverity('success');
      setSnackbarMessage('Talla actualizada correctamente');
      setSnackbarOpen(true);

      handleClose();
    } catch (error) {
      console.error('Error al actualizar talla:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage('Hubo un error al actualizar la talla');
      setSnackbarOpen(true);
    }
  };

  // Eliminar una talla
  const handleDeleteTalla = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/eliminartalla/${deleteId}`);

      setTallas((prevTallas) => prevTallas.filter((item) => item.id !== deleteId));

      setSnackbarSeverity('success');
      setSnackbarMessage('Talla eliminada correctamente');
      setSnackbarOpen(true);

      handleDeleteClose();
    } catch (error) {
      console.error('Error al eliminar talla:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage('Hubo un error al eliminar la talla');
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
            Gestión de Tallas
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombre de la talla"
                value={newTalla}
                onChange={(e) => setNewTalla(e.target.value)}
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
                onClick={handleCreateTalla}
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
              {tallas.length > 0 ? (
                tallas.map((item) => (
                  <TableRow key={item.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' } }}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.talla}</TableCell>
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
                    No hay tallas disponibles
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
            label="Nombre de la talla"
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
            onClick={handleUpdateTalla}
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
          ¿Eliminar talla?
        </DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar esta talla? 
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
            onClick={handleDeleteTalla}
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

export default Tallas;
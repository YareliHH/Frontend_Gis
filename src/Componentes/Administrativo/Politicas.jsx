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
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const Politicas = () => {
  const [politicas, setPoliticas] = useState([]);
  const [newTitulo, setNewTitulo] = useState('');
  const [newContenido, setNewContenido] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitulo, setEditTitulo] = useState('');
  const [editContenido, setEditContenido] = useState('');
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Para manejar éxito o error

  // Obtener todas las políticas
  const fetchPoliticas = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/getpolitica');
      setPoliticas(response.data);
    } catch (error) {
      console.error('Error al obtener las políticas:', error.response ? error.response.data : error.message);
      setSnackbarMessage('Error al cargar las políticas');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Crear una nueva política
  const handleCreatePolitica = async () => {
    if (!newTitulo.trim() || !newContenido.trim()) {
      setSnackbarMessage('Por favor, complete todos los campos.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    try {
      await axios.post('http://localhost:3001/api/politica', {
        titulo: newTitulo,
        contenido: newContenido,
      });
      setNewTitulo('');
      setNewContenido('');
      fetchPoliticas();
      setSnackbarMessage('Política creada con éxito');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error al crear la política:', error);
      setSnackbarMessage('Error al crear la política');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Actualizar una política
  const handleUpdatePolitica = async () => {
    if (!editTitulo.trim() || !editContenido.trim()) {
      setSnackbarMessage('Por favor, complete todos los campos.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    try {
      await axios.put(`http://localhost:3001/api/updatepolitica/${editId}`, {
        titulo: editTitulo,
        contenido: editContenido,
      });
      setEditId(null);
      setEditTitulo('');
      setEditContenido('');
      setOpen(false);
      fetchPoliticas();
      setSnackbarMessage('Política actualizada con éxito');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error al actualizar la política:', error);
      setSnackbarMessage('Error al actualizar la política');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Eliminar política (lógicamente)
  const handleDeletePolitica = async (id) => {
    try {
      await axios.put(`http://localhost:3001/api/deactivatepolitica/${id}`);
      fetchPoliticas();
      setSnackbarMessage('Política desactivada con éxito');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error al desactivar la política:', error);
      setSnackbarMessage('Error al desactivar la política');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Manejar el diálogo de edición
  const handleClickOpen = (politica) => {
    setEditId(politica.id);
    setEditTitulo(politica.titulo);
    setEditContenido(politica.contenido);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditId(null);
    setEditTitulo('');
    setEditContenido('');
  };

  // Cerrar el Snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    fetchPoliticas();
  }, []);

  return (
    <Container
      maxWidth="lg"
      sx={{
        padding: '40px 20px',
        background: 'linear-gradient(135deg, #f5f7fa 0%,)',
        minHeight: '100vh',
      }}
    >
      {/* Formulario */}
      <Box
        sx={{
          backgroundColor: '#ffffff',
          padding: '30px',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
          marginBottom: '40px',
          transition: 'transform 0.3s ease',
          '&:hover': { transform: 'translateY(-5px)' },
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: '700',
            color: '#00050a',
            textAlign: 'center',
            letterSpacing: '1px',
          }}
        >
          Gestión de Políticas
        </Typography>
        <TextField
          label="Título de la nueva política"
          variant="outlined"
          value={newTitulo}
          onChange={(e) => setNewTitulo(e.target.value)}
          fullWidth
          margin="normal"
          sx={{
            backgroundColor: '#fafafa',
            borderRadius: '8px',
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#c4c4c4' },
              '&:hover fieldset': { borderColor: '#1976d2' },
              '&.Mui-focused fieldset': { borderColor: '#1976d2' },
            },
          }}
        />
        <TextField
          label="Contenido de la nueva política"
          variant="outlined"
          value={newContenido}
          onChange={(e) => setNewContenido(e.target.value)}
          fullWidth
          multiline
          rows={4}
          margin="normal"
          sx={{
            backgroundColor: '#fafafa',
            borderRadius: '8px',
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#c4c4c4' },
              '&:hover fieldset': { borderColor: '#1976d2' },
              '&.Mui-focused fieldset': { borderColor: '#1976d2' },
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreatePolitica}
          sx={{
            marginTop: '20px',
            padding: '12px 30px',
            fontWeight: '600',
            borderRadius: '12px',
            backgroundColor: '#1976d2',
            textTransform: 'none',
            '&:hover': { backgroundColor: '#1565c0', transform: 'scale(1.05)' },
            transition: 'all 0.3s ease',
          }}
        >
          Agregar Política
        </Button>
      </Box>

      {/* Tabla */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              {['Título', 'Contenido', 'Versión', 'Estado', 'Fecha de Creación', 'Acciones'].map((header) => (
                <TableCell
                  key={header}
                  sx={{
                    fontWeight: '700',
                    backgroundColor: '#1976d2',
                    color: '#fff',
                    textAlign: 'center',
                    padding: '16px',
                    fontSize: '1.1rem',
                    letterSpacing: '0.5px',
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {politicas.length > 0 ? (
              politicas.map((item) => (
                <TableRow
                  key={item.id}
                  sx={{
                    '&:hover': { backgroundColor: '#f5f7fa' },
                    transition: 'background-color 0.3s ease',
                  }}
                >
                  <TableCell sx={{ textAlign: 'center', padding: '18px', fontSize: '1rem' }}>
                    {item.titulo}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', padding: '18px' }}>
                    <Typography
                      variant="body2"
                      sx={{ maxWidth: '300px', wordWrap: 'break-word', color: '#424242' }}
                    >
                      {item.contenido}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', padding: '18px', fontSize: '1rem' }}>
                    {item.version || '1.0'} {/* Valor por defecto si no hay versión */}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', padding: '18px' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: '600',
                        color: item.estado === 'Activo' ? '#388e3c' : '#d32f2f',
                        backgroundColor: item.estado === 'Activo' ? '#e8f5e9' : '#ffebee',
                        borderRadius: '20px',
                        padding: '6px 14px',
                        display: 'inline-block',
                      }}
                    >
                      {item.estado || 'Activo'} {/* Valor por defecto si no hay estado */}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', padding: '18px', fontSize: '1rem' }}>
                    {new Date(item.fecha_creacion).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', padding: '18px' }}>
                    <Tooltip title="Editar">
                      <IconButton
                        onClick={() => handleClickOpen(item)}
                        sx={{
                          color: '#3f51b5',
                          '&:hover': { color: '#303f9f', backgroundColor: '#e8eaf6' },
                        }}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Desactivar">
                      <IconButton
                        onClick={() => handleDeletePolitica(item.id)}
                        sx={{
                          color: '#d32f2f',
                          '&:hover': { color: '#b71c1c', backgroundColor: '#ffebee' },
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
                <TableCell colSpan={6} sx={{ textAlign: 'center', padding: '20px', color: '#757575' }}>
                  No hay políticas disponibles
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo de edición */}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { borderRadius: '16px', padding: '20px', backgroundColor: '#fafafa' },
        }}
      >
        <DialogTitle sx={{ fontWeight: '700', color: '#1a237e', textAlign: 'center' }}>
          Editar Política
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Título de la política"
            type="text"
            fullWidth
            value={editTitulo}
            onChange={(e) => setEditTitulo(e.target.value)}
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
            label="Contenido de la política"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={editContenido}
            onChange={(e) => setEditContenido(e.target.value)}
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
            onClick={handleUpdatePolitica}
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
            backgroundColor: snackbarSeverity === 'success' ? '#388e3c' : '#d32f2f',
            color: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Politicas;
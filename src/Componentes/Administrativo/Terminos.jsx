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
import { Edit, Delete, Visibility } from '@mui/icons-material';

const TerminosYCondiciones = () => {
  const [terminos, setTerminos] = useState([]);
  const [newTitulo, setNewTitulo] = useState('');
  const [newContenido, setNewContenido] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitulo, setEditTitulo] = useState('');
  const [editContenido, setEditContenido] = useState('');
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [viewOpen, setViewOpen] = useState(false); // For view dialog
  const [viewTermino, setViewTermino] = useState(null); // Store selected término for viewing

  const fetchTerminos = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/getterminos');
      setTerminos(response.data);
    } catch (error) {
      console.error('Error al obtener los términos y condiciones', error);
    }
  };

  // Crear un nuevo término
  const handleCreateTermino = async () => {
    if (!newTitulo.trim() || !newContenido.trim()) {
      setSnackbarMessage('Por favor, complete todos los campos.');
      setSnackbarOpen(true);
      return;
    }
    try {
      await axios.post('http://localhost:3001/api/terminos', {
        titulo: newTitulo,
        contenido: newContenido,
      });
      setNewTitulo('');
      setNewContenido('');
      fetchTerminos();
      setSnackbarMessage('Término creado con éxito');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error al crear el término', error);
    }
  };

  // Actualizar un término
  const handleUpdateTermino = async () => {
    if (!editTitulo.trim() || !editContenido.trim()) {
      setSnackbarMessage('Por favor, complete todos los campos.');
      setSnackbarOpen(true);
      return;
    }
    try {
      await axios.put(`http://localhost:3001/api/updatetermino/${editId}`, {
        titulo: editTitulo,
        contenido: editContenido,
      });
      setEditId(null);
      setEditTitulo('');
      setEditContenido('');
      setOpen(false);
      fetchTerminos();
      setSnackbarMessage('Término actualizado con éxito');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error al actualizar el término', error);
    }
  };

  // Eliminar un término (lógicamente)
  const handleDeleteTermino = async (id) => {
    try {
      await axios.put(`http://localhost:3001/api/deactivatetermino/${id}`);
      fetchTerminos();
      setSnackbarMessage('Término eliminado con éxito');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error al eliminar el término', error);
    }
  };

  // Manejar el diálogo de edición
  const handleClickOpen = (termino) => {
    setEditId(termino.id);
    setEditTitulo(termino.titulo);
    setEditContenido(termino.contenido);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditId(null);
    setEditTitulo('');
    setEditContenido('');
  };

  // Manejar el diálogo de visualización
  const handleViewOpen = (termino) => {
    setViewTermino(termino);
    setViewOpen(true);
  };

  const handleViewClose = () => {
    setViewOpen(false);
    setViewTermino(null);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  useEffect(() => {
    fetchTerminos();
  }, []);

  return (
    <Container
      maxWidth="lg"
      sx={{
        padding: '40px 20px',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e0e7ff 100%)',
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
          Gestión de Términos y Condiciones
        </Typography>
        <TextField
          label="Título del nuevo término"
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
          label="Contenido del nuevo término"
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
          onClick={handleCreateTermino}
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
          Agregar Término
        </Button>
      </Box>

      {/* Tabla Mejorada */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              {['Título', 'Contenido', 'Versión', 'Estado', 'Fecha de Creación', 'Acciones'].map(
                (header) => (
                  <TableCell
    key={header}
                      sx={{
                        fontWeight: '700',
                        backgroundColor: '#4585f5', // Dark blue header
                        color: '#fff',
                        textAlign: 'center',
                        padding: '16px',
                        fontSize: '1.1rem',
                        letterSpacing: '0.5px',
                        borderBottom: '2px solid #1e40af',
                      }}
                    >
                      {header}
                    </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {terminos.length > 0 ? (
              terminos.map((item) => (
                <TableRow
                  key={item.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#f9fafb',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                    },
                    transition: 'all 0.2s ease',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  <TableCell
                    sx={{
                      textAlign: 'center',
                      padding: '20px',
                      fontSize: '1rem',
                      fontWeight: '500',
                      color: '#1f2937',
                      maxWidth: '200px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.titulo}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: 'left',
                      padding: '20px',
                      fontSize: '0.95rem',
                      color: '#4b5563',
                      maxWidth: '450px',
                      wordWrap: 'break-word',
                    }}
                  >
                    <Tooltip title={item.contenido} placement="top-start">
                      <Typography
                        variant="body2"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.contenido}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: 'center',
                      padding: '20px',
                      fontSize: '1rem',
                      color: '#6b7280',
                    }}
                  >
                    {item.version}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', padding: '20px' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: '600',
                        color: item.estado === 'Activo' ? '#166534' : '#991b1b',
                        backgroundColor: item.estado === 'Activo' ? '#dcfce7' : '#fee2e2',
                        borderRadius: '16px',
                        padding: '6px 12px',
                        display: 'inline-block',
                        fontSize: '0.85rem',
                      }}
                    >
                      {item.estado}
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: 'center',
                      padding: '20px',
                      fontSize: '1rem',
                      color: '#6b7280',
                    }}
                  >
                    {new Date(item.fecha_creacion).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', padding: '20px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5 }}>
                      <Tooltip title="Visualizar">
                        <IconButton
                          onClick={() => handleViewOpen(item)}
                          sx={{
                            color: '#1e40af',
                            backgroundColor: '#eff6ff',
                            borderRadius: '8px',
                            padding: '8px',
                            '&:hover': {
                              color: '#1e3a8a',
                              backgroundColor: '#dbeafe',
                            },
                          }}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton
                          onClick={() => handleClickOpen(item)}
                          sx={{
                            color: '#3f51b5',
                            backgroundColor: '#eef2ff',
                            borderRadius: '8px',
                            padding: '8px',
                            '&:hover': {
                              color: '#303f9f',
                              backgroundColor: '#e0e7ff',
                            },
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          onClick={() => handleDeleteTermino(item.id)}
                          sx={{
                            color: '#dc2626',
                            backgroundColor: '#fef2f2',
                            borderRadius: '8px',
                            padding: '8px',
                            '&:hover': {
                              color: '#b91c1c',
                              backgroundColor: '#fee2e2',
                            },
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  sx={{
                    textAlign: 'center',
                    padding: '40px',
                    color: '#6b7280',
                    fontSize: '1.2rem',
                    fontStyle: 'italic',
                  }}
                >
                  No hay términos disponibles
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
          Editar Término
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Título del término"
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
            label="Contenido del término"
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
            onClick={handleUpdateTermino}
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

      {/* Diálogo de visualización */}
      <Dialog
        open={viewOpen}
        onClose={handleViewClose}
        PaperProps={{
          sx: { borderRadius: '16px', padding: '20px', backgroundColor: '#fafafa' },
        }}
      >
        <DialogTitle sx={{ fontWeight: '700', color: '#1a237e', textAlign: 'center' }}>
          Visualizar Término
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ fontWeight: '600', color: '#1a237e', mb: 2 }}>
            {viewTermino?.titulo}
          </Typography>
          <Typography variant="body1" sx={{ color: '#424242', whiteSpace: 'pre-wrap', mb: 2 }}>
            {viewTermino?.contenido}
          </Typography>
          <Box>
            <Typography variant="body2" sx={{ color: '#616161' }}>
              <strong>Versión:</strong> {viewTermino?.version}
            </Typography>
            <Typography variant="body2" sx={{ color: '#616161' }}>
              <strong>Estado:</strong> {viewTermino?.estado}
            </Typography>
            <Typography variant="body2" sx={{ color: '#616161' }}>
              <strong>Fecha de Creación:</strong>{' '}
              {viewTermino &&
                new Date(viewTermino.fecha_creacion).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', paddingBottom: '20px' }}>
          <Button
            onClick={handleViewClose}
            variant="contained"
            sx={{
              fontWeight: '600',
              borderRadius: '12px',
              padding: '8px 20px',
              backgroundColor: '#1e40af',
              '&:hover': { backgroundColor: '#1e3a8a' },
            }}
          >
            Cerrar
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
          severity="success"
          sx={{
            backgroundColor: '#388e3c',
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

export default TerminosYCondiciones;
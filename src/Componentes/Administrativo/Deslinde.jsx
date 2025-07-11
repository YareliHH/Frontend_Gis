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

const Deslindes = () => {
  const [deslindes, setDeslindes] = useState([]);
  const [newTitulo, setNewTitulo] = useState('');
  const [newContenido, setNewContenido] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitulo, setEditTitulo] = useState('');
  const [editContenido, setEditContenido] = useState('');
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [viewOpen, setViewOpen] = useState(false); // For view dialog
  const [viewDeslinde, setViewDeslinde] = useState(null); // Store selected deslinde for viewing

  // Obtener todos los deslindes
  const fetchDeslindes = async () => {
    try {
      const response = await axios.get('https://backend-gis-1.onrender.com/api/getdeslinde');
      setDeslindes(response.data);
    } catch (error) {
      console.error('Error al obtener los deslindes:', error.response ? error.response.data : error.message);
    }
  };

  // Crear un nuevo deslinde
  const handleCreateDeslinde = async () => {
    if (!newTitulo.trim() || !newContenido.trim()) {
      setSnackbarMessage('Por favor, complete todos los campos.');
      setSnackbarOpen(true);
      return;
    }
    try {
      await axios.post('https://backend-gis-1.onrender.com/api/deslinde', {
        titulo: newTitulo,
        contenido: newContenido,
      });
      setNewTitulo('');
      setNewContenido('');
      fetchDeslindes();
      setSnackbarMessage('Política creada con éxito');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error al crear el deslinde', error);
    }
  };

  // Actualizar un deslinde
  const handleUpdateDeslinde = async () => {
    if (!editTitulo.trim() || !editContenido.trim()) {
      setSnackbarMessage('Por favor, complete todos los campos.');
      setSnackbarOpen(true);
      return;
    }
    try {
      await axios.put(`https://backend-gis-1.onrender.com/api/updatedeslinde/${editId}`, {
        titulo: editTitulo,
        contenido: editContenido,
      });
      setEditId(null);
      setEditTitulo('');
      setEditContenido('');
      setOpen(false);
      fetchDeslindes();
      setSnackbarMessage('Política actualizada con éxito');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error al actualizar el deslinde', error);
    }
  };

  // Eliminar un deslinde (lógicamente)
  const handleDeleteDeslinde = async (id) => {
    try {
      await axios.put(`https://backend-gis-1.onrender.com/api/deactivatedeslinde/${id}`);
      fetchDeslindes();
      setSnackbarMessage('Deslinde eliminado con éxito');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error al eliminar el deslinde', error);
    }
  };

  // Manejar el diálogo de edición
  const handleClickOpen = (deslinde) => {
    setEditId(deslinde.id);
    setEditTitulo(deslinde.titulo);
    setEditContenido(deslinde.contenido);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditTitulo('');
    setEditContenido('');
    setEditId(null);
  };

  // Manejar el diálogo de visualización
  const handleViewOpen = (deslinde) => {
    setViewDeslinde(deslinde);
    setViewOpen(true);
  };

  const handleViewClose = () => {
    setViewOpen(false);
    setViewDeslinde(null);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  useEffect(() => {
    fetchDeslindes();
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
          Gestión de deslinde legal
        </Typography>
        <TextField
          label="Título del nuevo deslinde"
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
          label="Contenido del nuevo deslinde"
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
          onClick={handleCreateDeslinde}
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
          Agregar Deslinde
        </Button>
      </Box>

      {/* Tabla Mejorada */}
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
            {deslindes.length > 0 ? (
              deslindes.map((item) => (
                <TableRow
                  key={item.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#f0f4f8',
                      transform: 'scale(1.01)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <TableCell
                    sx={{
                      textAlign: 'center',
                      padding: '18px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#1e40af',
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
                      padding: '18px',
                      fontSize: '0.95rem',
                      color: '#424242',
                      maxWidth: '400px', // Wider for better content visibility
                      wordWrap: 'break-word',
                    }}
                  >
                    <Tooltip title={item.contenido} placement="top-start">
                      <Typography
                        variant="body2"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3, // Limits to 3 lines in table
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
                      padding: '18px',
                      fontSize: '1rem',
                      color: '#616161',
                    }}
                  >
                    {item.version}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', padding: '18px' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: '600',
                        color: item.estado === 'Activo' ? '#15803d' : '#b91c1c',
                        backgroundColor: item.estado === 'Activo' ? '#dcfce7' : '#fee2e2',
                        borderRadius: '20px',
                        padding: '6px 14px',
                        display: 'inline-block',
                        fontSize: '0.9rem',
                      }}
                    >
                      {item.estado}
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: 'center',
                      padding: '18px',
                      fontSize: '1rem',
                      color: '#616161',
                    }}
                  >
                    {new Date(item.fecha_creacion).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', padding: '18px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Tooltip title="Visualizar">
                        <IconButton
                          onClick={() => handleViewOpen(item)}
                          sx={{
                            color: '#1e40af',
                            '&:hover': {
                              color: '#1e3a8a',
                              backgroundColor: 'rgba(30, 64, 175, 0.1)',
                            },
                          }}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton
                          onClick={() => handleClickOpen(item)}
                          sx={{
                            color: '#3f51b5',
                            '&:hover': {
                              color: '#303f9f',
                              backgroundColor: 'rgba(63, 81, 181, 0.1)',
                            },
                          }}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          onClick={() => handleDeleteDeslinde(item.id)}
                          sx={{
                            color: '#dc2626',
                            '&:hover': {
                              color: '#b91c1c',
                              backgroundColor: 'rgba(220, 38, 38, 0.1)',
                            },
                          }}
                        >
                          <Delete />
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
                    color: '#757575',
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
          Editar deslinde
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Título del deslinde"
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
            label="Contenido del deslinde"
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
            onClick={handleUpdateDeslinde}
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
        PaperProps={{ sx: { borderRadius: '16px', padding: '20px', backgroundColor: '#fafafa' } }}
      >
        <DialogTitle sx={{ fontWeight: '700', color: '#1a237e', textAlign: 'center' }}>
          Visualizar deslinde
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ fontWeight: '600', color: '#1a237e', mb: 2 }}>
            {viewDeslinde?.titulo}
          </Typography>
          <Typography variant="body1" sx={{ color: '#424242', whiteSpace: 'pre-wrap', mb: 2 }}>
            {viewDeslinde?.contenido}
          </Typography>
          <Box>
            <Typography variant="body2" sx={{ color: '#616161' }}>
              <strong>Versión:</strong> {viewDeslinde?.version}
            </Typography>
            <Typography variant="body2" sx={{ color: '#616161' }}>
              <strong>Estado:</strong> {viewDeslinde?.estado}
            </Typography>
            <Typography variant="body2" sx={{ color: '#616161' }}>
              <strong>Fecha de Creación:</strong>{' '}
              {viewDeslinde &&
                new Date(viewDeslinde.fecha_creacion).toLocaleDateString('es-ES', {
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

export default Deslindes;

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
  useMediaQuery,
  Card,
  CardContent,
  Divider,
  Grid,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Edit, Delete, Visibility, ExpandMore, ExpandLess } from '@mui/icons-material';

const Politicas = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [politicas, setPoliticas] = useState([]);
  const [newTitulo, setNewTitulo] = useState('');
  const [newContenido, setNewContenido] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitulo, setEditTitulo] = useState('');
  const [editContenido, setEditContenido] = useState('');
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [expandedCard, setExpandedCard] = useState(null);
  const [viewOpen, setViewOpen] = useState(false); // For view dialog
  const [viewPolitica, setViewPolitica] = useState(null); // Store selected política for viewing

  // Controla la expansión de las tarjetas en vista móvil
  const handleExpandCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

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
      setSnackbarMessage('Política eliminada con éxito');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error al eliminar la política:', error);
      setSnackbarMessage('Error al eliminar la política');
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

  // Manejar el diálogo de visualización
  const handleViewOpen = (politica) => {
    setViewPolitica(politica);
    setViewOpen(true);
  };

  const handleViewClose = () => {
    setViewOpen(false);
    setViewPolitica(null);
  };

  // Cerrar el Snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    fetchPoliticas();
  }, []);

  // Renderiza tarjetas para vista móvil
  const renderMobileCards = () => {
    if (politicas.length === 0) {
      return (
        <Card sx={{ borderRadius: '12px', mb: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', p: 2 }}>
          <Typography variant="body1" color="text.secondary" align="center">
            No hay políticas disponibles
          </Typography>
        </Card>
      );
    }

    return politicas.map((item) => (
      <Card
        key={item.id}
        sx={{
          borderRadius: '12px',
          mb: 2,
          boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 20px rgba(0,0,0,0.15)' },
          backgroundColor: '#fff',
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" fontWeight="600" color="#1e3a8a">
              {item.titulo}
            </Typography>
            <Box>
              <Tooltip title="Visualizar">
                <IconButton
                  size="small"
                  onClick={() => handleViewOpen(item)}
                  sx={{ color: '#1e40af', mr: 1 }}
                >
                  <Visibility fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Editar">
                <IconButton
                  size="small"
                  onClick={() => handleClickOpen(item)}
                  sx={{ color: '#3f51b5', mr: 1 }}
                >
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar">
                <IconButton
                  size="small"
                  onClick={() => handleDeletePolitica(item.id)}
                  sx={{ color: '#dc2626' }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Box
            sx={{
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            onClick={() => handleExpandCard(item.id)}
          >
            <Typography variant="body2" color="text.secondary">
              Ver detalles
            </Typography>
            {expandedCard === item.id ? <ExpandLess /> : <ExpandMore />}
          </Box>

          {expandedCard === item.id && (
            <Box sx={{ mt: 2 }}>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Contenido:
              </Typography>
              <Typography variant="body2" paragraph sx={{ mb: 2, whiteSpace: 'pre-wrap', color: '#4b5563' }}>
                {item.contenido}
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Versión:
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    {item.version || '1.0'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Estado:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: '600',
                      color: item.estado === 'Activo' ? '#166534' : '#991b1b',
                      backgroundColor: item.estado === 'Activo' ? '#dcfce7' : '#fee2e2',
                      borderRadius: '12px',
                      padding: '4px 10px',
                      display: 'inline-block',
                      fontSize: '0.8rem',
                    }}
                  >
                    {item.estado || 'Activo'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Fecha de creación:
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    {new Date(item.fecha_creacion).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>
    ));
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        padding: { xs: '20px 10px', sm: '40px 20px' },
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e0e7ff 100%)',
        minHeight: '100vh',
      }}
    >
      {/* Formulario */}
      <Box
        sx={{
          backgroundColor: '#ffffff',
          padding: { xs: '20px', sm: '30px' },
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
            fontSize: { xs: '1.5rem', sm: '2rem' },
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
          fullWidth={isMobile}
          sx={{
            marginTop: '20px',
            padding: { xs: '10px 16px', sm: '12px 30px' },
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

      {/* Vista de tabla para desktop y tarjetas para móvil */}
      {isMobile ? (
        <Box>{renderMobileCards()}</Box>
      ) : (
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
              {politicas.length > 0 ? (
                politicas.map((item) => (
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
                      {item.version || '1.0'}
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
                        {item.estado || 'Activo'}
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
                            onClick={() => handleDeletePolitica(item.id)}
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
                    No hay políticas disponibles
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Diálogo de edición */}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            padding: '20px',
            backgroundColor: '#fafafa',
            width: isMobile ? '100%' : 'auto',
            margin: isMobile ? '10px' : 'auto',
          },
        }}
        fullScreen={isMobile}
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

      {/* Diálogo de visualización */}
      <Dialog
        open={viewOpen}
        onClose={handleViewClose}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            padding: '20px',
            backgroundColor: '#fafafa',
            width: isMobile ? '100%' : 'auto',
            margin: isMobile ? '10px' : 'auto',
          },
        }}
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ fontWeight: '700', color: '#1a237e', textAlign: 'center' }}>
          Visualizar Política
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ fontWeight: '600', color: '#1a237e', mb: 2 }}>
            {viewPolitica?.titulo}
          </Typography>
          <Typography variant="body1" sx={{ color: '#424242', whiteSpace: 'pre-wrap', mb: 2 }}>
            {viewPolitica?.contenido}
          </Typography>
          <Box>
            <Typography variant="body2" sx={{ color: '#616161' }}>
              <strong>Versión:</strong> {viewPolitica?.version || '1.0'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#616161' }}>
              <strong>Estado:</strong> {viewPolitica?.estado || 'Activo'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#616161' }}>
              <strong>Fecha de Creación:</strong>{' '}
              {viewPolitica &&
                new Date(viewPolitica.fecha_creacion).toLocaleDateString('es-ES', {
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
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Grid,
  Divider,
  Tooltip,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { Edit, Delete, Save, Add, Cancel } from '@mui/icons-material';

const FaqsAdmin = () => {
  const [faqs, setFaqs] = useState([]);
  const [pregunta, setPregunta] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentFaqId, setCurrentFaqId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = () => {
    setLoading(true);
    axios.get('http://localhost:3001/api/faqs')
      .then(response => {
        setFaqs(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener las preguntas frecuentes:', error);
        setNotification({
          open: true,
          message: 'Error al cargar las preguntas frecuentes',
          severity: 'error'
        });
        setLoading(false);
      });
  };

  const handleAddFaq = () => {
    if (!pregunta || !respuesta) {
      setNotification({
        open: true,
        message: 'La pregunta y la respuesta son obligatorias',
        severity: 'warning'
      });
      return;
    }

    setLoading(true);
    axios.post('http://localhost:3001/api/agregar', { pregunta, respuesta })
      .then(response => {
        setFaqs([...faqs, { id: response.data.idFaq, pregunta, respuesta }]);
        setPregunta('');
        setRespuesta('');
        setNotification({
          open: true,
          message: 'Pregunta frecuente agregada con éxito',
          severity: 'success'
        });
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al agregar la pregunta frecuente:', error);
        setNotification({
          open: true,
          message: 'Error al agregar la pregunta frecuente',
          severity: 'error'
        });
        setLoading(false);
      });
  };

  const handleEditFaq = (id) => {
    const faq = faqs.find(f => f.id === id);
    setPregunta(faq.pregunta);
    setRespuesta(faq.respuesta);
    setEditMode(true);
    setCurrentFaqId(id);
  };

  const handleUpdateFaq = () => {
    if (!pregunta || !respuesta) {
      setNotification({
        open: true,
        message: 'La pregunta y la respuesta son obligatorias',
        severity: 'warning'
      });
      return;
    }

    setLoading(true);
    axios.put(`http://localhost:3001/api/actualizar/${currentFaqId}`, { pregunta, respuesta })
      .then(response => {
        setFaqs(faqs.map(f => f.id === currentFaqId ? { id: currentFaqId, pregunta, respuesta } : f));
        setPregunta('');
        setRespuesta('');
        setEditMode(false);
        setCurrentFaqId(null);
        setNotification({
          open: true,
          message: 'Pregunta frecuente actualizada con éxito',
          severity: 'success'
        });
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al actualizar la pregunta frecuente:', error);
        setNotification({
          open: true,
          message: 'Error al actualizar la pregunta frecuente',
          severity: 'error'
        });
        setLoading(false);
      });
  };

  const handleDeleteFaq = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta pregunta frecuente?')) {
      setLoading(true);
      axios.delete(`http://localhost:3001/api/eliminar/${id}`)
        .then(response => {
          setFaqs(faqs.filter(f => f.id !== id));
          setNotification({
            open: true,
            message: 'Pregunta frecuente eliminada con éxito',
            severity: 'success'
          });
          setLoading(false);
        })
        .catch(error => {
          console.error('Error al eliminar la pregunta frecuente:', error);
          setNotification({
            open: true,
            message: 'Error al eliminar la pregunta frecuente',
            severity: 'error'
          });
          setLoading(false);
        });
    }
  };

  const handleCancelEdit = () => {
    setPregunta('');
    setRespuesta('');
    setEditMode(false);
    setCurrentFaqId(null);
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2, maxWidth: '800px', width: '100%' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          fontWeight: 'bold', 
          color: '#1976d2',
          textAlign: 'center', 
          mb: 3 
        }}>
          Preguntas Frecuentes
        </Typography>

        <Box sx={{ mb: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#555', textAlign: 'center' }}>
            {editMode ? 'Editar Pregunta Frecuente' : 'Agregar Nueva Pregunta Frecuente'}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Pregunta"
                variant="outlined"
                fullWidth
                value={pregunta}
                onChange={(e) => setPregunta(e.target.value)}
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Respuesta"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                {editMode ? (
                  <>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      startIcon={<Save />} 
                      onClick={handleUpdateFaq}
                    >
                      Actualizar
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="secondary" 
                      startIcon={<Cancel />} 
                      onClick={handleCancelEdit}
                    >
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<Add />} 
                    onClick={handleAddFaq}
                  >
                    Agregar
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom sx={{ color: '#555', textAlign: 'center' }}>
          Lista de Preguntas Frecuentes
        </Typography>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && faqs.length === 0 ? (
          <Alert severity="info" sx={{ my: 2 }}>
            No hay preguntas frecuentes disponibles. Agrega una nueva.
          </Alert>
        ) : (
          <TableContainer component={Paper} sx={{ 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
            borderRadius: 2,
            overflow: 'hidden',
            maxWidth: '100%', // Más grande, ocupa el 90% del contenedor
            margin: '0 auto' // Centrar la tabla
          }}>
          
            <Table>
              <TableHead sx={{ bgcolor: '#1976d2' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white', textAlign: 'center', width: '15%', fontSize: '0.85rem' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white', textAlign: 'center', width: '30%', fontSize: '0.85rem' }}>Pregunta</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white', textAlign: 'center', width: '35%', fontSize: '0.85rem' }}>Respuesta</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white', textAlign: 'center', width: '20%', fontSize: '0.85rem' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {faqs.map(faq => (
                  <TableRow 
                    key={faq.id}
                    sx={{
                      '&:nth-of-type(odd)': { backgroundColor: '#f7faff' },
                      '&:hover': { backgroundColor: '#e3f2fd' },
                      transition: 'background-color 0.3s'
                    }}
                  >
                    <TableCell sx={{ textAlign: 'center', fontSize: '0.8rem', padding: '8px' }}>{faq.id}</TableCell>
                    <TableCell sx={{ 
                      maxWidth: '150px', 
                      fontWeight: 'medium',
                      textAlign: 'center',
                      fontSize: '0.8rem',
                      padding: '8px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      <Tooltip title={faq.pregunta}>
                        <span>{faq.pregunta}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ 
                      maxWidth: '175px',
                      textAlign: 'center',
                      fontSize: '0.8rem',
                      padding: '8px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      <Tooltip title={faq.respuesta}>
                        <span>{faq.respuesta}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center', padding: '8px' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                        <Tooltip title="Editar">
                          <IconButton 
                            color="primary" 
                            onClick={() => handleEditFaq(faq.id)}
                            sx={{ padding: '4px', '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.1)' } }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton 
                            color="error" 
                            onClick={() => handleDeleteFaq(faq.id)}
                            sx={{ padding: '4px', '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' } }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default FaqsAdmin;
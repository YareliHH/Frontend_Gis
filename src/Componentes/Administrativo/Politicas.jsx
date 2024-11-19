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

  // Obtener todas las políticas
  const fetchPoliticas = async () => {
    try {
      const response = await axios.get('https://backendgislive.onrender.com/api/getpolitica');
      setPoliticas(response.data);
    } catch (error) {
      console.error('Error al obtener las políticas', error);
    }
  };

  // Crear una nueva política
  const handleCreatePolitica = async () => {
    try {
      await axios.post('https://backendgislive.onrender.com/api/insert', {
        titulo: newTitulo,
        contenido: newContenido,
      });
      setNewTitulo('');
      setNewContenido('');
      fetchPoliticas();
    } catch (error) {
      console.error('Error al crear la política', error);
    }
  };

  // Actualizar política
  const handleUpdatePolitica = async (id) => {
    try {
      await axios.put(`https://backendgislive.onrender.com/api/update/${id}`, {
        titulo: editTitulo,
        contenido: editContenido,
      });
      setEditId(null);
      setEditTitulo('');
      setEditContenido('');
      setOpen(false);
      fetchPoliticas();
    } catch (error) {
      console.error('Error al actualizar la política:', error);
    }
  };

  // Eliminar política
  const handleDeletePolitica = async (id) => {
    try {
      await axios.put(`https://backendgislive.onrender.com/api/deactivate/${id}`);
      fetchPoliticas();
    } catch (error) {
      console.error('Error al eliminar la política:', error);
    }
  };

  // Abrir el diálogo de edición
  const handleClickOpen = (politica) => {
    setEditId(politica.id);
    setEditTitulo(politica.titulo);
    setEditContenido(politica.contenido);
    setOpen(true);
  };

  // Cerrar el cuadro de diálogo
  const handleClose = () => {
    setOpen(false);
    setEditTitulo('');
    setEditContenido('');
    setEditId(null);
  };

  useEffect(() => {
    fetchPoliticas();
  }, []);

  return (
    <Container>
      <h1>Gestión de Políticas</h1>

      {/* Formulario para agregar una nueva política */}
      <TextField
        label="Título"
        variant="outlined"
        value={newTitulo}
        onChange={(e) => setNewTitulo(e.target.value)}
        size="small"
        fullWidth
        margin="dense"
      />
      <TextField
        label="Contenido"
        variant="outlined"
        value={newContenido}
        onChange={(e) => setNewContenido(e.target.value)}
        size="small"
        fullWidth
        multiline
        rows={3}
        margin="dense"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreatePolitica}
        sx={{ marginBottom: 2 }}
      >
        Agregar Política
      </Button>

      {/* Tabla compacta */}
      <TableContainer component={Paper} sx={{ backgroundColor: '#f1f8ff', marginTop: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '0.85rem' }}>
                Título
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '0.85rem' }}>
                Contenido
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '0.85rem' }}>
                Estado
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '0.85rem' }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {politicas.map((item) => (
              <TableRow key={item.id}>
                <TableCell align="center" sx={{ fontSize: '0.8rem' }}>{item.titulo}</TableCell>
                <TableCell align="center" sx={{ fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                  {item.contenido}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: '0.8rem' }}>
                  {item.estado ? 'Activo' : 'Inactivo'}
                </TableCell>
                <TableCell align="center">
                  <IconButton size="small" onClick={() => handleClickOpen(item)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDeletePolitica(item.id)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo de edición */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Editar Política</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Título"
            type="text"
            fullWidth
            value={editTitulo}
            onChange={(e) => setEditTitulo(e.target.value)}
            size="small"
          />
          <TextField
            margin="dense"
            label="Contenido"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={editContenido}
            onChange={(e) => setEditContenido(e.target.value)}
            size="small"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={() => { handleUpdatePolitica(editId); handleClose(); }} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Politicas;

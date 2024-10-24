import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Container, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle 
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const Politicas = () => {
  const [politicas, setPoliticas] = useState([]);
  const [newPolitica, setNewPolitica] = useState('');
  const [editId, setEditId] = useState(null);
  const [editPolitica, setEditPolitica] = useState('');
  const [open, setOpen] = useState(false);

  // Obtener todas las políticas
  const fetchPoliticas = async () => {
    try {
      const response = await axios.get('/getPoliticas');
      setPoliticas(response.data);
    } catch (error) {
      console.error("Error al obtener las políticas", error);
    }
  };

  // Crear una nueva política
  const handleCreatePolitica = async () => {
    try {
      await axios.post('/add_politica', { politica: newPolitica });
      setNewPolitica('');
      fetchPoliticas(); // Actualizar la lista
    } catch (error) {
      console.error("Error al crear la política", error);
    }
  };

  // Actualizar una política
  const handleUpdatePolitica = async (id) => {
    try {
      await axios.put(`/edit_politica/${id}`, { politica: editPolitica });
      setEditId(null);
      setEditPolitica('');
      fetchPoliticas(); // Actualizar la lista
    } catch (error) {
      console.error("Error al actualizar la política", error);
    }
  };

  // Eliminar una política
  const handleDeletePolitica = async (id) => {
    try {
      await axios.delete(`/delete_politica/${id}`);
      fetchPoliticas(); // Actualizar la lista
    } catch (error) {
      console.error("Error al eliminar la política", error);
    }
  };

  // Manejar el diálogo de edición
  const handleClickOpen = (politica) => {
    setEditPolitica(politica.politica);
    setEditId(politica.id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditPolitica('');
    setEditId(null);
  };

  useEffect(() => {
    fetchPoliticas();
  }, []);

  return (
    <Container>
      <h1>Gestión de Políticas</h1>

      <TextField 
        label="Nueva política" 
        variant="outlined" 
        value={newPolitica} 
        onChange={(e) => setNewPolitica(e.target.value)} 
        fullWidth
        margin="normal"
      />
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleCreatePolitica}
        style={{ marginBottom: '20px' }}
      >
        Agregar Política
      </Button>

      <List>
        {politicas.map(politica => (
          <ListItem key={politica.id} divider>
            <ListItemText primary={politica.politica} />
            <IconButton 
              edge="end" 
              aria-label="edit" 
              onClick={() => handleClickOpen(politica)}
            >
              <Edit />
            </IconButton>
            <IconButton 
              edge="end" 
              aria-label="delete" 
              onClick={() => handleDeletePolitica(politica.id)}
            >
              <Delete />
            </IconButton>
          </ListItem>
        ))}
      </List>

      {/* Dialogo para editar política */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Editar Política</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Editar Política"
            type="text"
            fullWidth
            value={editPolitica}
            onChange={(e) => setEditPolitica(e.target.value)}
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

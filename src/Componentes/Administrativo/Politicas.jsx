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
      console.error("Error al obtener las políticas", error);
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
      console.error("Error al crear la política", error);
    }
  };

  // Actualizar una política
  const handleUpdatePolitica = async (id) => {
    try {
      await axios.put(`https://backendgislive.onrender.com/api/update/${id}`, {
        numero_politica: editId,
        titulo: editTitulo,
        contenido: editContenido,
      });
      setEditId(null);
      setEditTitulo('');
      setEditContenido('');
      fetchPoliticas();
    } catch (error) {
      console.error("Error al actualizar la política", error);
    }
  };

  // Eliminar una política (lógicamente)
  const handleDeletePolitica = async (id) => {
    try {
      await axios.put(`https://backendgislive.onrender.com/api/deactivate/${id}`);
      fetchPoliticas();
    } catch (error) {
      console.error("Error al eliminar la política", error);
    }
  };

  // Manejar el diálogo de edición
  const handleClickOpen = (politica) => {
    setEditTitulo(politica.titulo);
    setEditContenido(politica.contenido);
    setEditId(politica.numero_politica);
    setOpen(true);
  };

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
      <h1>Gestión de Políticas de Privacidad</h1>

      <TextField 
        label="Título de la nueva política" 
        variant="outlined" 
        value={newTitulo} 
        onChange={(e) => setNewTitulo(e.target.value)} 
        fullWidth
        margin="normal"
      />
      <TextField 
        label="Contenido de la nueva política" 
        variant="outlined" 
        value={newContenido} 
        onChange={(e) => setNewContenido(e.target.value)} 
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
            <ListItemText 
              primary={`${politica.titulo} (Versión: ${politica.version})`} 
              secondary={politica.contenido} 
            />
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
            label="Título de la política"
            type="text"
            fullWidth
            value={editTitulo}
            onChange={(e) => setEditTitulo(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Contenido de la política"
            type="text"
            fullWidth
            value={editContenido}
            onChange={(e) => setEditContenido(e.target.value)}
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

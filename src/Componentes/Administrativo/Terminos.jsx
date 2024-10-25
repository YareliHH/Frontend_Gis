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

const TerminosCondiciones = () => {
  const [terminos, setTerminos] = useState([]);
  const [newTitulo, setNewTitulo] = useState('');
  const [newContenido, setNewContenido] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitulo, setEditTitulo] = useState('');
  const [editContenido, setEditContenido] = useState('');
  const [open, setOpen] = useState(false);

  // Obtener todos los términos
  const fetchTerminos = async () => {
    try {
      const response = await axios.get('https://backendgislive.onrender.com/api/getterminos');
      setTerminos(response.data);
    } catch (error) {
      console.error("Error al obtener los términos", error);
    }
  };

  // Crear un nuevo término
  const handleCreateTermino = async () => {
    try {
      await axios.post('https://backendgislive.onrender.com/api/insert', {
        titulo: newTitulo,
        contenido: newContenido,
      });
      setNewTitulo('');
      setNewContenido('');
      fetchTerminos();
    } catch (error) {
      console.error("Error al crear el término", error);
    }
  };

  // Actualizar un término
  const handleUpdateTermino = async (id) => {
    try {
      await axios.put(`https://backendgislive.onrender.com/api/update/${id}`, {
        titulo: editTitulo,
        contenido: editContenido,
      });
      setEditId(null);
      setEditTitulo('');
      setEditContenido('');
      fetchTerminos();
    } catch (error) {
      console.error("Error al actualizar el término", error);
    }
  };

  // Eliminar un término (lógicamente)
  const handleDeleteTermino = async (id) => {
    try {
      await axios.put(`https://backendgislive.onrender.com/api/deactivate/${id}`);
      fetchTerminos();
    } catch (error) {
      console.error("Error al eliminar el término", error);
    }
  };

  // Manejar el diálogo de edición
  const handleClickOpen = (termino) => {
    setEditTitulo(termino.titulo);
    setEditContenido(termino.contenido);
    setEditId(termino.id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditTitulo('');
    setEditContenido('');
    setEditId(null);
  };

  useEffect(() => {
    fetchTerminos();
  }, []);

  return (
    <Container>
      <h1>Gestión de Términos y Condiciones</h1>

      <TextField 
        label="Título del nuevo término" 
        variant="outlined" 
        value={newTitulo} 
        onChange={(e) => setNewTitulo(e.target.value)} 
        fullWidth
        margin="normal"
      />
      <TextField 
        label="Contenido del nuevo término" 
        variant="outlined" 
        value={newContenido} 
        onChange={(e) => setNewContenido(e.target.value)} 
        fullWidth
        margin="normal"
      />
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleCreateTermino}
        style={{ marginBottom: '20px' }}
      >
        Agregar Término
      </Button>

      <List>
        {terminos.map(termino => (
          <ListItem key={termino.id} divider>
            <ListItemText 
              primary={`${termino.titulo} (Versión: ${termino.version})`} 
              secondary={termino.contenido} 
            />
            <IconButton 
              edge="end" 
              aria-label="edit" 
              onClick={() => handleClickOpen(termino)}
            >
              <Edit />
            </IconButton>
            <IconButton 
              edge="end" 
              aria-label="delete" 
              onClick={() => handleDeleteTermino(termino.id)}
            >
              <Delete />
            </IconButton>
          </ListItem>
        ))}
      </List>

      {/* Dialogo para editar término */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Editar Término</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Título del término"
            type="text"
            fullWidth
            value={editTitulo}
            onChange={(e) => setEditTitulo(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Contenido del término"
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
          <Button onClick={() => { handleUpdateTermino(editId); handleClose(); }} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TerminosCondiciones;

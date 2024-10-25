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

const Deslinde = () => {
  const [deslinde, setdeslinde] = useState([]);
  const [newTitulo, setNewTitulo] = useState('');
  const [newContenido, setNewContenido] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitulo, setEditTitulo] = useState('');
  const [editContenido, setEditContenido] = useState('');
  const [open, setOpen] = useState(false);

  // Obtener todas las políticas
  const fetchDeslinde = async () => {
    try {
      const response = await axios.get('https://backendgislive.onrender.com/api/getpolitica');
      setdeslinde(response.data);
    } catch (error) {
      console.error("Error al obtener las políticas", error);
    }
  };

  // Crear una nueva deslinde
  const handleCreateDeslinde = async () => {
    try {
      await axios.post('https://backendgislive.onrender.com/api/insert', {
        titulo: newTitulo,
        contenido: newContenido,
      });
      setNewTitulo('');
      setNewContenido('');
      fetchDeslinde();
    } catch (error) {
      console.error("Error al crear la política", error);
    }
  };

  // Actualizar un deslinde
  const handleUpdateDeslinde = async (id) => {
    try {
      await axios.put(`https://backendgislive.onrender.com/api/update/${id}`, {
        titulo: editTitulo,
        contenido: editContenido,
      });
      setEditId(null);
      setEditTitulo('');
      setEditContenido('');
      fetchDeslinde();
    } catch (error) {
      console.error("Error al actualizar la deslinde", error);
    }
  };

  // Eliminar un deslinde (lógicamente)
  const handleDeleteDeslinde = async (id) => {
    try {
      await axios.put(`https://backendgislive.onrender.com/api/deactivate/${id}`);
      fetchDeslinde();
    } catch (error) {
      console.error("Error al eliminar la deslinde", error);
    }
  };

  // Manejar el diálogo de edición
  const handleClickOpen = (deslinde) => {
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

  useEffect(() => {
    fetchDeslinde();
  }, []);

  return (
    <Container>
      <h1>Gestión de Deslinde Legal </h1>

      <TextField 
        label="Título de la nueva deslinde" 
        variant="outlined" 
        value={newTitulo} 
        onChange={(e) => setNewTitulo(e.target.value)} 
        fullWidth
        margin="normal"
      />
      <TextField 
        label="Contenido de la nueva deslinde" 
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
        Agregar Deslinde
      </Button>

      <List>
        {deslinde.map(deslinde=> (
          <ListItem key={deslinde.id} divider>
            <ListItemText 
              primary={`${deslinde.titulo} (Versión: ${deslinde.version})`} 
              secondary={deslinde.contenido} 
            />
            <IconButton 
              edge="end" 
              aria-label="edit" 
              onClick={() => handleClickOpen(deslinde)}
            >
              <Edit />
            </IconButton>
            <IconButton 
              edge="end" 
              aria-label="delete" 
              onClick={() => handleDeleteDeslinde(deslinde.id)}
            >
              <Delete />
            </IconButton>
          </ListItem>
        ))}
      </List>

      {/* Dialogo para editar política */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Editar Deslinde</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Título de la Deslinde"
            type="text"
            fullWidth
            value={editTitulo}
            onChange={(e) => setEditTitulo(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Contenido de la Deslinde"
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

export default Deslinde;

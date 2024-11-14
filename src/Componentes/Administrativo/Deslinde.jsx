import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {  Container,  TextField,  Button,  List,  ListItem,  ListItemText,  IconButton,Dialog,DialogActions,DialogContent, DialogTitle } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const Deslinde = () => {
  const [deslinde, setDeslinde] = useState([]);
  const [newTitulo, setNewTitulo] = useState('');
  const [newContenido, setNewContenido] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitulo, setEditTitulo] = useState('');
  const [editContenido, setEditContenido] = useState('');
  const [open, setOpen] = useState(false);

  // Obtener todas el deslinde
  const fetchDeslinde = async () => {
    try {
      const response = await axios.get('https://backendgislive.onrender.com/api/getdeslinde');
      setDeslinde(response.data);
    } catch (error) {
      console.error("Error al obtener el deslinde", error);
    }
  };

  // Crear una nueva deslinde
  const handleCreateDeslinde = async () => {
    try {
      await axios.post('https://backendgislive.onrender.com/api/deslinde', {
        titulo: newTitulo,
        contenido: newContenido,
      });
      setNewTitulo('');
      setNewContenido('');
      fetchDeslinde();
    } catch (error) {
      console.error("Error al crear el deslinde", error);
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
      console.error("Error al actualizar el deslinde", error);
    }
  };

  // Eliminar un deslinde (lógicamente)
  const handleDeleteDeslinde = async (id) => {
    try {
      await axios.put(`https://backendgislive.onrender.com/api/deactivate/${id}`);
      fetchDeslinde();
    } catch (error) {
      console.error("Error al eliminar el deslinde", error);
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
    <h1>Gestión de Deslinde Legal</h1>

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
      onClick={handleCreateDeslinde}
      style={{ marginBottom: '20px' }}
    >
      Agregar Deslinde
    </Button>

    <TableContainer style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: '#fff', textAlign: 'center' }}>Red Social</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: '#fff', textAlign: 'center' }}>Número</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: '#fff' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deslinde.map((item) => (
              <TableRow key={item.id}>
                <TableCell sx={{ textAlign: 'center' }}>{item.titulo}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{item.contenido}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleClickOpen(item)}>
                    <Edit />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteDeslinde(item.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
          <Button
            onClick={() => { handleUpdateDeslinde(editId); handleClose(); }}
            color="primary"
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};


export default Deslinde;

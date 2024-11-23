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

const Deslindes = () => {
  const [deslindes, setDeslindes] = useState([]);
  const [newTitulo, setNewTitulo] = useState('');
  const [newContenido, setNewContenido] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitulo, setEditTitulo] = useState('');
  const [editContenido, setEditContenido] = useState('');
  const [open, setOpen] = useState(false);

  // Obtener todos los deslindes
  const fetchDeslindes = async () => {
    try {
      const response = await axios.get('https://backendgislive.onrender.com/api/getdeslinde');
      setDeslindes(response.data);
    } catch (error) {
      console.error('Error al obtener los deslindes:', error.response ? error.response.data : error.message);
      // Si el error tiene una respuesta, imprime el detalle de la respuesta
    }
};

  // Crear un nuevo deslinde
  const handleCreateDeslinde = async () => {
    try {
      await axios.post('https://backendgislive.onrender.com/api/deslinde', {
        titulo: newTitulo,
        contenido: newContenido,
      });
      setNewTitulo('');
      setNewContenido('');
      fetchDeslindes();
    } catch (error) {
      console.error('Error al crear el deslinde', error);
    }
  };

  // Actualizar un deslinde
  const handleUpdateDeslinde = async (id) => {
    try {
      await axios.put(`https://backendgislive.onrender.com/api/updatedeslinde/${id}`, {
        titulo: editTitulo,
        contenido: editContenido,
      });
      setEditId(null);
      setEditTitulo('');
      setEditContenido('');
      setOpen(false); // Cerrar el diálogo después de guardar
      fetchDeslindes();
    } catch (error) {
      console.error('Error al actualizar el deslinde', error);
    }
  };

  // Eliminar un deslinde (lógicamente)
  const handleDeleteDeslinde = async (id) => {
    try {
      await axios.put(`https://backendgislive.onrender.com/api/deactivatedeslinde/${id}`);
      fetchDeslindes();
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

  useEffect(() => {
    fetchDeslindes();
  }, []);

  return (
    <Container>
      <h1>Gestión de Deslindes</h1>

      <TextField
        label="Título del nuevo deslinde"
        variant="outlined"
        value={newTitulo}
        onChange={(e) => setNewTitulo(e.target.value)}
        fullWidth
        margin="normal"
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
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateDeslinde}
        style={{ marginBottom: '20px' }}
      >
        Agregar Deslinde
      </Button>

      <TableContainer component={Paper} sx={{ backgroundColor: '#e3f2fd', marginTop: '20px' }}>
        <Table aria-label="tabla de deslindes">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: '#fff', textAlign: 'center' }}>
                Título
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: '#fff', textAlign: 'center' }}>
                Contenido
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: '#fff', textAlign: 'center' }}>
                Versión
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: '#fff', textAlign: 'center' }}>
                Estado
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: '#fff', textAlign: 'center' }}>
                Fecha de Creación
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: '#fff', textAlign: 'center' }}>
                Fecha de Actualización
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: '#fff', textAlign: 'center' }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deslindes.map((item) => (
              <TableRow key={item.id}>
                <TableCell sx={{ textAlign: 'center' }}>{item.titulo}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                    {item.contenido}
                  </Typography>
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{item.version}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{item.estado }</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{new Date(item.fecha_creacion).toLocaleDateString()}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{new Date(item.fecha_actualizacion).toLocaleDateString()}</TableCell>
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

      {/* Diálogo para editar deslinde */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Editar Deslinde</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Título del deslinde"
            type="text"
            fullWidth
            value={editTitulo}
            onChange={(e) => setEditTitulo(e.target.value)}
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={() => { handleUpdateDeslinde(editId); handleClose(); }} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Deslindes;

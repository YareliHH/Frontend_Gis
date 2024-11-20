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
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const TerminosYCondiciones = () => {
  const [terminos, setTerminos] = useState([]);
  const [newTitulo, setNewTitulo] = useState('');
  const [newContenido, setNewContenido] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitulo, setEditTitulo] = useState('');
  const [editContenido, setEditContenido] = useState('');
  const [open, setOpen] = useState(false);

  // Obtener todos los términos y condiciones
  const fetchTerminos = async () => {
    try {
      const response = await axios.get('https://backendgislive.onrender.com/api/getterminos');
      setTerminos(response.data);
    } catch (error) {
      console.error('Error al obtener los términos y condiciones', error);
    }
  };

  // Crear un nuevo término
  const handleCreateTermino = async () => {
    try {
      await axios.post('https://backendgislive.onrender.com/api/inserttermino', {
        titulo: newTitulo,
        contenido: newContenido,
      });
      setNewTitulo('');
      setNewContenido('');
      fetchTerminos();
    } catch (error) {
      console.error('Error al crear el término', error);
    }
  };

  // Actualizar un término
  const handleUpdateTermino = async (id) => {
    try {
      await axios.put(`https://backendgislive.onrender.com/api/updatetermino/${id}`, {
        titulo: editTitulo,
        contenido: editContenido,
      });
      setEditId(null);
      setEditTitulo('');
      setEditContenido('');
      setOpen(false); // Cerrar el diálogo después de guardar
      fetchTerminos();
    } catch (error) {
      console.error('Error al actualizar el término', error);
    }
  };

  // Eliminar un término (lógicamente)
  const handleDeleteTermino = async (id) => {
    try {
      await axios.put(`https://backendgislive.onrender.com/api/deactivatetermino/${id}`);
      fetchTerminos();
    } catch (error) {
      console.error('Error al eliminar el término', error);
    }
  };

  // Manejar el diálogo de edición
  const handleClickOpen = (termino) => {
    setEditId(termino.id);
    setEditTitulo(termino.titulo);
    setEditContenido(termino.contenido);
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
        multiline
        rows={4}
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

      <TableContainer component={Paper} sx={{ backgroundColor: '#e3f2fd', marginTop: '20px' }}>
        <Table aria-label="tabla de términos y condiciones">
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
            {terminos.map((item) => (
              <TableRow key={item.id}>
                <TableCell sx={{ textAlign: 'center' }}>{item.titulo}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{item.contenido}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{item.version}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{item.estado ? 'Activo' : 'Inactivo'}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  {new Date(item.fecha_creacion).toLocaleDateString()}
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  {new Date(item.fecha_actualizacion).toLocaleDateString()}
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleClickOpen(item)}>
                    <Edit />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTermino(item.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo para editar término */}
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
          <Button
            onClick={() => {
              handleUpdateTermino(editId);
              handleClose();
            }}
            color="primary"
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TerminosYCondiciones;

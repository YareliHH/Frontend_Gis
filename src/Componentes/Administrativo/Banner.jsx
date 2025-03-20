// BannerManager.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';

const BannerManager = () => {
  const [banners, setBanners] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    url: ''
  });

  // Obtener todos los banners al cargar el componente
  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axios.get('/obtener');
      setBanners(response.data);
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Enviar formulario (crear o actualizar)
  const handleSubmit = async () => {
    try {
      if (editId) {
        // Actualizar banner
        await axios.put(`/bannersact/${editId}`, formData);
      } else {
        // Crear nuevo banner
        await axios.post('/insertar', formData);
      }
      fetchBanners();
      handleClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Eliminar banner
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/banners/${id}`);
      fetchBanners();
    } catch (error) {
      console.error('Error deleting banner:', error);
    }
  };

  // Abrir formulario para editar
  const handleEdit = (banner) => {
    setEditId(banner.id);
    setFormData({
      titulo: banner.titulo,
      descripcion: banner.descripcion,
      url: banner.url
    });
    setOpen(true);
  };

  // Abrir formulario para nuevo banner
  const handleOpen = () => {
    setEditId(null);
    setFormData({ titulo: '', descripcion: '', url: '' });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Banners
      </Typography>
      
      <Button variant="contained" onClick={handleOpen} sx={{ mb: 2 }}>
        Nuevo Banner
      </Button>

      {/* Tabla de banners */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>URL</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {banners.map((banner) => (
              <TableRow key={banner.id}>
                <TableCell>{banner.titulo}</TableCell>
                <TableCell>{banner.descripcion}</TableCell>
                <TableCell>{banner.url}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(banner)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(banner.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialogo para crear/editar */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editId ? 'Editar Banner' : 'Nuevo Banner'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Título"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Descripción"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="URL"
            name="url"
            value={formData.url}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editId ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BannerManager;
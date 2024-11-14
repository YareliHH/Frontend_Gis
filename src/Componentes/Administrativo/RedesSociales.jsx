import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, List, ListItem, ListItemText, IconButton, Typography } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

const RedesSociales = () => {
  const [redes, setRedes] = useState([]);
  const [nombreRed, setNombreRed] = useState('');
  const [url, setUrl] = useState('');
  const [editId, setEditId] = useState(null);

  // Cargar redes sociales al montar el componente
  useEffect(() => {
    obtenerRedesSociales();
  }, []);

  // Función para obtener redes sociales
  const obtenerRedesSociales = async () => {
    try {
      const response = await axios.get('https://backendgislive.onrender.com/api/redes/get');
      setRedes(response.data);
    } catch (error) {
      console.error('Error al obtener redes sociales:', error);
    }
  };

  // Función para manejar el envío de la red social
  const manejarEnvio = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Editar red social
        await axios.put(`https://backendgislive.onrender.com/api/redes/editar/${editId}`, { nombre_red: nombreRed, url });
        setEditId(null);
      } else {
        // Crear nueva red social
        await axios.post('https://backendgislive.onrender.com/api/redes/nuevo', { nombre_red: nombreRed, url });
      }
      setNombreRed('');
      setUrl('');
      obtenerRedesSociales();
    } catch (error) {
      console.error('Error al agregar/editar red social:', error);
    }
  };

  // Función para manejar la edición
  const manejarEdicion = (red) => {
    setNombreRed(red.nombre_red);
    setUrl(red.url);
    setEditId(red.id);
  };

  // Función para eliminar una red social
  const eliminarRedSocial = async (id) => {
    try {
      await axios.delete(`https://backendgislive.onrender.com/api/redes/eliminar/${id}`);
      obtenerRedesSociales();
    } catch (error) {
      console.error('Error al eliminar red social:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Redes Sociales
      </Typography>
      
      <form onSubmit={manejarEnvio}>
        <TextField
          label="Nombre de la red"
          value={nombreRed}
          onChange={(e) => setNombreRed(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          {editId ? 'Actualizar Red Social' : 'Agregar Red Social'}
        </Button>
      </form>

      <List>
        {redes.map((red) => (
          <ListItem key={red.id} divider>
            <ListItemText primary={red.nombre_red} secondary={red.url} />
            <IconButton onClick={() => manejarEdicion(red)} color="primary">
              <Edit />
            </IconButton>
            <IconButton onClick={() => eliminarRedSocial(red.id)} color="secondary">
              <Delete />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default RedesSociales;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Container, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const MySwal = withReactContent(Swal);

const Perfil = () => {
  const [perfiles, setPerfiles] = useState([]);
  const [mision, setMision] = useState('');
  const [vision, setVision] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState('');

  const apiUrl = 'https://backendgislive.onrender.com/api/perfil';

  useEffect(() => {
    fetchPerfiles();
  }, []);

  const fetchPerfiles = async () => {
    try {
      const response = await axios.get(apiUrl);
      setPerfiles(response.data);
    } catch (error) {
      console.error('Error al obtener perfiles:', error);
      MySwal.fire('Error', 'No se pudo obtener la lista de perfiles', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      await updatePerfil(currentId);
    } else {
      await createPerfil();
    }
    resetForm();
    fetchPerfiles();
  };

  const createPerfil = async () => {
    try {
      await axios.post(apiUrl, { mision, vision });
      MySwal.fire('Éxito', 'Perfil creado correctamente', 'success');
    } catch (error) {
      console.error('Error al crear perfil:', error);
      MySwal.fire('Error', 'No se pudo crear el perfil', 'error');
    }
  };

  const updatePerfil = async (id) => {
    try {
      await axios.put(`${apiUrl}/${id}`, { mision, vision });
      MySwal.fire('Éxito', 'Perfil actualizado correctamente', 'success');
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      MySwal.fire('Error', 'No se pudo actualizar el perfil', 'error');
    }
  };

  const deletePerfil = async (id) => {
    const confirm = await MySwal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4caf50',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${apiUrl}/${id}`);
        MySwal.fire('Eliminado', 'Eliminado correctamente', 'success');
        fetchPerfiles();
      } catch (error) {
        console.error('Error al eliminar perfil:', error);
        MySwal.fire('Error', 'No se pudo eliminar el perfil', 'error');
      }
    }
  };

  const editPerfil = (id, mision, vision) => {
    setCurrentId(id);
    setMision(mision);
    setVision(vision);
    setEditMode(true);
  };

  const resetForm = () => {
    setMision('');
    setVision('');
    setEditMode(false);
    setCurrentId('');
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '20px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Perfil de Empresa
      </Typography>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <TextField
          label="Misión"
          variant="outlined"
          fullWidth
          margin="normal"
          value={mision}
          onChange={(e) => setMision(e.target.value)}
          required
        />
        <TextField
          label="Visión"
          variant="outlined"
          fullWidth
          margin="normal"
          value={vision}
          onChange={(e) => setVision(e.target.value)}
          required
        />
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
          <Button type="submit" variant="contained" color="primary">
            {editMode ? 'Actualizar' : 'Crear'}
          </Button>
          {editMode && (
            <Button variant="outlined" color="secondary" onClick={resetForm}>
              Cancelar
            </Button>
          )}
        </div>
      </form>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Misión</TableCell>
              <TableCell>Visión</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {perfiles.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.mision}</TableCell>
                <TableCell>{item.vision}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => editPerfil(item._id, item.mision, item.vision)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => deletePerfil(item._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Perfil;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Button, Container, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';

const MySwal = withReactContent(Swal);

const Deslinde = () => {
  const [deslindes, setDeslindes] = useState([]);
  const [deslinde, setDeslinde] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState('');

  const apiUrl = 'https://backendgislive.onrender.com/api/deslinde';

  useEffect(() => {
    fetchDeslindes();
  }, []);

  const fetchDeslindes = async () => {
    try {
      const response = await axios.get(apiUrl);
      setDeslindes(response.data);
    } catch (error) {
      console.error('Error al obtener deslindes:', error);
      MySwal.fire('Error', 'No se pudo obtener la lista de deslindes', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      await updateDeslinde(currentId);
    } else {
      await createDeslinde();
    }
    resetForm();
    fetchDeslindes();
  };

  const createDeslinde = async () => {
    try {
      await axios.post(apiUrl, { deslinde });
      MySwal.fire('Éxito', 'Se insertó correctamente', 'success');
    } catch (error) {
      console.error('Error al crear deslinde:', error);
      MySwal.fire('Error', 'No se pudo crear el deslinde', 'error');
    }
  };

  const updateDeslinde = async (id) => {
    try {
      await axios.put(`${apiUrl}/${id}`, { deslinde });
      MySwal.fire('Éxito', 'Actualizado correctamente', 'success');
    } catch (error) {
      console.error('Error al actualizar deslinde:', error);
      MySwal.fire('Error', 'No se pudo actualizar el deslinde', 'error');
    }
  };

  const deleteDeslinde = async (id) => {
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
        fetchDeslindes();
      } catch (error) {
        console.error('Error al eliminar deslinde:', error);
        MySwal.fire('Error', 'No se pudo eliminar el deslinde', 'error');
      }
    }
  };

  const editDeslinde = (id, deslinde) => {
    setCurrentId(id);
    setDeslinde(deslinde);
    setEditMode(true);
  };

  const resetForm = () => {
    setDeslinde('');
    setEditMode(false);
    setCurrentId('');
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom textAlign="center">
        Deslindes Legal
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <TextField
          fullWidth
          label="Ingrese deslinde"
          variant="outlined"
          value={deslinde}
          onChange={(e) => setDeslinde(e.target.value)}
          required
          sx={{ mb: 2 }}
        />
        <Box display="flex" justifyContent="center" gap={2}>
          <Button variant="contained" color="primary" type="submit">
            {editMode ? 'Actualizar' : 'Agregar'}
          </Button>
          {editMode && (
            <Button variant="contained" color="error" onClick={resetForm}>
              Cancelar
            </Button>
          )}
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Deslinde</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deslindes.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.deslinde}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="warning"
                    onClick={() => editDeslinde(item._id, item.deslinde)}
                    sx={{ mr: 2 }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => deleteDeslinde(item._id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Deslinde;

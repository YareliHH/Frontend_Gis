import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {Container,Typography,TextField,Button,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,Box,IconButton,} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const MySwal = withReactContent(Swal);

const Termino = () => {
  const [terminos, setTerminos] = useState([]);
  const [termino, setTermino] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState('');

  const apiUrl = 'https://backendgislive.onrender.com/api/terminos'; // URL de tu backend

  useEffect(() => {
    fetchTerminos();
  }, []);

  const fetchTerminos = async () => {
    try {
      const response = await axios.get(apiUrl);
      setTerminos(response.data);
    } catch (error) {
      console.error('Error al obtener términos:', error);
      MySwal.fire('Error', 'No se pudo obtener la lista de términos', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      await updateTermino(currentId);
    } else {
      await createTermino();
    }
    resetForm();
    fetchTerminos();
  };

  const createTermino = async () => {
    try {
      await axios.post(apiUrl, { termino });
      MySwal.fire('Éxito', 'Término creado correctamente', 'success');
    } catch (error) {
      console.error('Error al crear término:', error);
      MySwal.fire('Error', 'No se pudo crear el término', 'error');
    }
  };

  const updateTermino = async (id) => {
    try {
      await axios.put(`${apiUrl}/${id}`, { termino });
      MySwal.fire('Éxito', 'Término actualizado correctamente', 'success');
    } catch (error) {
      console.error('Error al actualizar término:', error);
      MySwal.fire('Error', 'No se pudo actualizar el término', 'error');
    }
  };

  const deleteTermino = async (id) => {
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
        fetchTerminos();
      } catch (error) {
        console.error('Error al eliminar término:', error);
        MySwal.fire('Error', 'No se pudo eliminar el término', 'error');
      }
    }
  };

  const editTermino = (id, termino) => {
    setCurrentId(id);
    setTermino(termino);
    setEditMode(true);
  };

  const resetForm = () => {
    setTermino('');
    setEditMode(false);
    setCurrentId('');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Gestión de Términos y Condiciones
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <TextField
          label="Ingrese términos y condiciones"
          variant="outlined"
          fullWidth
          value={termino}
          onChange={(e) => setTermino(e.target.value)}
          required
          sx={{ mb: 2 }}
        />
        <Box display="flex" justifyContent="center" gap={2}>
          <Button variant="contained" color="primary" type="submit">
            {editMode ? 'Actualizar' : 'Crear'}
          </Button>
          {editMode && (
            <Button variant="contained" color="secondary" onClick={resetForm}>
              Cancelar
            </Button>
          )}
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Término</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {terminos.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.termino}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => editTermino(item._id, item.termino)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => deleteTermino(item._id)}
                  >
                    <DeleteIcon />
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

export default Termino;

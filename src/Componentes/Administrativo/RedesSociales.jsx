import React, { useState, useEffect } from 'react';
import {
  TextField,
  Grid,
  Typography,
  Box,
  Button,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon } from '@mui/icons-material';
import axios from 'axios';
import Notificaciones from '../Compartidos/Notificaciones';

// Redes sociales disponibles
const availableSocials = [
  { label: 'Facebook', name: 'facebook', type: 'url' },
  { label: 'Twitter', name: 'twitter', type: 'url' },
  { label: 'LinkedIn', name: 'linkedin', type: 'url' },
  { label: 'Instagram', name: 'instagram', type: 'url' },
  { label: 'WhatsApp', name: 'whatsapp', type: 'phone' },
];

const RedesSociales = () => {
  const [socialData, setSocialData] = useState({});
  const [selectedSocial, setSelectedSocial] = useState('');
  const [url, setUrl] = useState('');
  const [isEditing, setIsEditing] = useState(null);
  
  // Estado para manejar notificaciones
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    type: 'success',  // success, error, warning, info
  });

  // Manejar el cierre de la notificación
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Cargar las redes sociales de la base de datos
  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const response = await axios.get('https://backendgislive.onrender.com/api/redesSociales/get');
        setSocialData(response.data.reduce((acc, item) => ({ ...acc, [item.nombre_red]: item }), {})); // Guardamos el objeto completo
      } catch (error) {
        console.error('Error al obtener las redes sociales:', error);
      }
    };

    fetchSocials();
  }, []);

  const handleInputChange = (e) => {
    if (selectedSocial === 'whatsapp') {
     
      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
      setUrl(value);
    } else {
      setUrl(e.target.value);
    }
  };

  const handleSocialSelect = (e) => {
    setSelectedSocial(e.target.value);
    setUrl(''); 
  };

  // Validación simplificada: solo se valida que el campo no esté vacío y que no se duplique
  const validateInput = () => {
    if (!url) {
      setNotification({
        open: true,
        message: 'Por favor, ingresa un enlace o número.',
        type: 'error',
      });
      return false;
    }

    if (socialData[selectedSocial] && !isEditing) {
      setNotification({
        open: true,
        message: `La red social ${selectedSocial} ya está registrada. Puedes editarla en lugar de agregar una nueva.`,
        type: 'warning',
      });
      return false;
    }

    return true;
  };

  // Guardar red social (añadir o editar)
  const handleSave = async () => {
    if (validateInput()) {
      try {
        if (isEditing !== null) {
          // Editar la red social
          await axios.put(`https://backendgislive.onrender.com/api/redesSociales/editar/${isEditing}`, {
            nombre_red: selectedSocial,
            url: selectedSocial === 'whatsapp' ? `+52${url}` : url,
          });
          setSocialData({ ...socialData, [selectedSocial]: { ...socialData[selectedSocial], url: `+52${url}` } });
          setIsEditing(null);
          setNotification({
            open: true,
            message: 'Red social actualizada con éxito.',
            type: 'success',
          });
        } else {
          // Añadir nueva red social
          const response = await axios.post('https://backendgislive.onrender.com/api/redesSociales/nuevo', {
            nombre_red: selectedSocial,
            url: selectedSocial === 'whatsapp' ? `+52${url}` : url,
          });
          const newSocial = response.data;
          setSocialData({ ...socialData, [selectedSocial]: newSocial });
          setNotification({
            open: true,
            message: 'Red social agregada con éxito.',
            type: 'success',
          });
        }
        setSelectedSocial('');
        setUrl('');
      } catch (error) {
        console.error('Error al guardar la red social:', error);
        setNotification({
          open: true,
          message: 'Error al guardar la red social.',
          type: 'error',
        });
      }
    }
  };

  // Eliminar red social
  const handleDelete = async (social) => {
    try {
      const id = socialData[social]?.id;
      await axios.delete(`https://backendgislive.onrender.com/api/redesSociales/eliminar/${id}`);
      const updatedData = { ...socialData };
      delete updatedData[social];
      setSocialData(updatedData);
      setNotification({
        open: true,
        message: 'Red social eliminada.',
        type: 'success',
      });
    } catch (error) {
      console.error('Error al eliminar la red social:', error);
      setNotification({
        open: true,
        message: 'Error al eliminar la red social.',
        type: 'error',
      });
    }
  };

  // Editar red social
  const handleEdit = (social) => {
    setIsEditing(socialData[social].id);
    setSelectedSocial(social);
    setUrl(socialData[social].url.replace('+52', '')); 
  };

  return (
    <Box sx={{ mt: 4, backgroundColor: '#fff', p: 3, borderRadius: '10px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
      <Typography variant="h5" gutterBottom>
        Redes Sociales
      </Typography>

      <TableContainer component={Paper} sx={{ backgroundColor: '#e3f2fd', marginTop: '20px' }}>
  <Table aria-label="tabla de redes sociales">
    <TableHead>
      <TableRow>
        <TableCell
          sx={{
            fontWeight: 'bold',
            backgroundColor: '#1976d2',
            color: '#fff',
            textAlign: 'center',
          }}
        >
          Red Social
        </TableCell>
        <TableCell
          sx={{
            fontWeight: 'bold',
            backgroundColor: '#1976d2',
            color: '#fff',
            textAlign: 'center',
          }}
        >
          Enlace
        </TableCell>
        <TableCell
          align="center"
          sx={{
            fontWeight: 'bold',
            backgroundColor: '#1976d2',
            color: '#fff',
          }}
        >
          Acciones
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell>
          <TextField
            select
            label="Selecciona una red social"
            value={selectedSocial}
            onChange={handleSocialSelect}
            fullWidth
          >
            {availableSocials.map((option) => (
              <MenuItem key={option.name} value={option.name}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </TableCell>
        <TableCell>
          <TextField
            fullWidth
            label={selectedSocial === 'whatsapp' ? 'Número de WhatsApp' : 'Ingresa el enlace de la red social'}
            value={url}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: selectedSocial === 'whatsapp' && (
                <Typography sx={{ color: 'gray' }}>+52</Typography>
              ),
            }}
          />
        </TableCell>
        <TableCell align="center">
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={!selectedSocial || !url}
          >
            Guardar
          </Button>
        </TableCell>
      </TableRow>

      {Object.keys(socialData).map((social) => (
        <TableRow key={social}>
          <TableCell sx={{ textAlign: 'center' }}>
            {availableSocials.find((s) => s.name === social)?.label || social}
          </TableCell>
          <TableCell sx={{ textAlign: 'center' }}>{socialData[social]?.url}</TableCell>
          <TableCell sx={{ textAlign: 'center' }}>
            <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(social)}>
              <EditIcon />
            </IconButton>
            <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(social)}>
              <DeleteIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>

      <Notificaciones
        open={notification.open}
        message={notification.message}
        type={notification.type}
        handleClose={handleCloseNotification}
      />
    </Box>
  );
};


export default RedesSociales;
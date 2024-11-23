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

const availableSocials = [
  { label: 'Facebook', name: 'facebook', type: 'url' },
  { label: 'Twitter', name: 'twitter', type: 'url' },
  { label: 'Instagram', name: 'instagram', type: 'url' },
  { label: 'WhatsApp', name: 'whatsapp', type: 'phone' },
];

const RedesSociales = () => {
  const [socialData, setSocialData] = useState({});
  const [selectedSocial, setSelectedSocial] = useState('');
  const [url, setUrl] = useState('');
  const [isEditing, setIsEditing] = useState(null);

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    type: 'success',
  });

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Obtener datos al cargar el componente
  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const response = await axios.get('https://backendgislive.onrender.com/api/redesSociales/get');
        const data = response.data.reduce((acc, item) => ({ ...acc, [item.nombre_red]: item }), {});
        setSocialData(data);
      } catch (error) {
        console.error('Error al obtener las redes sociales:', error);
        setNotification({
          open: true,
          message: 'Error al obtener las redes sociales.',
          type: 'error',
        });
      }
    };

    fetchSocials();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (selectedSocial === 'whatsapp') {
      setUrl(value.replace(/\D/g, '').slice(0, 10)); // Solo dígitos y máximo 10 caracteres
    } else {
      setUrl(value);
    }
  };

  const handleSocialSelect = (e) => {
    setSelectedSocial(e.target.value);
    setUrl(''); // Limpia el campo al cambiar de red social
  };

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
        message: `La red social ${selectedSocial} ya existe. Puedes editarla.`,
        type: 'warning',
      });
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (validateInput()) {
      try {
        if (isEditing) {
          // Actualizar red social
          await axios.put(`https://backendgislive.onrender.com/api/redesSociales/editar/${isEditing}`, {
            nombre_red: selectedSocial,
            url: selectedSocial === 'whatsapp' ? `+52${url}` : url,
          });
          setSocialData({
            ...socialData,
            [selectedSocial]: { ...socialData[selectedSocial], url: selectedSocial === 'whatsapp' ? `+52${url}` : url },
          });
          setNotification({ open: true, message: 'Red social actualizada.', type: 'success' });
        } else {
          // Crear nueva red social
          const response = await axios.post('https://backendgislive.onrender.com/api/redesSociales/nuevo', {
            nombre_red: selectedSocial,
            url: selectedSocial === 'whatsapp' ? `+52${url}` : url,
          });
          setSocialData({ ...socialData, [selectedSocial]: response.data });
          setNotification({ open: true, message: 'Red social agregada.', type: 'success' });
        }
        setSelectedSocial('');
        setUrl('');
        setIsEditing(null);
      } catch (error) {
        console.error('Error al guardar la red social:', error);
        setNotification({ open: true, message: 'Error al guardar la red social.', type: 'error' });
      }
    }
  };

  const handleDelete = async (social) => {
    try {
      const id = socialData[social]?.id;
      await axios.delete(`https://backendgislive.onrender.com/api/redesSociales/eliminar/${id}`);
      const updatedData = { ...socialData };
      delete updatedData[social];
      setSocialData(updatedData);
      setNotification({ open: true, message: 'Red social eliminada.', type: 'success' });
    } catch (error) {
      console.error('Error al eliminar la red social:', error);
      setNotification({ open: true, message: 'Error al eliminar la red social.', type: 'error' });
    }
  };

  const handleEdit = (social) => {
    setIsEditing(socialData[social]?.id);
    setSelectedSocial(social);
    setUrl(socialData[social]?.url.replace('+52', ''));
  };

  return (
    <Box
      sx={{
        mt: 4,
        backgroundColor: '#fff',
        p: 3,
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Redes Sociales
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
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
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label={selectedSocial === 'whatsapp' ? 'Número de WhatsApp' : 'Enlace'}
            value={url}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: selectedSocial === 'whatsapp' && (
                <Typography sx={{ color: 'gray', mr: 1 }}>+52</Typography>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={!selectedSocial || !url}
          >
            Guardar
          </Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper} sx={{ backgroundColor: '#e3f2fd', marginTop: '20px' }}>
        <Table aria-label="tabla de redes">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: '#fff', textAlign: 'center' }}>
                Red social
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: '#fff', textAlign: 'center' }}>
                Enlace
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: '#fff', textAlign: 'center' }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(socialData).map((social) => (
              <TableRow key={social}>
                <TableCell>{availableSocials.find((s) => s.name === social)?.label || social}</TableCell>
                <TableCell>{socialData[social]?.url}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleEdit(social)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(social)}>
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

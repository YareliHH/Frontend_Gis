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
  
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    type: 'success',  
  });

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const response = await axios.get('https://backendgislive.onrender.com/api/redesSociales/get');
        setSocialData(response.data.reduce((acc, item) => ({ ...acc, [item.nombre_red]: item }), {})); 
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

  const validateInput = () => {
    if (!url) {
      setNotification({
        open: true,
        message: 'Por favor, ingresa un enlace',
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

  const handleSave = async () => {
    if (validateInput()) {
      try {
        if (isEditing !== null) {
          await axios.put(`https://backendgislive.onrender.com/api/redesSociales/editar/${isEditing}`, {
            nombre_red: selectedSocial,
            url: selectedSocial === 'whatsapp' ? `+52${url}` : url,
          });
          setSocialData({ ...socialData, [selectedSocial]: { ...socialData[selectedSocial], url: `+52${url}` } });
          setIsEditing(null);
          setNotification({
            open: true,
            message: 'Red social actualizada.',
            type: 'success',
          });
        } else {
          const response = await axios.post('https://backendgislive.onrender.com/api/redesSociales/nuevo', {
            nombre_red: selectedSocial,
            url: selectedSocial === 'whatsapp' ? `+52${url}` : url,
          });
          const newSocial = response.data;
          setSocialData({ ...socialData, [selectedSocial]: newSocial });
          setNotification({
            open: true,
            message: 'Red social agregada.',
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

  const handleEdit = (social) => {
    setIsEditing(socialData[social].id);
    setSelectedSocial(social);
    setUrl(socialData[social].url.replace('+52', '')); 
  };

  return (
    <Box sx={{ mt: 4, backgroundColor: '#fff', p: 3, borderRadius: '10px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
      <Typography variant="h5" align="center" gutterBottom>
        Redes Sociales
      </Typography>

      <Grid container justifyContent="center" spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={5}>
          <TextField
            select
            label="Seleccionar Red Social"
            fullWidth
            value={selectedSocial}
            onChange={handleSocialSelect}
          >
            {availableSocials.map((social) => (
              <MenuItem key={social.name} value={social.name}>
                {social.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={5}>
          <TextField
            label="URL o Número"
            fullWidth
            value={url}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSave}
            startIcon={<SaveIcon />}
          >
            {isEditing ? 'Actualizar' : 'Agregar'}
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ backgroundColor: '#e3f2fd' }}>
        <Table aria-label="tabla de redes sociales">
          <TableHead>
            <TableRow>
              <TableCell align="center">Red Social</TableCell>
              <TableCell align="center">Enlace</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(socialData).map((social) => (
              <TableRow key={social}>
                <TableCell align="center">{availableSocials.find((s) => s.name === social)?.label || social}</TableCell>
                <TableCell align="center">{socialData[social]?.url}</TableCell>
                <TableCell align="center">
                  <IconButton aria-label="edit" onClick={() => handleEdit(social)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton aria-label="delete" onClick={() => handleDelete(social)}>
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

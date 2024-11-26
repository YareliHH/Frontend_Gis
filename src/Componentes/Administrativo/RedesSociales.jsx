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

  const handleCloseNotification = () => setNotification({ ...notification, open: false });

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const response = await axios.get('https://backendgislive.onrender.com/api/obtenerredes');
        setSocialData(
          response.data.reduce((acc, item) => ({ ...acc, [item.nombre_red]: item }), {})
        );
      } catch (error) {
        console.error('Error al obtener las redes sociales:', error);
        setNotification({ open: true, message: 'Error al cargar datos.', type: 'error' });
      }
    };
    fetchSocials();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (selectedSocial === 'whatsapp') {
      setUrl(value.replace(/\D/g, '').slice(0, 10)); // Solo dígitos y 10 caracteres
    } else {
      setUrl(value);
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
        message: 'Por favor, ingresa un enlace o número.',
        type: 'error',
      });
      return false;
    }
    if (socialData[selectedSocial] && !isEditing) {
      setNotification({
        open: true,
        message: `La red social ${selectedSocial} ya existe.`,
        type: 'warning',
      });
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateInput()) return;

    try {
      const formattedUrl = selectedSocial === 'whatsapp' ? `+52${url}` : url;
      if (isEditing) {
        await axios.put(`https://backendgislive.onrender.com/api/editars/${isEditing}`, {
          nombre_red: selectedSocial,
          url: formattedUrl,
        });
        setSocialData({
          ...socialData,
          [selectedSocial]: { ...socialData[selectedSocial], url: formattedUrl },
        });
        setNotification({ open: true, message: 'Red social actualizada.', type: 'success' });
      } else {
        const response = await axios.post('https://backendgislive.onrender.com/api/nuevo_social', {
          nombre_red: selectedSocial,
          url: formattedUrl,
        });
        setSocialData({ ...socialData, [selectedSocial]: response.data });
        setNotification({ open: true, message: 'Red social agregada.', type: 'success' });
      }
      setSelectedSocial('');
      setUrl('');
      setIsEditing(null);
    } catch (error) {
      console.error('Error al guardar:', error);
      setNotification({ open: true, message: 'Error al guardar.', type: 'error' });
    }
  };

  const handleDelete = async (social) => {
    try {
      const id = socialData[social]?.id;
      await axios.delete(`https://backendgislive.onrender.com/api/eliminars/${id}`);
      const updatedData = { ...socialData };
      delete updatedData[social];
      setSocialData(updatedData);
      setNotification({ open: true, message: 'Red social eliminada.', type: 'success' });
    } catch (error) {
      console.error('Error al eliminar:', error);
      setNotification({ open: true, message: 'Error al eliminar.', type: 'error' });
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
        p: 3,
        borderRadius: 2,
        backgroundColor: '#fff',
        boxShadow: 3,
        maxWidth: 600, // Limita el ancho máximo
        mx: 'auto', // Centra horizontalmente
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Redes Sociales
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
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
        <Grid item xs={12} sm={6}>
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
            fullWidth
          >
            Guardar
          </Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Red social</TableCell>
              <TableCell align="center">Enlace</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(socialData).map((social) => (
              <TableRow key={social}>
                <TableCell align="center">
                  {availableSocials.find((s) => s.name === social)?.label || social}
                </TableCell>
                <TableCell align="center">{socialData[social]?.url}</TableCell>
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

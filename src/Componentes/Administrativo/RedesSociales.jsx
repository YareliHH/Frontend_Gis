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
        const response = await axios.get('http://localhost:3001/api/obtenerredes');
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
        await axios.put(`http://localhost:3001/api/editars/${isEditing}`, {
          nombre_red: selectedSocial,
          url: formattedUrl,
        });
        setSocialData({
          ...socialData,
          [selectedSocial]: { ...socialData[selectedSocial], url: formattedUrl },
        });
        setNotification({ open: true, message: 'Red social actualizada.', type: 'success' });
      } else {
        const response = await axios.post('http://localhost:3001/api/nuevo_social', {
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
      await axios.delete(`http://localhost:3001/api/eliminars/${id}`);
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
        borderRadius: 4,
        backgroundColor: 'background.paper',
        boxShadow: 6,
        maxWidth: 800,
        mx: 'auto',
        background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
      }}
    >
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        Redes Sociales
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Selecciona una red social"
            value={selectedSocial}
            onChange={handleSocialSelect}
            fullWidth
            variant="outlined"
            sx={{ backgroundColor: 'background.paper' }}
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
            variant="outlined"
            InputProps={{
              startAdornment: selectedSocial === 'whatsapp' && (
                <Typography sx={{ color: 'text.secondary', mr: 1 }}>+52</Typography>
              ),
            }}
            sx={{ backgroundColor: 'background.paper' }}
          />
        </Grid>
        <Grid item xs={12}>
        <Button
        variant="contained"
        color="primary"
        startIcon={<SaveIcon />}
        onClick={handleSave}
        disabled={!selectedSocial || !url}
        sx={{
          py: 0.75, // Padding vertical reducido
          px: 2, // Padding horizontal reducido
          fontSize: '0.8125rem', // Tamaño de fuente más pequeño
          fontWeight: 'bold',
          boxShadow: 2,
          borderRadius: 2, // Bordes redondeados
          textTransform: 'none', // Evitar que el texto se transforme a mayúsculas
          '&:hover': {
            boxShadow: 4,
            transform: 'scale(1.05)', // Efecto de escala al hacer hover
          },
          transition: 'all 0.2s ease-in-out', // Transición suave
        }}
      >
        Guardar
      </Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper} sx={{ mt: 4, borderRadius: 4, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell align="center" sx={{ color: 'common.white', fontWeight: 'bold' }}>Red social</TableCell>
              <TableCell align="center" sx={{ color: 'common.white', fontWeight: 'bold' }}>Enlace</TableCell>
              <TableCell align="center" sx={{ color: 'common.white', fontWeight: 'bold' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(socialData).map((social) => (
              <TableRow key={social} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
                <TableCell align="center">
                  {availableSocials.find((s) => s.name === social)?.label || social}
                </TableCell>
                <TableCell align="center">{socialData[social]?.url}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleEdit(social)} sx={{ '&:hover': { color: 'primary.main' } }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(social)} sx={{ '&:hover': { color: 'error.main' } }}>
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
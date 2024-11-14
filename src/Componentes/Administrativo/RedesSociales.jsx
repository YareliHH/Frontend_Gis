import React, { useState, useEffect } from 'react';
import { TextField, Grid, Typography, Box, Button, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
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
        message: 'Por favor, ingresa un número.',
        type: 'error',
      });
      return false;
    }

    if (socialData[selectedSocial] && !isEditing) {
      setNotification({
        open: true,
        message: `La red social ${selectedSocial} ya está registrada.`,
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
        message: 'Red social eliminada con éxito.',
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
    <Box
      sx={{
        mt: 4,
        backgroundColor: '#fff',
        p: 3,
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Redes Sociales
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }} justifyContent="center">
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
          label={selectedSocial === 'whatsapp' ? 'Número de WhatsApp' : 'Ingresa el enlace de la red social'}
          value={url}
          onChange={handleInputChange}
          InputProps={{
            startAdornment: selectedSocial === 'whatsapp' && (
              <Typography sx={{ color: 'gray' }}>+52</Typography>
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
            sx={{ mt: 2 }}
          >
            Guardar
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <TableContainer component={Paper} sx={{ maxWidth: 900, backgroundColor: '#f5f5f5', marginTop: 2 }}>
          <Table aria-label="tabla de redes sociales">
            <TableHead>
            <TableRow>
            <TableCell
              sx={{
                fontWeight: 'bold',
                backgroundColor: '#a6cef5',
                color: '#fff',
                textAlign: 'center',
                padding: '16px 24px', // Aumentar el tamaño de la celda
                fontSize: '1.1rem', // Aumentar el tamaño de la fuente
              }}
            >
              Red Social
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 'bold',
                backgroundColor: '#a6cef5',
                color: '#fff',
                textAlign: 'center',
                padding: '16px 24px', // Aumentar el tamaño de la celda
                fontSize: '1.1rem', // Aumentar el tamaño de la fuente
              }}
            >
              Número
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontWeight: 'bold',
                backgroundColor: '#a6cef5',
                color: '#fff',
                padding: '16px 24px', // Aumentar el tamaño de la celda
                fontSize: '1.1rem', // Aumentar el tamaño de la fuente
              }}
            >
              Acciones
            </TableCell>
          </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(socialData).map((social) => (
                <TableRow key={social} sx={{ textAlign: 'center' }}>
                  <TableCell>{availableSocials.find((s) => s.name === social)?.label || social}</TableCell>
                  <TableCell>
                    <a
                      href={socialData[social]?.url.startsWith('http') ? socialData[social]?.url : `tel:+52${socialData[social]?.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#1976d2', textDecoration: 'none' }}
                    >
                      {socialData[social]?.url}
                    </a>
                  </TableCell>
                  <TableCell align="center">
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
      </Box>

      <Notificaciones open={notification.open} message={notification.message} type={notification.type} onClose={handleCloseNotification} />
    </Box>
  );
};

export default RedesSociales;

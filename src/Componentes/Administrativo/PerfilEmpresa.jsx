import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Grid, TextField, Button, InputAdornment, Avatar, InputLabel, Snackbar, Alert, CircularProgress } from '@mui/material';
import { Phone } from '@mui/icons-material';
import axios from 'axios';

const PerfilEmpresa = () => {
    const [perfil, setPerfil] = useState({
        id_empresa: '',
        nombre_empresa: '',
        slogan: '',
        direccion: '',
        correo_electronico: '',
        telefono: '',
        descripcion: '',
        titulo_pagina: '',
        logo: null,
    });
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState(null);
    const [formError, setFormError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        const fetchPerfil = async () => {
            try {
                const response = await axios.get('https://backendgislive.onrender.com/api/perfil_empresa/get');
                setPerfil(response.data[0]); 
            } catch (error) {
                console.error('Error al obtener el perfil de la empresa:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPerfil();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPerfil((prevPerfil) => ({
            ...prevPerfil,
            [name]: value,
        }));
    };

    const handleLogoChange = (e) => {
        setFile(e.target.files[0]);
    };

    const validateForm = () => {
        if (!perfil.nombre_empresa || !perfil.correo_electronico) {
            setFormError('Los campos "Nombre de Empresa" y "Correo Electrónico" son obligatorios.');
            return false;
        }

        if (file && file.size > 2 * 1024 * 1024) {
            setFormError('El tamaño del archivo de logo no puede ser mayor a 2MB.');
            return false;
        }

        setFormError(null); // Reset error if all validations pass
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const formData = new FormData();
        for (const key in perfil) {
            formData.append(key, perfil[key]);
        }
        if (file) {
            formData.append('logo', file);
        }

        try {
            setLoading(true);
            if (perfil.id_empresa) {
                // Actualización del perfil existente
                await axios.put('https://backendgislive.onrender.com/api/updateDatos', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setSnackbarMessage('Perfil de empresa actualizado con éxito');
                setSnackbarSeverity('success');
            } else {
                // Creación de un nuevo perfil
                await axios.post('https://backendgislive.onrender.com/api/perfil', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setSnackbarMessage('Perfil de empresa agregado con éxito');
                setSnackbarSeverity('success');
            }
            setOpenSnackbar(true);
            // Actualiza el estado de perfil con los datos guardados
            setPerfil(prevState => ({
                ...prevState,
                id_empresa: perfil.id_empresa || 'Nuevo ID',  // Si no hay id_empresa, asignamos un valor por defecto.
                logo: URL.createObjectURL(file) || perfil.logo, // Para mostrar el logo recién cargado
            }));
        } catch (error) {
            console.error('Error al guardar el perfil de la empresa:', error);
            setSnackbarMessage('Error al guardar el perfil de la empresa.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </div>
        );
    }

    return (
        <Container maxWidth="sm">
          <Box sx={{ padding: 4, backgroundColor: '#f9f9f9', borderRadius: 2, boxShadow: 3, marginTop: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
              Perfil de Empresa
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nombre de Empresa"
                    name="nombre_empresa"
                    value={perfil.nombre_empresa}
                    onChange={handleChange}
                    required
                    error={!!formError}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Dirección"
                    name="direccion"
                    value={perfil.direccion}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Teléfono"
                    name="telefono"
                    value={perfil.telefono}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Correo Electrónico"
                    name="correo_electronico"
                    value={perfil.correo_electronico}
                    onChange={handleChange}
                    type="email"
                    required
                    error={!!formError}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Descripción"
                    name="descripcion"
                    value={perfil.descripcion}
                    onChange={handleChange}
                    multiline
                    rows={4}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Slogan"
                    name="slogan"
                    value={perfil.slogan}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Título de Página"
                    name="titulo_pagina"
                    value={perfil.titulo_pagina}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel>Selecciona un archivo de imagen</InputLabel>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                </Grid>
                {perfil.logo && (
                  <Grid item xs={12}>
                    <Typography>Logo Actual</Typography>
                    <Avatar
                      src={perfil.logo}
                      alt="Logo de la Empresa"
                      style={{ width: '150px', height: 'auto', margin: '10px auto' }}
                    />
                  </Grid>
                )}
              </Grid>
              <Box mt={4}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Guardar Perfil
                </Button>
              </Box>
            </form>

            {/* Mostrar los datos guardados */}
            <Box sx={{ marginTop: 4 }}>
              <Typography variant="h6">Datos Guardados:</Typography>
              <Typography><strong>Nombre de Empresa:</strong> {perfil.nombre_empresa}</Typography>
              <Typography><strong>Dirección:</strong> {perfil.direccion}</Typography>
              <Typography><strong>Teléfono:</strong> {perfil.telefono}</Typography>
              <Typography><strong>Correo Electrónico:</strong> {perfil.correo_electronico}</Typography>
              <Typography><strong>Descripción:</strong> {perfil.descripcion}</Typography>
              <Typography><strong>Slogan:</strong> {perfil.slogan}</Typography>
              <Typography><strong>Título de Página:</strong> {perfil.titulo_pagina}</Typography>
              {perfil.logo && (
                <Box mt={2}>
                  <Typography><strong>Logo:</strong></Typography>
                  <Avatar
                    src={perfil.logo}
                    alt="Logo de la Empresa"
                    style={{ width: '150px', height: 'auto' }}
                  />
                </Box>
              )}
            </Box>

            {/* Snackbar for notifications */}
            <Snackbar
              open={openSnackbar}
              autoHideDuration={6000}
              onClose={() => setOpenSnackbar(false)}
            >
              <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </Box>
        </Container>
    );
};

export default PerfilEmpresa;

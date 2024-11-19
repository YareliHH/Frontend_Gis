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

    // Validaciones del formulario
    const validateForm = () => {
        const nameRegex = /^[a-zA-Z0-9\s\-']{3,100}$/;
        const addressRegex = /^[a-zA-Z0-9\s,.-/#]{0,200}$/;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^\d{10}$/;
        const titleRegex = /^[a-zA-Z0-9\s]{5,60}$/;

        // Validación de Nombre de Empresa
        if (!perfil.nombre_empresa || !nameRegex.test(perfil.nombre_empresa)) {
            setFormError('El nombre de la empresa debe tener entre 3 y 100 caracteres y solo puede contener letras, números, espacios y ciertos caracteres especiales.');
            return false;
        }

        // Validación de Correo Electrónico
        if (!perfil.correo_electronico || !emailRegex.test(perfil.correo_electronico)) {
            setFormError('Por favor, introduce un correo electrónico válido.');
            return false;
        }

        // Validación de Teléfono
        if (perfil.telefono && !phoneRegex.test(perfil.telefono)) {
            setFormError('El teléfono debe ser un número válido de 10 dígitos.');
            return false;
        }

        // Validación de Dirección
        if (perfil.direccion && !addressRegex.test(perfil.direccion)) {
            setFormError('La dirección contiene caracteres no permitidos o excede los 200 caracteres.');
            return false;
        }

        // Validación de Título de Página
        if (perfil.titulo_pagina && !titleRegex.test(perfil.titulo_pagina)) {
            setFormError('El título de la página debe tener entre 5 y 60 caracteres y solo puede contener letras, números y espacios.');
            return false;
        }

        // Validación del Tamaño del Archivo
        if (file && file.size > 2 * 1024 * 1024) {
            setFormError('El tamaño del archivo de logo no puede ser mayor a 2MB.');
            return false;
        }

        // Si todas las validaciones pasan
        setFormError(null);
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
            setPerfil((prevState) => ({
                ...prevState,
                id_empresa: perfil.id_empresa || 'Nuevo ID',
                logo: file ? URL.createObjectURL(file) : perfil.logo,
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
                        {/* Campos del formulario */}
                    </Grid>
                    <Box mt={4}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Guardar Perfil
                        </Button>
                    </Box>
                </form>

                {/* Snackbar para notificaciones */}
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

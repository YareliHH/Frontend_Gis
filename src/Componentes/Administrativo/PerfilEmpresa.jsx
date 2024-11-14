import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
    Avatar,
    InputLabel,
    CircularProgress,
    Snackbar,
    Alert,
} from '@mui/material';

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
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>Perfil de Empresa</Typography>
            <form onSubmit={handleSubmit}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Nombre de Empresa</TableCell>
                                <TableCell>
                                    <TextField
                                        fullWidth
                                        name="nombre_empresa"
                                        value={perfil.nombre_empresa}
                                        onChange={handleChange}
                                        required
                                        error={!!formError}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Dirección</TableCell>
                                <TableCell>
                                    <TextField
                                        fullWidth
                                        name="direccion"
                                        value={perfil.direccion}
                                        onChange={handleChange}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Teléfono</TableCell>
                                <TableCell>
                                    <TextField
                                        fullWidth
                                        name="telefono"
                                        value={perfil.telefono}
                                        onChange={handleChange}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Correo Electrónico</TableCell>
                                <TableCell>
                                    <TextField
                                        fullWidth
                                        name="correo_electronico"
                                        value={perfil.correo_electronico}
                                        onChange={handleChange}
                                        required
                                        type="email"
                                        error={!!formError}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Descripción</TableCell>
                                <TableCell>
                                    <TextField
                                        fullWidth
                                        name="descripcion"
                                        value={perfil.descripcion}
                                        onChange={handleChange}
                                        multiline
                                        rows={4}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Slogan</TableCell>
                                <TableCell>
                                    <TextField
                                        fullWidth
                                        name="slogan"
                                        value={perfil.slogan}
                                        onChange={handleChange}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Título de Página</TableCell>
                                <TableCell>
                                    <TextField
                                        fullWidth
                                        name="titulo_pagina"
                                        value={perfil.titulo_pagina}
                                        onChange={handleChange}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Logo</TableCell>
                                <TableCell>
                                    <InputLabel>Selecciona un archivo de imagen</InputLabel>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                    />
                                </TableCell>
                            </TableRow>
                            {perfil.logo && (
                                <TableRow>
                                    <TableCell>Logo Actual</TableCell>
                                    <TableCell>
                                        <Avatar
                                            src={perfil.logo}
                                            alt="Logo de la Empresa"
                                            style={{ width: '150px', height: 'auto', margin: '10px auto' }}
                                        />
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    style={{ marginTop: '20px' }}
                >
                    Guardar Perfil
                </Button>
            </form>

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
        </Container>
    );
};

export default PerfilEmpresa;

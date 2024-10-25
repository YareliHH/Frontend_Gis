import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Avatar, IconButton, InputLabel } from '@mui/material';
import { Facebook, Instagram } from '@mui/icons-material';

const PerfilEmpresa = () => {
    const [perfil, setPerfil] = useState({
        id_empresa: '',
        nombre_empresa: '',
        slogan: '',
        facebook: '',
        instagram: '',
        direccion: '',
        correo_electronico: '',
        telefono: '',
        descripcion: '',
        titulo_pagina: '',
        logo: null,
    });

    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState(null);

    useEffect(() => {
        const fetchPerfil = async () => {
            try {
                const response = await axios.get('/api/perfil_empresa/get');
                setPerfil(response.data);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in perfil) {
            formData.append(key, perfil[key]);
        }
        if (file) {
            formData.append('logo', file);
        }

        try {
            await axios.put('/api/perfil_empresa/updateDatos', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Perfil de empresa actualizado con éxito');
        } catch (error) {
            console.error('Error al actualizar el perfil de la empresa:', error);
            alert('Error al actualizar el perfil');
        }
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>
                Perfil de Empresa
            </Typography>
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
                                            src={`data:image/png;base64,${perfil.logo}`}
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
                    Actualizar Perfil
                </Button>
            </form>
        </Container>
    );
};

export default PerfilEmpresa;

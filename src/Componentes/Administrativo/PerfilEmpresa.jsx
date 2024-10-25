import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Grid, InputLabel, FormControl, Select, MenuItem, Avatar,} from '@mui/material';

const PerfilEmpresa = () => {
    const [perfil, setPerfil] = useState({
        id_empresa: '',
        nombre_empresa: '',
        direccion: '',
        telefono: '',
        correo_electronico: '',
        descripcion: '',
        logo: null,
        slogan: '',
        titulo_pagina: '',
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
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
                Perfil de Empresa
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Nombre de Empresa"
                            name="nombre_empresa"
                            value={perfil.nombre_empresa}
                            onChange={handleChange}
                            required
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
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Correo Electrónico"
                            name="correo_electronico"
                            value={perfil.correo_electronico}
                            onChange={handleChange}
                            required
                            type="email"
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
                        <InputLabel>Logo</InputLabel>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" type="submit">
                            Actualizar Perfil
                        </Button>
                    </Grid>
                </Grid>
            </form>
            {perfil.logo && (
                <Grid item xs={12} style={{ marginTop: '20px', textAlign: 'center' }}>
                    <Typography variant="h6">Logo Actual:</Typography>
                    <Avatar
                        src={`data:image/png;base64,${perfil.logo}`}
                        alt="Logo de la Empresa"
                        style={{ width: '150px', height: 'auto', margin: '10px auto' }}
                    />
                </Grid>
            )}
        </Container>
    );
};

export default PerfilEmpresa;

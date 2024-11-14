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
            if (perfil.id_empresa) {
                // Actualización del perfil existente
                await axios.put('https://backendgislive.onrender.com/api/updateDatos', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                alert('Perfil de empresa actualizado con éxito');
            } else {
                // Creación de un nuevo perfil
                await axios.post('https://backendgislive.onrender.com/api/perfil', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                alert('Perfil de empresa agregado con éxito');
            }
        } catch (error) {
            console.error('Error al guardar el perfil de la empresa:', error);
            alert(error.response?.data || 'Error al guardar el perfil');
        }
    };

    if (loading) {
        return <div>Cargando...</div>;
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
            {/* Tabla para visualizar los datos de la empresa */}
            <Typography variant="h5" gutterBottom style={{ marginTop: '30px' }}>Datos de la Empresa</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableBody>
                        {perfil && (
                            <>
                                <TableRow>
                                    <TableCell>Nombre de Empresa</TableCell>
                                    <TableCell>{perfil.nombre_empresa}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Dirección</TableCell>
                                    <TableCell>{perfil.direccion}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Teléfono</TableCell>
                                    <TableCell>{perfil.telefono}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Correo Electrónico</TableCell>
                                    <TableCell>{perfil.correo_electronico}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Descripción</TableCell>
                                    <TableCell>{perfil.descripcion}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Slogan</TableCell>
                                    <TableCell>{perfil.slogan}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Título de Página</TableCell>
                                    <TableCell>{perfil.titulo_pagina}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Logo</TableCell>
                                    <TableCell>
                                        {perfil.logo ? (
                                            <Avatar
                                                src={perfil.logo}
                                                alt="Logo de la Empresa"
                                                style={{ width: '150px', height: 'auto', margin: '10px auto' }}
                                            />
                                        ) : (
                                            'No hay logo disponible'
                                        )}
                                    </TableCell>
                                </TableRow>
                            </>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default PerfilEmpresa;

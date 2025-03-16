import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    IconButton,
    Tooltip
} from '@mui/material';
import { Delete } from '@mui/icons-material';

const ContactanosAdmin = () => {
    const [mensajes, setMensajes] = useState([]);

    // Obtener los mensajes desde el backend
    const fetchMensajes = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/contactos');
            setMensajes(response.data);
        } catch (error) {
            console.error('Error al obtener los mensajes:', error.response?.data || error.message);
        }
    };

    useEffect(() => {
        fetchMensajes();
    }, []);

    // Eliminar un mensaje
    const eliminarMensaje = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este mensaje?')) {
            try {
                // Realizar la eliminación usando axios
                await axios.delete(`http://localhost:3001/api/contacto/${id}`);
                
                // Filtrar el mensaje eliminado de la lista y actualizar el estado
                setMensajes(mensajes.filter(mensaje => mensaje.id !== id));

                // Notificación de éxito en la consola
                console.log(`Mensaje con ID ${id} eliminado exitosamente.`);
            } catch (error) {
                // Manejo de errores con notificación en la consola
                console.error('Error al eliminar el mensaje:', error.response?.data || error.message);
            }
        }
    };

    return (
        <Box sx={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <Paper sx={{ width: '80%', padding: 1, marginBottom: 2, backgroundColor: '#e3f2fd', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold', color: '#1976d2', fontSize: '1rem' }}>
                    Mensajes Recibidos
                </Typography>
            </Paper>

            <TableContainer
                component={Paper}
                sx={{
                    boxShadow: '0px 4px 20px rgba(84, 82, 209, 0.1)',
                    borderRadius: '10px',
                    width: '80%',
                    maxWidth: '1200px', // Limitar el tamaño máximo de la tabla
                }}
            >
                <Table>
                    <TableHead sx={{ backgroundColor: '#4585f5' }}>
                        <TableRow>
                            <TableCell sx={{ color: '#ffffff' }}>ID</TableCell>
                            <TableCell sx={{ color: '#ffffff' }}>Nombre</TableCell>
                            <TableCell sx={{ color: '#ffffff' }}>Correo</TableCell>
                            <TableCell sx={{ color: '#ffffff' }}>Teléfono</TableCell>
                            <TableCell sx={{ color: '#ffffff' }}>Mensaje</TableCell>
                            <TableCell sx={{ color: '#ffffff' }}>Fecha de Creación</TableCell>
                            <TableCell sx={{ color: '#ffffff' }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mensajes.map((mensaje) => (
                            <TableRow
                                key={mensaje.id}
                                sx={{
                                    '&:nth-of-type(odd)': { backgroundColor: '#F9FDFF' },
                                    '&:hover': { backgroundColor: '#E5F3FD' },
                                    transition: 'background-color 0.2s',
                                }}
                            >
                                <TableCell>{mensaje.id}</TableCell>
                                <TableCell>{mensaje.nombre}</TableCell>
                                <TableCell>{mensaje.correo}</TableCell>
                                <TableCell>{mensaje.telefono}</TableCell>
                                <TableCell>{mensaje.mensaje}</TableCell>
                                <TableCell>{new Date(mensaje.fecha_creacion).toLocaleString()}</TableCell>
                                <TableCell>
                                    <Tooltip title="Eliminar">
                                        <IconButton color="error" onClick={() => eliminarMensaje(mensaje.id)}>
                                            <Delete />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ContactanosAdmin;

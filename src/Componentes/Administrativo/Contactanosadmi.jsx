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
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Snackbar,
    Alert,
    TablePagination
} from '@mui/material';
import { 
    Delete as DeleteIcon, 
    Visibility as VisibilityIcon 
} from '@mui/icons-material';

const ContactanosAdmin = () => {
    const [mensajes, setMensajes] = useState([]);
    const [selectedMensaje, setSelectedMensaje] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    // Pagination states
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Obtener los mensajes desde el backend
    const fetchMensajes = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/contactos');
            setMensajes(response.data);
        } catch (error) {
            handleError('Error al obtener los mensajes', error);
        }
    };

    useEffect(() => {
        fetchMensajes();
    }, []);

    // Manejo de errores centralizado
    const handleError = (message, error) => {
        console.error(message, error.response?.data || error.message);
        setSnackbarMessage(message);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
    };

    // Eliminar un mensaje
    const eliminarMensaje = async () => {
        if (!selectedMensaje) return;

        try {
            await axios.delete(`http://localhost:3001/api/contacto/${selectedMensaje.id}`);
            
            // Actualizar lista de mensajes
            setMensajes(mensajes.filter(mensaje => mensaje.id !== selectedMensaje.id));
            
            // Cerrar diálogo y mostrar notificación
            setDeleteDialogOpen(false);
            setSnackbarMessage('Mensaje eliminado exitosamente');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            handleError('Error al eliminar el mensaje', error);
        }
    };

    // Abrir diálogo de confirmación de eliminación
    const handleDeleteClick = (mensaje) => {
        setSelectedMensaje(mensaje);
        setDeleteDialogOpen(true);
    };

    // Abrir diálogo de detalles
    const handleViewDetails = (mensaje) => {
        setSelectedMensaje(mensaje);
        setDetailDialogOpen(true);
    };

    // Manejar cambio de página
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Manejar cambio de filas por página
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Cerrar Snackbar
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    return (
        <Box sx={{ 
            padding: '20px', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            flexDirection: 'column',
            backgroundColor: '#f4f6f8'
        }}>
            <Paper sx={{ 
                width: '90%', 
                padding: 2, 
                marginBottom: 2, 
                backgroundColor: '#e3f2fd', 
                borderRadius: 2 
            }}>
                <Typography 
                    variant="h4" 
                    sx={{ 
                        textAlign: 'center', 
                        fontWeight: 'bold', 
                        color: '#1976d2' 
                    }}
                >
                    Bandeja de Mensajes de Contacto
                </Typography>
            </Paper>

            <TableContainer
                component={Paper}
                sx={{
                    width: '90%',
                    maxWidth: '1200px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    borderRadius: '12px',
                }}
            >
                <Table>
                    <TableHead sx={{ backgroundColor: '#4585f5' }}>
                        <TableRow>
                            {['id', 'Nombre', 'Correo', 'Teléfono', 'Mensaje', 'Fecha', 'Acciones'].map((header) => (
                                <TableCell 
                                    key={header} 
                                    sx={{ 
                                        color: '#ffffff', 
                                        fontWeight: 'bold',
                                        textAlign: header === 'Acciones' ? 'center' : 'left'
                                    }}
                                >
                                    {header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0
                            ? mensajes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : mensajes
                        ).map((mensaje) => (
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
                                <TableCell>
                                    {mensaje.mensaje.length > 30 
                                        ? `${mensaje.mensaje.substring(0, 30)}...` 
                                        : mensaje.mensaje}
                                </TableCell>
                                <TableCell>
                                    {new Date(mensaje.fecha_creacion).toLocaleString()}
                                </TableCell>
                                <TableCell align="center">
                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <Tooltip title="Ver Detalles">
                                            <IconButton 
                                                color="primary" 
                                                onClick={() => handleViewDetails(mensaje)}
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Eliminar">
                                            <IconButton 
                                                color="error" 
                                                onClick={() => handleDeleteClick(mensaje)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={mensajes.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            {/* Diálogo de Eliminación */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Estás seguro de que deseas eliminar el mensaje de {selectedMensaje?.nombre}?
                        Esta acción no se puede deshacer.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
                        Cancelar
                    </Button>
                    <Button 
                        onClick={eliminarMensaje} 
                        color="error" 
                        variant="contained"
                        startIcon={<DeleteIcon />}
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Diálogo de Detalles */}
            <Dialog
                open={detailDialogOpen}
                onClose={() => setDetailDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Detalles del Mensaje</DialogTitle>
                <DialogContent>
                    {selectedMensaje && (
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: 2,
                            padding: 2
                        }}>
                            <Typography><strong>Nombre:</strong> {selectedMensaje.nombre}</Typography>
                            <Typography><strong>Correo:</strong> {selectedMensaje.correo}</Typography>
                            <Typography><strong>Teléfono:</strong> {selectedMensaje.telefono}</Typography>
                            <Typography><strong>Mensaje:</strong> {selectedMensaje.mensaje}</Typography>
                            <Typography>
                                <strong>Fecha de Creación:</strong> {new Date(selectedMensaje.fecha_creacion).toLocaleString()}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDetailDialogOpen(false)} color="primary">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar de Notificaciones */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={handleSnackbarClose} 
                    severity={snackbarSeverity} 
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ContactanosAdmin;
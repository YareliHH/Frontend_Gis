import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const Ventas = () => {
    const [ventas, setVentas] = useState([]);
    const [venta, setVenta] = useState({
        id_producto: '',
        cantidad: '',
        precio_unitario: '',
        total: '',
        fecha: '',
        metodo_pago: '',
    });
    const [editing, setEditing] = useState(false);
    const [id, setId] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        fetchVentas();
    }, []);

    const fetchVentas = async () => {
        try {
            const response = await axios.get('http://localhost:3000/ventas');
            setVentas(response.data);
        } catch (error) {
            console.error('Error fetching ventas:', error);
        }
    };

    const fetchVenta = async (id) => {
        try {
            const response = await axios.get(`http://localhost:3000/ventas/${id}`);
            setVenta(response.data);
            setEditing(true);
            setId(id);
            setOpenDialog(true);
        } catch (error) {
            console.error('Error fetching venta:', error);
        }
    };

    const createVenta = async () => {
        try {
            const response = await axios.post('http://localhost:3000/registrar', venta);
            setVentas([...ventas, response.data]);
            handleCloseDialog();
        } catch (error) {
            console.error('Error creating venta:', error);
        }
    };

    const updateVenta = async () => {
        try {
            await axios.put(`http://localhost:3000/actualizar/${id}`, venta);
            setVentas(ventas.map(v => (v.id === id ? venta : v)));
            handleCloseDialog();
        } catch (error) {
            console.error('Error updating venta:', error);
        }
    };

    const deleteVenta = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/eliminar/${id}`);
            setVentas(ventas.filter(v => v.id !== id));
        } catch (error) {
            console.error('Error deleting venta:', error);
        }
    };

    const handleChange = (e) => {
        setVenta({
            ...venta,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editing) {
            updateVenta();
        } else {
            createVenta();
        }
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setVenta({
            id_producto: '',
            cantidad: '',
            precio_unitario: '',
            total: '',
            fecha: '',
            metodo_pago: '',
        });
        setEditing(false);
        setId(null);
    };

    const isFormValid = () => {
        return (
            venta.id_producto.trim() !== '' &&
            venta.cantidad.trim() !== '' &&
            venta.precio_unitario.trim() !== '' &&
            venta.total.trim() !== '' &&
            venta.fecha.trim() !== '' &&
            venta.metodo_pago.trim() !== ''
        );
    };

    return (
        <Box sx={{ padding: { xs: 2, sm: 3 } /* Ajuste de padding para móviles */ }}>
            <Typography
                variant="h4"
                gutterBottom
                sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } /* Tamaño de fuente responsivo */ }}
            >
                Ventas
            </Typography>

            {/* Botón para agregar venta */}
            <Button
                variant="contained"
                color="primary"
                onClick={handleOpenDialog}
                sx={{ mb: 2, fontSize: { xs: '0.8rem', sm: '1rem' } /* Tamaño responsivo */ }}
            >
                Agregar Venta
            </Button>

            {/* Diálogo para agregar/editar venta */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                fullWidth
                maxWidth="sm" /* Máximo ancho para pantallas pequeñas */
                sx={{ '& .MuiDialog-paper': { width: { xs: '90%', sm: 'auto' } } }}
            >
                <DialogTitle>{editing ? 'Editar Venta' : 'Agregar Venta'}</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="ID Producto"
                            name="id_producto"
                            value={venta.id_producto}
                            onChange={handleChange}
                            required
                            sx={{ mt: 1 }}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Cantidad"
                            name="cantidad"
                            type="number"
                            value={venta.cantidad}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Precio Unitario"
                            name="precio_unitario"
                            type="number"
                            value={venta.precio_unitario}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Total"
                            name="total"
                            type="number"
                            value={venta.total}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Fecha"
                            name="fecha"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={venta.fecha}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Método de Pago"
                            name="metodo_pago"
                            value={venta.metodo_pago}
                            onChange={handleChange}
                            required
                        />
                        <DialogActions sx={{ mt: 2 }}>
                            <Button onClick={handleCloseDialog} size="small">
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={!isFormValid()}
                                size="small"
                            >
                                {editing ? 'Actualizar' : 'Registrar'}
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Tabla de ventas */}
            <TableContainer
                component={Paper}
                sx={{
                    mt: 3,
                    maxHeight: '70vh',
                    overflowX: 'auto' /* Scroll horizontal en móviles */,
                }}
            >
                <Table
                    sx={{
                        minWidth: { xs: 600, sm: 650 } /* Ancho mínimo para scroll en móviles */,
                        '& .MuiTableCell-root': {
                            fontSize: { xs: '0.75rem', sm: '0.875rem' } /* Tamaño de texto responsivo */,
                            padding: { xs: '8px', sm: '16px' } /* Padding ajustado */,
                        },
                    }}
                    stickyHeader
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>ID Producto</TableCell>
                            <TableCell>Cantidad</TableCell>
                            <TableCell>Precio Unitario</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Fecha</TableCell>
                            <TableCell>Método de Pago</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ventas.map((v) => (
                            <TableRow key={v.id}>
                                <TableCell>{v.id_producto}</TableCell>
                                <TableCell>{v.cantidad}</TableCell>
                                <TableCell>{v.precio_unitario}</TableCell>
                                <TableCell>{v.total}</TableCell>
                                <TableCell>{v.fecha}</TableCell>
                                <TableCell>{v.metodo_pago}</TableCell>
                                <TableCell>
                                    <IconButton
                                        color="primary"
                                        onClick={() => fetchVenta(v.id)}
                                        size="small"
                                    >
                                        <Edit fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => deleteVenta(v.id)}
                                        size="small"
                                    >
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Ventas;
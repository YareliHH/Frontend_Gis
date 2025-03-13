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

    // Obtener todas las ventas al cargar el componente
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

    // Obtener una venta por ID
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

    // Registrar una nueva venta
    const createVenta = async () => {
        try {
            const response = await axios.post('http://localhost:3000/registrar', venta);
            setVentas([...ventas, response.data]);
            handleCloseDialog();
        } catch (error) {
            console.error('Error creating venta:', error);
        }
    };

    // Actualizar una venta
    const updateVenta = async () => {
        try {
            await axios.put(`http://localhost:3000/actualizar/${id}`, venta);
            setVentas(ventas.map(v => (v.id === id ? venta : v)));
            handleCloseDialog();
        } catch (error) {
            console.error('Error updating venta:', error);
        }
    };

    // Eliminar una venta
    const deleteVenta = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/eliminar/${id}`);
            setVentas(ventas.filter(v => v.id !== id));
        } catch (error) {
            console.error('Error deleting venta:', error);
        }
    };

    // Manejar cambios en el formulario
    const handleChange = (e) => {
        setVenta({
            ...venta,
            [e.target.name]: e.target.value,
        });
    };

    // Manejar envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        if (editing) {
            updateVenta();
        } else {
            createVenta();
        }
    };

    // Abrir el diálogo para agregar/editar
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    // Cerrar el diálogo y limpiar el formulario
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

    // Verificar si todos los campos están llenos
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
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Ventas
            </Typography>

            {/* Botón para abrir el diálogo de agregar venta */}
            <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                Agregar Venta
            </Button>

            {/* Diálogo para agregar/editar venta */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
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
                        <DialogActions>
                            <Button onClick={handleCloseDialog}>Cancelar</Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={!isFormValid()} // Deshabilitar si el formulario no es válido
                            >
                                {editing ? 'Actualizar' : 'Registrar'}
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Tabla de ventas */}
            <TableContainer component={Paper} sx={{ marginTop: 3 }}>
                <Table>
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
                                    <IconButton color="primary" onClick={() => fetchVenta(v.id)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => deleteVenta(v.id)}>
                                        <Delete />
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
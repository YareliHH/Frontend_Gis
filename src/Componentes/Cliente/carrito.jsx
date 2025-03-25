import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton, 
  Button, 
  CircularProgress, 
  Paper, 
  Container, 
  Alert 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Carrito = ({ usuarioId }) => {
    const [carrito, setCarrito] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Obtener los productos del carrito
    const obtenerCarrito = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/carrito/${usuarioId}`);
            setCarrito(response.data);
        } catch (error) {
            console.error("Error al obtener el carrito:", error);
            setError("Error al obtener el carrito");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerCarrito();
    }, [usuarioId]);

    // Agregar producto al carrito
    const agregarProducto = async (producto_id, cantidad, precio_unitario) => {
        try {
            await axios.post("http://localhost:3001/api/agregar", {
                usuario_id: usuarioId,
                producto_id,
                cantidad,
                precio_unitario
            });
            alert("Producto agregado al carrito");
            obtenerCarrito();
        } catch (error) {
            console.error("Error al agregar producto:", error);
            alert("Error al agregar producto al carrito");
        }
    };

    // Eliminar producto del carrito
    const eliminarProducto = async (producto_id) => {
        try {
            await axios.delete(`http://localhost:3001/api/carrito/eliminar/${usuarioId}/${producto_id}`);
            alert("Producto eliminado");
            obtenerCarrito();
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            alert("Error al eliminar producto");
        }
    };

    // Vaciar carrito
    const vaciarCarrito = async () => {
        try {
            await axios.delete(`http://localhost:3001/api/carrito/vaciar/${usuarioId}`);
            alert("Carrito vaciado");
            obtenerCarrito();
        } catch (error) {
            console.error("Error al vaciar el carrito:", error);
            alert("Error al vaciar el carrito");
        }
    };

    // Calcular total
    const total = carrito.reduce((acc, item) => acc + (item.cantidad * item.precio), 0);

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ 
                padding: 3, 
                marginTop: 4, 
                borderRadius: 2 
            }}>
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: 2 
                }}>
                    <ShoppingCartIcon sx={{ marginRight: 2 }} />
                    <Typography variant="h4" component="h2">
                        Carrito de Compras
                    </Typography>
                </Box>

                {loading ? (
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: 200 
                    }}>
                        <CircularProgress />
                    </Box>
                ) : carrito.length === 0 ? (
                    <Typography variant="body1" color="textSecondary" align="center">
                        El carrito está vacío
                    </Typography>
                ) : (
                    <>
                        <List>
                            {carrito.map((item) => (
                                <ListItem 
                                    key={item.producto_id}
                                    secondaryAction={
                                        <IconButton 
                                            edge="end" 
                                            onClick={() => eliminarProducto(item.producto_id)}
                                            color="error"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                    divider
                                >
                                    <ListItemText
                                        primary={item.nombre}
                                        secondary={`Cantidad: ${item.cantidad} - Precio: $${item.precio.toFixed(2)}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            marginTop: 2 
                        }}>
                            <Typography variant="h6">
                                Total: ${total.toFixed(2)}
                            </Typography>
                            <Button 
                                variant="contained" 
                                color="secondary" 
                                onClick={vaciarCarrito}
                                startIcon={<DeleteIcon />}
                            >
                                Vaciar Carrito
                            </Button>
                        </Box>
                    </>
                )}
            </Paper>
        </Container>
    );
};

export default Carrito;

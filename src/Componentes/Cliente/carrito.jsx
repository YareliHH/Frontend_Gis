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
  Grid,
  Divider,
  Alert,
  useMediaQuery,
  useTheme
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';

const Carrito = () => {
    // State Management
    const [carrito, setCarrito] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [usuarioId, setUsuarioId] = useState(null);

    // Theme and Responsiveness
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Fetch Cart Data
    const fetchCarrito = async () => {
        try {
            const storedUsuarioId = localStorage.getItem('usuario_id');
            if (!storedUsuarioId) {
                setError('Inicia sesión para ver tu carrito');
                setLoading(false);
                return;
            }
            
            setUsuarioId(storedUsuarioId);
            const response = await axios.get(`http://localhost:3001/api/carrito/${storedUsuarioId}`);
            setCarrito(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error al obtener el carrito:", error);
            setError("No se pudo cargar el carrito. Intente de nuevo.");
            setLoading(false);
        }
    };

    // Initial Data Fetch
    useEffect(() => {
        fetchCarrito();
    }, []);

    // Cart Actions
    const agregarProducto = async (producto_id, cantidad, precio_unitario) => {
        try {
            await axios.post("http://localhost:3001/api/agregar", {
                usuario_id: usuarioId,
                producto_id,
                cantidad,
                precio_unitario
            });
            await fetchCarrito();
        } catch (error) {
            console.error("Error al agregar producto:", error);
            setError("No se pudo agregar el producto al carrito.");
        }
    };

    const eliminarProducto = async (producto_id) => {
        try {
            await axios.delete(`http://localhost:3001/api/carrito/eliminar/${usuarioId}/${producto_id}`);
            await fetchCarrito();
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            setError("No se pudo eliminar el producto.");
        }
    };

    const vaciarCarrito = async () => {
        try {
            await axios.delete(`http://localhost:3001/api/carrito/vaciar/${usuarioId}`);
            await fetchCarrito();
        } catch (error) {
            console.error("Error al vaciar el carrito:", error);
            setError("No se pudo vaciar el carrito.");
        }
    };

    // Calculations
    const total = carrito.reduce((acc, item) => acc + (item.cantidad * item.precio), 0);

    // Render Loading State
    if (loading) {
        return (
            <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    // Render Error State
    if (error) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    // Render Login Prompt
    if (!usuarioId) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: 4, 
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2
                    }}
                >
                    <ShoppingCartIcon sx={{ fontSize: 60, color: 'primary.main' }} />
                    <Typography variant="h6" gutterBottom>
                        Por favor inicia sesión para ver tu carrito
                    </Typography>
                    <Button 
                        variant="contained" 
                        color="primary"
                        onClick={() => window.location.href = '/login'}
                        startIcon={<ShoppingCartIcon />}
                    >
                        Ir a Iniciar Sesión
                    </Button>
                </Paper>
            </Container>
        );
    }

    // Main Cart Render
    return (
        <Container 
            maxWidth="md" 
            sx={{ 
                py: { xs: 2, sm: 4 },
                px: { xs: 1, sm: 2 }
            }}
        >
            <Paper elevation={3} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" component="h1">
                        Tu Carrito
                        <ShoppingCartIcon sx={{ ml: 1, verticalAlign: 'middle' }} />
                    </Typography>
                    {carrito.length > 0 && (
                        <Button 
                            variant="outlined" 
                            color="error" 
                            startIcon={<RemoveShoppingCartIcon />}
                            onClick={vaciarCarrito}
                        >
                            Vaciar Carrito
                        </Button>
                    )}
                </Box>

                {carrito.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="h6" color="text.secondary">
                            Tu carrito está vacío
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <List>
                            {carrito.map((item) => (
                                <React.Fragment key={item.producto_id}>
                                    <ListItem 
                                        secondaryAction={
                                            <IconButton 
                                                edge="end" 
                                                aria-label="delete"
                                                onClick={() => eliminarProducto(item.producto_id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemText
                                            primary={item.nombre}
                                            secondary={`Cantidad: ${item.cantidad} | Precio: $${item.precio.toFixed(2)}`}
                                        />
                                        <Typography variant="subtitle1">
                                            ${(item.cantidad * item.precio).toFixed(2)}
                                        </Typography>
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            ))}
                        </List>

                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            mt: 2 
                        }}>
                            <Typography variant="h6">Total:</Typography>
                            <Typography variant="h5" color="primary">
                                ${total.toFixed(2)}
                            </Typography>
                        </Box>

                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                fullWidth
                                size="large"
                            >
                                Proceder al Pago
                            </Button>
                        </Box>
                    </>
                )}
            </Paper>
        </Container>
    );
};

export default Carrito;
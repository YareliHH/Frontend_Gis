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
    const [carrito, setCarrito] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [usuarioId, setUsuarioId] = useState(null);

    // Theme and responsiveness
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchCarrito = async () => {
            try {
                const usuarioId = localStorage.getItem('usuario_id');
                if (!usuarioId) {
                    alert('Inicia sesión para ver tu carrito');
                    setLoading(false);
                    return;
                }
                setUsuarioId(usuarioId);
                const response = await axios.get(`http://localhost:3001/api/carrito/${usuarioId}`);
                setCarrito(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error al obtener el carrito:", error);
                setError("No se pudo cargar el carrito. Intente de nuevo.");
                setLoading(false);
            }
        };

        fetchCarrito();
    }, []);

    // Agregar producto al carrito
    const agregarProducto = async (producto_id, cantidad, precio_unitario) => {
        try {
            await axios.post("http://localhost:3001/api/agregar", {
                usuario_id: usuarioId,
                producto_id,
                cantidad,
                precio_unitario
            });
            fetchCarrito();
        } catch (error) {
            console.error("Error al agregar producto:", error);
            setError("No se pudo agregar el producto al carrito.");
        }
    };

    // Eliminar producto del carrito
    const eliminarProducto = async (producto_id) => {
        try {
            await axios.delete(`http://localhost:3001/api/carrito/eliminar/${usuarioId}/${producto_id}`);
            fetchCarrito();
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            setError("No se pudo eliminar el producto.");
        }
    };

    // Vaciar carrito
    const vaciarCarrito = async () => {
        try {
            await axios.delete(`http://localhost:3001/api/carrito/vaciar/${usuarioId}`);
            fetchCarrito();
        } catch (error) {
            console.error("Error al vaciar el carrito:", error);
            setError("No se pudo vaciar el carrito.");
        }
    };

    // Refactored fetch function to reuse
    const fetchCarrito = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/carrito/${usuarioId}`);
            setCarrito(response.data);
        } catch (error) {
            console.error("Error al obtener el carrito:", error);
            setError("No se pudo cargar el carrito. Intente de nuevo.");
        }
    };

    // Calcular total
    const total = carrito.reduce((acc, item) => acc + (item.cantidad * item.precio), 0);

    if (!usuarioId) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                        Por favor inicia sesión para ver tu carrito
                    </Typography>
                    <Button 
                        variant="contained" 
                        color="primary"
                        onClick={() => window.location.href = '/login'}
                    >
                        Ir a Iniciar Sesión
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container 
            maxWidth="md" 
            sx={{ 
                py: { xs: 2, sm: 4 },
                px: { xs: 1, sm: 2 }
            }}
        >
            {/* ... rest of your existing JSX ... */}
        </Container>
    );
};

export default Carrito;
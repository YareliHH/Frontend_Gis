import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { Delete } from "@mui/icons-material";

const Carrito = () => {
  const usuario_id = 1; // ID del usuario (simulación)
  const [carrito, setCarrito] = useState([]);

  // Obtener los productos del carrito al cargar el componente
  useEffect(() => {
    fetchCarrito();
  }, []);

  const fetchCarrito = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/carrito/${usuario_id}`);
      setCarrito(response.data);
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
    }
  };

  // Agregar un producto al carrito
  const agregarAlCarrito = async (producto_id) => {
    try {
      await axios.post("http://localhost:3000/carrito/agregar", {
        usuario_id,
        producto_id,
      });
      fetchCarrito();
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };

  // Eliminar un producto del carrito
  const eliminarDelCarrito = async (producto_id) => {
    try {
      await axios.delete(`http://localhost:3000/eliminar/${usuario_id}/${producto_id}`);
      fetchCarrito();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  // Vaciar el carrito
  const vaciarCarrito = async () => {
    try {
      await axios.delete(`http://localhost:3000/vaciar/${usuario_id}`);
      setCarrito([]);
    } catch (error) {
      console.error("Error al vaciar el carrito:", error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Carrito de Compras
      </Typography>

      {/* Botón para vaciar el carrito */}
      <Button variant="contained" color="error" onClick={vaciarCarrito} sx={{ marginBottom: 2 }}>
        Vaciar Carrito
      </Button>

      {/* Tabla de productos en el carrito */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Producto</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Fecha Agregado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {carrito.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No hay productos en el carrito
                </TableCell>
              </TableRow>
            ) : (
              carrito.map((producto) => (
                <TableRow key={producto.producto_id}>
                  <TableCell>{producto.producto_id}</TableCell>
                  <TableCell>{producto.nombre}</TableCell>
                  <TableCell>{new Date(producto.fecha_creacion).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => eliminarDelCarrito(producto.producto_id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Carrito;

import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  InputAdornment,
  Avatar,
  InputLabel,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { Phone, Edit, Delete } from "@mui/icons-material";
import axios from "axios";

const PerfilEmpresa = () => {
  const [perfil, setPerfil] = useState({
    nombre_empresa: "",
    logo: null,
    direccion: "",
    telefono: "",
    correo_electronico: "",
    descripcion: "",
    slogan: "",
    titulo_pagina: "",
  });

  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [savedData, setSavedData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null); // Para saber si estamos editando un registro

  // Validación y manejo de los campos (ya incluido en tu código)
  const validateField = (name, value) => {
    // ...
  };

  const handleChange = (e) => {
    // ...
  };

  const handleLogoChange = (e) => {
    // ...
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formValid = true;
    const newErrors = {};
    for (const field in perfil) {
      const error = validateField(field, perfil[field]);
      if (error) {
        formValid = false;
        newErrors[field] = error;
      }
    }
    setErrors(newErrors);

    if (!formValid) return;

    const formData = new FormData();
    for (const key in perfil) {
      formData.append(key, perfil[key]);
    }
    if (file) {
      formData.append("logo", file);
    }

    try {
      if (editingIndex !== null) {
        // Si estamos editando un perfil
        await axios.put(
          `https://backendgislive.onrender.com/api/perfil/${savedData[editingIndex].id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        savedData[editingIndex] = { ...perfil, logo: perfil.logo || "Logo no cargado" };
        setSnackbarMessage("Perfil de empresa actualizado con éxito");
      } else {
        // Si estamos creando un nuevo perfil
        await axios.post(
          "https://backendgislive.onrender.com/api/perfil",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setSavedData((prevData) => [
          ...prevData,
          { ...perfil, logo: perfil.logo || "Logo no cargado" },
        ]);
        setSnackbarMessage("Perfil de empresa guardado con éxito");
      }
      setSnackbarSeverity("success");
    } catch (error) {
      console.error("Error al guardar el perfil de la empresa:", error);
      setSnackbarMessage("Error al guardar el perfil de la empresa.");
      setSnackbarSeverity("error");
    } finally {
      setOpenSnackbar(true);
      setEditingIndex(null); // Resetear el índice de edición
    }
  };

  // Función para editar un perfil
  const handleEdit = (index) => {
    const perfilToEdit = savedData[index];
    setPerfil(perfilToEdit); // Llenar el formulario con los datos del perfil
    setEditingIndex(index); // Marcar que estamos editando este perfil
  };

  // Función para eliminar un perfil
  const handleDelete = async (index) => {
    const idToDelete = savedData[index].id; // Asumiendo que cada perfil tiene un `id`
    try {
      await axios.delete(`https://backendgislive.onrender.com/api/perfil/${idToDelete}`);
      setSavedData((prevData) => prevData.filter((_, i) => i !== index)); // Eliminar el perfil del estado
      setSnackbarMessage("Perfil de empresa eliminado con éxito");
      setSnackbarSeverity("success");
    } catch (error) {
      console.error("Error al eliminar el perfil:", error);
      setSnackbarMessage("Error al eliminar el perfil.");
      setSnackbarSeverity("error");
    } finally {
      setOpenSnackbar(true);
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          padding: 5,
          backgroundColor: "#f9f9f9",
          borderRadius: 2,
          boxShadow: 3,
          marginTop: 4,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Perfil de Empresa
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Campos de formulario (nombre, dirección, etc.) */}
            {/* ... */}

            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                {editingIndex !== null ? "Actualizar Perfil" : "Guardar Perfil"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>

      {/* Tabla de datos guardados */}
      <TableContainer component={Paper} sx={{ backgroundColor: '#e3f2fd', marginTop: '20px' }}>
        <Table aria-label="tabla de perfil de empresa">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: '#fff', textAlign: 'center' }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: '#fff', textAlign: 'center' }}>Dirección</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: '#fff', textAlign: 'center' }}>Teléfono</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: '#fff', textAlign: 'center' }}>Correo</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: '#fff', textAlign: 'center' }}>Slogan</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: '#fff', textAlign: 'center' }}>Título</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: '#fff', textAlign: 'center' }}>Descripción</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: '#fff', textAlign: 'center' }}>Logo</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: '#fff', textAlign: 'center' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {savedData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.nombre_empresa}</TableCell>
                <TableCell>{item.direccion}</TableCell>
                <TableCell>{item.telefono}</TableCell>
                <TableCell>{item.correo_electronico}</TableCell>
                <TableCell>{item.slogan}</TableCell>
                <TableCell>{item.titulo_pagina}</TableCell>
                <TableCell>{item.descripcion}</TableCell>
                <TableCell>
                  <Avatar src={item.logo} alt="Logo" sx={{ width: 50, height: 50 }} />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(index)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(index)} color="secondary">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar de Confirmación */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PerfilEmpresa;

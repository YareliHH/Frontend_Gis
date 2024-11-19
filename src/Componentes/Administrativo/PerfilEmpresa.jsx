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
} from "@mui/material";
import { Phone } from "@mui/icons-material";
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
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPerfil((prevPerfil) => ({
      ...prevPerfil,
      [name]: value,
    }));
  };

  const handleLogoChange = (e) => {
    setFile(e.target.files[0]);
    setPerfil((prevPerfil) => ({
      ...prevPerfil,
      logo: URL.createObjectURL(e.target.files[0]),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in perfil) {
      formData.append(key, perfil[key]);
    }
    if (file) {
      formData.append("logo", file);
    }

    try {
      await axios.post(
        "https://backendgislive.onrender.com/api/perfil",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSnackbarMessage("Perfil de empresa guardado con éxito");
      setSnackbarSeverity("success");
    } catch (error) {
      console.error("Error al guardar el perfil de la empresa:", error);
      setSnackbarMessage("Error al guardar el perfil de la empresa.");
      setSnackbarSeverity("error");
    } finally {
      setOpenSnackbar(true);
    }
  };

  return (
    <Container maxWidth="xs"> {/* Se reduce el tamaño máximo del contenedor */}
      <Box
        sx={{
          padding: 3,
          backgroundColor: "#f9f9f9",
          borderRadius: 2,
          boxShadow: 3,
          marginTop: 4,
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Perfil de Empresa
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Nombre de Empresa y Logo */}
            <Grid item xs={12} sm={6}>
              <TextField
                size="small"
                fullWidth
                label="Nombre de Empresa"
                name="nombre_empresa"
                value={perfil.nombre_empresa}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ fontSize: "0.8rem" }}>Logo</InputLabel>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                style={{ fontSize: "0.9rem" }}
              />
              {perfil.logo && (
                <Avatar
                  src={perfil.logo}
                  alt="Logo"
                  sx={{ width: 50, height: 50, marginTop: 1 }}
                />
              )}
            </Grid>

            {/* Dirección y Teléfono */}
            <Grid item xs={12} sm={6}>
              <TextField
                size="small"
                fullWidth
                label="Dirección"
                name="direccion"
                value={perfil.direccion}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                size="small"
                fullWidth
                label="Teléfono"
                name="telefono"
                value={perfil.telefono}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Correo Electrónico */}
            <Grid item xs={12}>
              <TextField
                size="small"
                fullWidth
                label="Correo Electrónico"
                name="correo_electronico"
                value={perfil.correo_electronico}
                onChange={handleChange}
                type="email"
                required
              />
            </Grid>

            {/* Slogan y Título de Página */}
            <Grid item xs={12} sm={6}>
              <TextField
                size="small"
                fullWidth
                label="Slogan"
                name="slogan"
                value={perfil.slogan}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                size="small"
                fullWidth
                label="Título de Página"
                name="titulo_pagina"
                value={perfil.titulo_pagina}
                onChange={handleChange}
              />
            </Grid>

            {/* Descripción */}
            <Grid item xs={12}>
              <TextField
                size="small"
                fullWidth
                label="Descripción"
                name="descripcion"
                value={perfil.descripcion}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>

          {/* Botón Guardar */}
          <Box mt={3}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="small"
            >
              Guardar
            </Button>
          </Box>
        </form>

        {/* Snackbar */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity={snackbarSeverity}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default PerfilEmpresa;

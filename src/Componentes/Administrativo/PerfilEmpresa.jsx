import React, { useState, useEffect } from "react";
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
  CircularProgress,
} from "@mui/material";
import { Phone } from "@mui/icons-material";
import axios from "axios";

const PerfilEmpresa = () => {
  const [perfil, setPerfil] = useState({
    id_empresa: "",
    nombre_empresa: "",
    slogan: "",
    direccion: "",
    correo_electronico: "",
    telefono: "",
    descripcion: "",
    titulo_pagina: "",
    logo: null,
  });
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [formError, setFormError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const response = await axios.get(
          "https://backendgislive.onrender.com/api/perfil_empresa/get"
        );
        setPerfil(response.data[0]);
      } catch (error) {
        console.error("Error al obtener el perfil de la empresa:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPerfil();
  }, []);

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

    if (!validateForm()) return;

    const formData = new FormData();
    for (const key in perfil) {
      formData.append(key, perfil[key]);
    }
    if (file) {
      formData.append("logo", file);
    }

    try {
      setLoading(true);
      if (perfil.id_empresa) {
        await axios.put(
          "https://backendgislive.onrender.com/api/updateDatos",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setSnackbarMessage("Perfil de empresa actualizado con éxito");
        setSnackbarSeverity("success");
      } else {
        await axios.post(
          "https://backendgislive.onrender.com/api/perfil",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setSnackbarMessage("Perfil de empresa agregado con éxito");
        setSnackbarSeverity("success");
      }
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error al guardar el perfil de la empresa:", error);
      setSnackbarMessage("Error al guardar el perfil de la empresa.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          padding: 4,
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
            {/* Nombre de Empresa y Logo */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre de Empresa"
                name="nombre_empresa"
                value={perfil.nombre_empresa}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel>Logo de la Empresa</InputLabel>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                style={{ marginBottom: "10px" }}
              />
              {perfil.logo && (
                <Avatar
                  src={perfil.logo}
                  alt="Logo de la Empresa"
                  sx={{
                    width: 100,
                    height: 100,
                    marginTop: 1,
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                />
              )}
            </Grid>

            {/* Dirección */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección"
                name="direccion"
                value={perfil.direccion}
                onChange={handleChange}
              />
            </Grid>

            {/* Teléfono */}
            <Grid item xs={12} sm={6}>
              <TextField
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Correo Electrónico"
                name="correo_electronico"
                value={perfil.correo_electronico}
                onChange={handleChange}
                type="email"
                required
              />
            </Grid>

            {/* Slogan */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Slogan"
                name="slogan"
                value={perfil.slogan}
                onChange={handleChange}
              />
            </Grid>

            {/* Descripción */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                name="descripcion"
                value={perfil.descripcion}
                onChange={handleChange}
                multiline
                rows={4}
              />
            </Grid>

            {/* Título de Página */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Título de Página"
                name="titulo_pagina"
                value={perfil.titulo_pagina}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          {/* Botón Guardar */}
          <Box mt={4}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Guardar Perfil
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

import React, { useState } from "react";
import {Container,Box,Typography,Grid,TextField,Button,InputAdornment,Avatar,InputLabel,Snackbar,Alert,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,} from "@mui/material";
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
  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [savedData, setSavedData] = useState([]); // Para almacenar los datos guardados
  // Función para obtener los datos del backend
  const fetchData = async () => {
    try {
      const response = await axios.get("https://backendgislive.onrender.com/api/perfil_empresa/get");
      setSavedData(response.data); // Guarda los datos en el estado
    } catch (error) {
      console.error("Error al obtener los datos del perfil de empresa:", error);
    }
  };

  // useEffect para cargar los datos al montar el componente
  useEffect(() => {
    fetchData();
  }, []);


  // Validaciones de cada campo
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "nombre_empresa":
        if (!value) {
          error = "El nombre de la empresa es obligatorio.";
        } else if (value.length < 3) {
          error = "El nombre debe tener al menos 3 caracteres.";
        }
        break;

      case "direccion":
        if (value && value.length > 100) {
          error = "La dirección debe ser obligatorio";
        }
        break;

      case "telefono":
        const phoneRegex = /^[0-9]{10}$/;
        if (!value) {
          error = "El teléfono es obligatorio.";
        } else if (!phoneRegex.test(value)) {
          error = "El teléfono debe contener 10 dígitos numéricos.";
        }
        break;

      case "correo_electronico":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          error = "El correo electrónico es obligatorio.";
        } else if (!emailRegex.test(value)) {
          error = "Ingresa un correo electrónico válido.";
        }
        break;

      case "descripcion":
        if (value && value.length > 500) {
          error = "La descripción debe ser obligatoria";
        }
        break;

      case "slogan":
        if (value && value.length > 50) {
          error = "El slogan es obligatoria.";
        }
        break;

      case "titulo_pagina":
        if (!value) {
          error = "El título de la página es obligatorio.";
        } else if (value.length < 2 || value.length > 100) {
          error = "El título es obligatoria";
        }
        break;

      default:
        break;
    }
    return error;
  };

  // Manejo del cambio en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validar el campo actual
    const error = validateField(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));

    setPerfil((prevPerfil) => ({
      ...prevPerfil,
      [name]: value,
    }));
  };

  // Manejo del cambio de logo
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        logo: "El logo no puede exceder los 2 MB.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        logo: "",
      }));
      setFile(file);
      setPerfil((prevPerfil) => ({
        ...prevPerfil,
        logo: URL.createObjectURL(file),
      }));
    }
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar todos los campos antes de enviar
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

    // Crear FormData para el envío de los datos
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
      setSavedData((prevData) => [
        ...prevData,
        { ...perfil, logo: perfil.logo || "Logo no cargado" },
      ]);
    } catch (error) {
      console.error("Error al guardar el perfil de la empresa:", error);
      setSnackbarMessage("Error al guardar el perfil de la empresa.");
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
            {/* Nombre de la Empresa */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre de Empresa"
                name="nombre_empresa"
                value={perfil.nombre_empresa}
                onChange={handleChange}
                error={!!errors.nombre_empresa}
                helperText={errors.nombre_empresa}
                required
              />
            </Grid>

            {/* Dirección */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Dirección"
                name="direccion"
                value={perfil.direccion}
                onChange={handleChange}
                error={!!errors.direccion}
                helperText={errors.direccion}
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
                error={!!errors.telefono}
                helperText={errors.telefono}
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
                error={!!errors.correo_electronico}
                helperText={errors.correo_electronico}
                type="email"
                required
              />
            </Grid>

            {/* Slogan */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Slogan"
                name="slogan"
                value={perfil.slogan}
                onChange={handleChange}
                error={!!errors.slogan}
                helperText={errors.slogan}
              />
            </Grid>

            {/* Título de Página */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Título de Página"
                name="titulo_pagina"
                value={perfil.titulo_pagina}
                onChange={handleChange}
                error={!!errors.titulo_pagina}
                helperText={errors.titulo_pagina}
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
                error={!!errors.descripcion}
                helperText={errors.descripcion}
              />
            </Grid>

            {/* Logo */}
            <Grid item xs={12} sm={6}>
              <InputLabel>Logo</InputLabel>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
              />
              {errors.logo && (
                <Typography color="error" variant="body2">
                  {errors.logo}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Guardar Perfil
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

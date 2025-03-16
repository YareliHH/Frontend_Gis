import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  InputAdornment,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
} from "@mui/material";
import { Phone, AddPhotoAlternate, Person, Edit } from "@mui/icons-material"; // Importa el ícono de edición
import axios from "axios";

const PerfilEmpresa = () => {
  const [perfil, setPerfil] = useState({
    id: null,
    nombre_empresa: "",
    logo: null,
    direccion: "",
    telefono: "",
    correo_electronico: "",
    descripcion: "",
    slogan: "",
  });

  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [savedData, setSavedData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  // Cargar datos existentes al montar el componente
  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/perfil");
        if (response.data.length > 0) {
          const perfilExistente = response.data[0];
          setPerfil({
            ...perfilExistente,
            logo: perfilExistente.logo || null,
          });
          setIsEditing(true);
        }
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
      }
    };
    fetchPerfil();
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
        if (!value) {
          error = "La dirección es obligatoria.";
        } else if (value.length > 100) {
          error = "La dirección no puede exceder los 100 caracteres.";
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
          error = "La descripción no puede exceder los 500 caracteres.";
        }
        break;

      case "slogan":
        if (value && value.length > 50) {
          error = "El slogan no puede exceder los 50 caracteres.";
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

  // Enviar formulario (crear o actualizar)
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
      if (isEditing) {
        // Actualizar perfil existente
        await axios.put(`http://localhost:3001/api/perfil/${perfil.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setSnackbarMessage("Perfil de empresa actualizado con éxito");
      } else {
        // Crear nuevo perfil
        await axios.post("http://localhost:3001/api/perfil", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setSnackbarMessage("Perfil de empresa guardado con éxito");
      }
      setSnackbarSeverity("success");
      setSavedData([perfil]);
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
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            padding: 5,
            backgroundColor: "#f9f9f9",
            borderRadius: 2,
            boxShadow: 3,
            marginTop: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Perfil de Empresa
          </Typography>

          {/* Logo de la Empresa */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 4,
              position: "relative",
            }}
          >
            {perfil.logo ? (
              <>
                <Avatar
                  src={perfil.logo}
                  alt="Logo de la Empresa"
                  sx={{ width: 200, height: 200 }}
                />
                <IconButton
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 1)",
                    },
                  }}
                  component="label"
                >
                  <Edit fontSize="small" />
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                </IconButton>
              </>
            ) : (
              <IconButton
                sx={{
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                  },
                }}
                component="label"
              >
                <AddPhotoAlternate fontSize="large" />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleLogoChange}
                />
              </IconButton>
            )}
          </Box>

          {/* Resto del formulario */}
          <Grid container spacing={3}>
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

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Dirección"
                name="direccion"
                value={perfil.direccion}
                onChange={handleChange}
                error={!!errors.direccion}
                helperText={errors.direccion}
                required
              />
            </Grid>

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
                required
              />
            </Grid>

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

            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                {isEditing ? "Actualizar Perfil" : "Guardar Perfil"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </form>

      {/* Tabla de datos guardados */}
      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Table aria-label="tabla de perfil de empresa">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Slogan</TableCell>
              <TableCell>Descripción</TableCell>
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
                <TableCell>{item.descripcion}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar de Confirmación */}
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
    </Container>
  );
};

export default PerfilEmpresa;
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
  Avatar,
  IconButton,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Phone, Edit } from "@mui/icons-material";
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
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api//perfil_empresa/get");
        if (response.data.length > 0) {
          setPerfil(response.data[0]);
          setIsEditing(true);
        }
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
      }
    };
    fetchPerfil();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPerfil({ ...perfil, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors({ ...errors, logo: "El archivo debe ser una imagen válida (jpg, png, etc.)" });
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB límite
        setErrors({ ...errors, logo: "La imagen no debe exceder los 5MB" });
        return;
      }
      setFile(file);
      setPerfil({ ...perfil, logo: URL.createObjectURL(file) });
      setErrors({ ...errors, logo: "" });
    }
  };

  const validateFields = () => {
    const newErrors = {};

    // Validar nombre de la empresa
    if (!perfil.nombre_empresa.trim()) {
      newErrors.nombre_empresa = "El nombre de la empresa es obligatorio";
    } else if (perfil.nombre_empresa.length < 3) {
      newErrors.nombre_empresa = "El nombre debe tener al menos 3 caracteres";
    } else if (perfil.nombre_empresa.length > 100) {
      newErrors.nombre_empresa = "El nombre no debe exceder los 100 caracteres";
    }

    // Validar dirección
    if (!perfil.direccion.trim()) {
      newErrors.direccion = "La dirección es obligatoria";
    } else if (perfil.direccion.length < 5) {
      newErrors.direccion = "La dirección debe tener al menos 5 caracteres";
    } else if (perfil.direccion.length > 200) {
      newErrors.direccion = "La dirección no debe exceder los 200 caracteres";
    }

    // Validar teléfono
    if (!perfil.telefono.trim()) {
      newErrors.telefono = "El teléfono es obligatorio";
    } else if (!/^\d+$/.test(perfil.telefono)) {
      newErrors.telefono = "El teléfono debe contener solo números";
    } else if (perfil.telefono.length !== 10) {
      newErrors.telefono = "El teléfono debe tener exactamente 10 dígitos";
    }

    // Validar correo electrónico
    if (!perfil.correo_electronico.trim()) {
      newErrors.correo_electronico = "El correo electrónico es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(perfil.correo_electronico)) {
      newErrors.correo_electronico = "El correo electrónico no es válido";
    } else if (perfil.correo_electronico.length > 100) {
      newErrors.correo_electronico = "El correo no debe exceder los 100 caracteres";
    }

    // Validar slogan (opcional)
    if (perfil.slogan && perfil.slogan.length > 100) {
      newErrors.slogan = "El slogan no debe exceder los 100 caracteres";
    }

    // Validar descripción (opcional)
    if (perfil.descripcion && perfil.descripcion.length > 500) {
      newErrors.descripcion = "La descripción no debe exceder los 500 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      setSnackbarMessage("Por favor, corrige los errores en el formulario");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      const formData = new FormData();
      for (const key in perfil) {
        formData.append(key, perfil[key]);
      }
      if (file) {
        formData.append("logo", file);
      }

      if (isEditing) {
        await axios.put(`http://localhost:3001/api/perfiles/${perfil.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setSnackbarMessage("Perfil actualizado con éxito");
      } else {
        await axios.post("http://localhost:3001/api/perfiles", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setSnackbarMessage("Perfil guardado con éxito");
      }
      setSnackbarSeverity("success");
    } catch (error) {
      setSnackbarMessage("Error al guardar el perfil: " + error.message);
      setSnackbarSeverity("error");
    } finally {
      setOpenSnackbar(true);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Card sx={{ borderRadius: 3, boxShadow: 3, backgroundColor: theme.palette.background.paper }}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom color="primary" sx={{ fontWeight: "bold" }}>
            Perfil de Empresa
          </Typography>

          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Avatar src={perfil.logo} sx={{ width: 120, height: 120, margin: "auto", border: `4px solid ${theme.palette.primary.main}` }} />
            <IconButton component="label" color="primary" sx={{ mt: 1 }}>
              <Edit />
              <input type="file" hidden accept="image/*" onChange={handleLogoChange} />
            </IconButton>
            {errors.logo && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {errors.logo}
              </Typography>
            )}
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre de Empresa"
                  name="nombre_empresa"
                  value={perfil.nombre_empresa}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{ mb: 2 }}
                  error={!!errors.nombre_empresa}
                  helperText={errors.nombre_empresa}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Dirección"
                  name="direccion"
                  value={perfil.direccion}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{ mb: 2 }}
                  error={!!errors.direccion}
                  helperText={errors.direccion}
                />
              </Grid>

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
                  required
                  variant="outlined"
                  sx={{ mb: 2 }}
                  error={!!errors.telefono}
                  helperText={errors.telefono}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Correo Electrónico"
                  name="correo_electronico"
                  value={perfil.correo_electronico}
                  onChange={handleChange}
                  type="email"
                  required
                  variant="outlined"
                  sx={{ mb: 2 }}
                  error={!!errors.correo_electronico}
                  helperText={errors.correo_electronico}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Slogan"
                  name="slogan"
                  value={perfil.slogan}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{ mb: 2 }}
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
                  rows={3}
                  variant="outlined"
                  sx={{ mb: 2 }}
                  error={!!errors.descripcion}
                  helperText={errors.descripcion}
                />
              </Grid>

              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ py: 1.5 }}>
                  {isEditing ? "Actualizar Perfil" : "Guardar Perfil"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PerfilEmpresa;
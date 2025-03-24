import React, { useState, useEffect } from "react"; 
import { Avatar, Typography, Button, Grid, TextField, Box, IconButton, Tabs, Tab, InputAdornment } from "@mui/material";
import { CameraAlt, Person, Email, Phone } from "@mui/icons-material";
import axios from "axios";  // Importar axios

const Perfil = () => {
  const [usuario, setUsuario] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    correo: "",
    telefono: "",
    fotoPerfil: null,
  });

  const [editando, setEditando] = useState(false);
  const [datosEditados, setDatosEditados] = useState(usuario);
  const [tabIndex, setTabIndex] = useState(0);
  const [errores, setErrores] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    correo: "",
    telefono: "",
  });

  const historialCompras = [
    { id: 1, producto: "Filipina Clínica Azul", fecha: "10 Feb 2024", precio: "$450" },
    { id: 2, producto: "Pantalón Quirúrgico Verde", fecha: "5 Ene 2024", precio: "$380" },
  ];

  useEffect(() => {
    setDatosEditados(usuario);
  }, [usuario]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setDatosEditados((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const manejarGuardado = () => {
    const erroresTemp = { ...errores };

    if (!datosEditados.nombre) erroresTemp.nombre = "El nombre es requerido.";
    else if (!/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/.test(datosEditados.nombre))
      erroresTemp.nombre = "El nombre solo puede contener letras.";
    else erroresTemp.nombre = "";

    if (!datosEditados.apellidoPaterno)
      erroresTemp.apellidoPaterno = "El apellido paterno es requerido.";
    else if (!/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/.test(datosEditados.apellidoPaterno))
      erroresTemp.apellidoPaterno = "El apellido paterno solo puede contener letras.";
    else erroresTemp.apellidoPaterno = "";

    if (!datosEditados.apellidoMaterno)
      erroresTemp.apellidoMaterno = "El apellido materno es requerido.";
    else if (!/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/.test(datosEditados.apellidoMaterno))
      erroresTemp.apellidoMaterno = "El apellido materno solo puede contener letras.";
    else erroresTemp.apellidoMaterno = "";

    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook|yahoo|live|uthh\.edu)\.(com|mx)$/;
    if (!datosEditados.correo || !emailRegex.test(datosEditados.correo))
      erroresTemp.correo = "Correo electrónico no válido o no permitido.";
    else erroresTemp.correo = "";

    if (!datosEditados.telefono || datosEditados.telefono.length !== 10)
      erroresTemp.telefono = "El teléfono debe tener 10 dígitos.";
    else if (!/^\d{10}$/.test(datosEditados.telefono))
      erroresTemp.telefono = "El teléfono solo puede contener números.";
    else erroresTemp.telefono = "";

    setErrores(erroresTemp);

    if (
      !erroresTemp.nombre &&
      !erroresTemp.apellidoPaterno &&
      !erroresTemp.apellidoMaterno &&
      !erroresTemp.correo &&
      !erroresTemp.telefono
    ) {
      // Si no hay errores, se guarda el usuario
      setUsuario(datosEditados);
      setEditando(false);

      // Enviar los datos al backend
      console.log(datosEditados);
      axios
        .post("http://localhost:3000/api/perfilClien", datosEditados)
        .then((response) => {
          console.log("Perfil actualizado exitosamente", response.data);
        })
        .catch((error) => {
          if (error.response) {
            // La respuesta fue recibida con un código de error
            console.error("Error de backend", error.response.data);
            console.error("Código de estado", error.response.status);
          } else if (error.request) {
            // La solicitud fue realizada pero no se recibió respuesta
            console.error("Error de solicitud", error.request);
          } else {
            // Algo salió mal al configurar la solicitud
            console.error("Error inesperado", error.message);
          }
        });
    }
  };

  const cambiarFotoPerfil = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUsuario((prevState) => ({
          ...prevState,
          fotoPerfil: reader.result,
        }));
      };
      reader.readAsDataURL(archivo);
    }
  };

  const obtenerColorFondo = () => {
    const nombre = datosEditados.nombre.toLowerCase();
    if (nombre.includes("a")) {
      return "#f1f8e9";
    } else if (nombre.includes("e")) {
      return "#ffe0b2";
    } else {
      return "#e3f2fd";
    }
  };

  const fondoColor = obtenerColorFondo();

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          backgroundColor: fondoColor,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 4,
          transition: "background-color 0.3s ease",
        }}
      >
        <Box sx={{ position: "relative", width: 140, height: 140 }}>
          <Avatar
            alt={`${usuario.nombre} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno}`}
            src={usuario.fotoPerfil || "https://via.placeholder.com/150"}
            sx={{ width: 140, height: 140, border: "4px solid white", boxShadow: 3 }}
          />
          <IconButton
            sx={{
              position: "absolute",
              bottom: 8,
              right: 8,
              backgroundColor: "white",
              boxShadow: 2,
            }}
            size="small"
          >
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={cambiarFotoPerfil}
            />
            <CameraAlt fontSize="small" />
          </IconButton>
        </Box>
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ mt: 2, fontFamily: datosEditados.nombre.length > 5 ? "Arial" : "Roboto" }}
        >
          {datosEditados.nombre} {datosEditados.apellidoPaterno} {datosEditados.apellidoMaterno}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {datosEditados.correo}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, p: 3, display: "flex", justifyContent: "center" }}>
        <Box sx={{ width: "100%", maxWidth: 600 }}>
          <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)} centered>
            <Tab label="Información Personal" />
            <Tab label="Historial de Compras" />
          </Tabs>

          {tabIndex === 0 && (
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Nombre"
                  name="nombre"
                  value={datosEditados.nombre}
                  onChange={manejarCambio}
                  disabled={!editando}
                  error={Boolean(errores.nombre)}
                  helperText={errores.nombre}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ maxWidth: 400, margin: "0 auto" }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Apellido Paterno"
                  name="apellidoPaterno"
                  value={datosEditados.apellidoPaterno}
                  onChange={manejarCambio}
                  disabled={!editando}
                  error={Boolean(errores.apellidoPaterno)}
                  helperText={errores.apellidoPaterno}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ maxWidth: 400, margin: "0 auto" }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Apellido Materno"
                  name="apellidoMaterno"
                  value={datosEditados.apellidoMaterno}
                  onChange={manejarCambio}
                  disabled={!editando}
                  error={Boolean(errores.apellidoMaterno)}
                  helperText={errores.apellidoMaterno}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ maxWidth: 400, margin: "0 auto" }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Correo Electrónico"
                  name="correo"
                  value={datosEditados.correo}
                  onChange={manejarCambio}
                  disabled={!editando}
                  error={Boolean(errores.correo)}
                  helperText={errores.correo}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ maxWidth: 400, margin: "0 auto" }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Teléfono"
                  name="telefono"
                  value={datosEditados.telefono}
                  onChange={manejarCambio}
                  disabled={!editando}
                  error={Boolean(errores.telefono)}
                  helperText={errores.telefono}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ maxWidth: 400, margin: "0 auto" }}
                />
              </Grid>
            </Grid>
          )}

          {tabIndex === 1 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6">Historial de Compras</Typography>
              <Box sx={{ mt: 2 }}>
                {historialCompras.map((compra) => (
                  <Box
                    key={compra.id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderBottom: "1px solid #ddd",
                      py: 1,
                    }}
                  >
                    <Typography variant="body2">{compra.producto}</Typography>
                    <Typography variant="body2">{compra.fecha}</Typography>
                    <Typography variant="body2">{compra.precio}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {editando ? (
            <Button
              variant="contained"
              sx={{ mt: 2, width: "100%" }}
              onClick={manejarGuardado}
            >
              Guardar Cambios
            </Button>
          ) : (
            <Button
              variant="outlined"
              sx={{ mt: 2, width: "100%" }}
              onClick={() => setEditando(true)}
            >
              Editar Perfil
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Perfil;


import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Paper,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  EmojiEvents as TrophyIcon,
} from "@mui/icons-material";

const API_URL = "https://backend-gis-1.onrender.com/api/insignias";

export default function App() {
  const [insignias, setInsignias] = useState([]);
  const [open, setOpen] = useState(false);
  const [editarId, setEditarId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: "", 
    severity: "success" 
  });
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    tipo: "",
    regla: "",
    icono: null,
    icono_url: "",
  });

  // ====== OBTENER INSIGNIAS ======
  const obtenerInsignias = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/obtener`);
      setInsignias(res.data);
    } catch (error) {
      console.error("Error al obtener insignias:", error);
      mostrarSnackbar("Error al cargar las insignias", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerInsignias();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ====== SNACKBAR ======
  const mostrarSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const cerrarSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // ====== MANEJAR CAMBIOS DEL FORMULARIO ======
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      
      if (!file.type.startsWith('image/')) {
        mostrarSnackbar("Por favor selecciona una imagen válida", "error");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        mostrarSnackbar("La imagen no debe superar los 5MB", "error");
        return;
      }

      setForm((prev) => ({
        ...prev,
        icono: file,
        icono_url: URL.createObjectURL(file),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ====== CREAR INSIGNIA ======
  const crearInsignia = async () => {
    if (!form.nombre.trim() || !form.tipo.trim() || !form.regla.trim()) {
      mostrarSnackbar("Por favor completa todos los campos obligatorios", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("nombre", form.nombre.trim());
    formData.append("descripcion", form.descripcion.trim());
    formData.append("tipo", form.tipo.trim());
    formData.append("regla", form.regla.trim());
    if (form.icono) {
      formData.append("icono", form.icono);
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/crear`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      mostrarSnackbar("Insignia creada correctamente", "success");
      obtenerInsignias();
      handleClose();
    } catch (error) {
      console.error("Error al crear la insignia:", error);
      const mensaje = error.response?.data?.message || "Error al crear la insignia";
      mostrarSnackbar(mensaje, "error");
    } finally {
      setLoading(false);
    }
  };

  // ====== ACTUALIZAR INSIGNIA ======
  const actualizarInsignia = async () => {
    if (!form.nombre.trim() || !form.tipo.trim() || !form.regla.trim()) {
      mostrarSnackbar("Por favor completa todos los campos obligatorios", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("nombre", form.nombre.trim());
    formData.append("descripcion", form.descripcion.trim());
    formData.append("tipo", form.tipo.trim());
    formData.append("regla", form.regla.trim());
    if (form.icono) {
      formData.append("icono", form.icono);
    }

    setLoading(true);
    try {
      await axios.put(`${API_URL}/insignias/${editarId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      mostrarSnackbar("Insignia actualizada correctamente", "success");
      obtenerInsignias();
      handleClose();
    } catch (error) {
      console.error("Error al actualizar la insignia:", error);
      const mensaje = error.response?.data?.message || "Error al actualizar la insignia";
      mostrarSnackbar(mensaje, "error");
    } finally {
      setLoading(false);
    }
  };

  // ====== SUBMIT ======
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editarId) {
      actualizarInsignia();
    } else {
      crearInsignia();
    }
  };

  // ====== EDITAR INSIGNIA ======
  const handleEdit = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/insignias/${id}`);
      setForm({
        nombre: res.data.nombre || "",
        descripcion: res.data.descripcion || "",
        tipo: res.data.tipo || "",
        regla: res.data.regla || "",
        icono: null,
        icono_url: res.data.icono_url || "",
      });
      setEditarId(id);
      setOpen(true);
    } catch (error) {
      console.error("Error al cargar insignia:", error);
      mostrarSnackbar("Error al cargar la insignia", "error");
    } finally {
      setLoading(false);
    }
  };

  // ====== ELIMINAR INSIGNIA ======
  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta insignia?")) {
      setLoading(true);
      try {
        await axios.delete(`${API_URL}/insignias/${id}`);
        mostrarSnackbar("Insignia eliminada correctamente", "success");
        obtenerInsignias();
      } catch (error) {
        console.error("Error al eliminar insignia:", error);
        const mensaje = error.response?.data?.message || "Error al eliminar la insignia";
        mostrarSnackbar(mensaje, "error");
      } finally {
        setLoading(false);
      }
    }
  };

  // ====== CONTROL DEL MODAL ======
  const handleOpen = () => {
    setForm({
      nombre: "",
      descripcion: "",
      tipo: "",
      regla: "",
      icono: null,
      icono_url: "",
    });
    setEditarId(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditarId(null);
    if (form.icono_url && form.icono) {
      URL.revokeObjectURL(form.icono_url);
    }
  };

  // ====== INTERFAZ ======
  return (
    <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        {/* HEADER */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            mb: 4, 
            borderRadius: 3,
            background: "linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)",
            color: "white"
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={2}>
              <TrophyIcon sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h4" fontWeight="700" gutterBottom>
                  Gestión de Insignias
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Administra las insignias del sistema
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpen}
              disabled={loading}
              sx={{
                bgcolor: "white",
                color: "#1565c0",
                px: 3,
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: "bold",
                "&:hover": {
                  bgcolor: "#f5f5f5",
                  transform: "translateY(-2px)",
                  boxShadow: 4,
                },
                transition: "all 0.3s ease",
              }}
            >
              Nueva Insignia
            </Button>
          </Box>
        </Paper>

        {/* LOADING INICIAL */}
        {loading && insignias.length === 0 && (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress size={50} />
          </Box>
        )}

        {/* TABLA O GRID DE INSIGNIAS */}
        {(!loading || insignias.length > 0) && (
          <>
            {/* VISTA EN CARDS PARA PANTALLAS PEQUEÑAS */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              <Grid container spacing={3}>
                {insignias.map((ins) => (
                  <Grid item xs={12} sm={6} key={ins.id}>
                    <Card elevation={2} sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                          {ins.icono_url ? (
                            <Box
                              component="img"
                              src={ins.icono_url}
                              alt={ins.nombre}
                              sx={{
                                width: 60,
                                height: 60,
                                borderRadius: "50%",
                                objectFit: "cover",
                                boxShadow: 2,
                              }}
                            />
                          ) : (
                            <Box
                              sx={{
                                width: 60,
                                height: 60,
                                borderRadius: "50%",
                                bgcolor: "#e0e0e0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <TrophyIcon sx={{ color: "#9e9e9e" }} />
                            </Box>
                          )}
                          <Box flex={1}>
                            <Typography variant="h6" fontWeight="600" gutterBottom>
                              {ins.nombre}
                            </Typography>
                            <Chip 
                              label={ins.tipo} 
                              size="small" 
                              sx={{ 
                                bgcolor: "#e3f2fd",
                                color: "#1565c0",
                                fontWeight: 600,
                              }} 
                            />
                          </Box>
                        </Box>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {ins.descripcion}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          <strong>Regla:</strong> {ins.regla}
                        </Typography>
                        <Box display="flex" gap={1}>
                          <Button
                            size="small"
                            variant="outlined"
                            color="warning"
                            startIcon={<EditIcon />}
                            onClick={() => handleEdit(ins.id)}
                            disabled={loading}
                            sx={{ flex: 1 }}
                          >
                            Editar
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDelete(ins.id)}
                            disabled={loading}
                            sx={{ flex: 1 }}
                          >
                            Eliminar
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* TABLA PARA PANTALLAS GRANDES */}
            <Paper 
              elevation={2} 
              sx={{ 
                borderRadius: 3, 
                overflow: "hidden",
                display: { xs: 'none', md: 'block' }
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#1565c0" }}>
                    <TableCell sx={{ color: "white", fontWeight: "bold", width: 100 }}>
                      Icono
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Nombre
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Descripción
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold", width: 120 }}>
                      Tipo
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Regla
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold", width: 180 }} align="center">
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {insignias.length > 0 ? (
                    insignias.map((ins) => (
                      <TableRow 
                        key={ins.id} 
                        sx={{ 
                          "&:hover": { bgcolor: "#f8f9fa" },
                          transition: "background-color 0.2s ease"
                        }}
                      >
                        <TableCell align="center">
                          {ins.icono_url ? (
                            <Box
                              component="img"
                              src={ins.icono_url}
                              alt={ins.nombre}
                              sx={{
                                width: 50,
                                height: 50,
                                borderRadius: "50%",
                                objectFit: "cover",
                                boxShadow: 2,
                              }}
                            />
                          ) : (
                            <Box
                              sx={{
                                width: 50,
                                height: 50,
                                borderRadius: "50%",
                                bgcolor: "#e0e0e0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto",
                              }}
                            >
                              <TrophyIcon sx={{ color: "#9e9e9e", fontSize: 24 }} />
                            </Box>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1" fontWeight="600">
                            {ins.nombre}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 300 }}>
                          <Typography variant="body2" color="text.secondary">
                            {ins.descripcion}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={ins.tipo} 
                            size="small" 
                            sx={{ 
                              bgcolor: "#e3f2fd",
                              color: "#1565c0",
                              fontWeight: 600,
                            }} 
                          />
                        </TableCell>
                        <TableCell sx={{ maxWidth: 250 }}>
                          <Typography variant="body2" color="text.secondary">
                            {ins.regla}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box display="flex" gap={1} justifyContent="center">
                            <Tooltip title="Editar">
                              <IconButton
                                color="warning"
                                size="small"
                                onClick={() => handleEdit(ins.id)}
                                disabled={loading}
                                sx={{
                                  "&:hover": {
                                    bgcolor: "rgba(237, 108, 2, 0.1)",
                                  }
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar">
                              <IconButton
                                color="error"
                                size="small"
                                onClick={() => handleDelete(ins.id)}
                                disabled={loading}
                                sx={{
                                  "&:hover": {
                                    bgcolor: "rgba(211, 47, 47, 0.1)",
                                  }
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                        <TrophyIcon sx={{ fontSize: 60, color: "#bdbdbd", mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          No hay insignias registradas
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Comienza agregando tu primera insignia
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Paper>
          </>
        )}

        {/* MODAL */}
        <Dialog 
          open={open} 
          onClose={handleClose} 
          fullWidth 
          maxWidth="sm"
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: 24,
            }
          }}
        >
          <DialogTitle 
            sx={{ 
              fontWeight: "bold", 
              color: "#1565c0",
              borderBottom: "1px solid #e0e0e0",
              pb: 2,
              fontSize: "1.5rem"
            }}
          >
            {editarId ? "Editar Insignia" : "Nueva Insignia"}
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
              <TextField
                label="Nombre"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                fullWidth
                disabled={loading}
                variant="outlined"
              />
              <TextField
                label="Descripción"
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
                disabled={loading}
                variant="outlined"
              />
              <TextField
                label="Tipo"
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                required
                fullWidth
                disabled={loading}
                variant="outlined"
                placeholder="Ej: Explorador, Contribuidor"
              />
              <TextField
                label="Regla"
                name="regla"
                value={form.regla}
                onChange={handleChange}
                required
                fullWidth
                disabled={loading}
                variant="outlined"
                placeholder="Ej: Visitar 5 lugares"
              />

              <Button
                variant="outlined"
                component="label"
                disabled={loading}
                startIcon={<CloudUploadIcon />}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: "600",
                  borderWidth: 2,
                  "&:hover": {
                    borderWidth: 2,
                  }
                }}
              >
                {form.icono_url ? "Cambiar Icono" : "Subir Icono"}
                <input
                  type="file"
                  hidden
                  name="icono"
                  accept="image/*"
                  onChange={handleChange}
                />
              </Button>

              {form.icono_url && (
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 3, 
                    bgcolor: "#f8f9fa", 
                    borderRadius: 2,
                    textAlign: "center"
                  }}
                >
                  <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                    Vista previa del icono:
                  </Typography>
                  <Box
                    component="img"
                    src={form.icono_url}
                    alt="Vista previa"
                    sx={{
                      width: 120,
                      height: 120,
                      objectFit: "cover",
                      borderRadius: "50%",
                      boxShadow: 3,
                    }}
                  />
                </Paper>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: "1px solid #e0e0e0" }}>
            <Button 
              onClick={handleClose} 
              disabled={loading}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                px: 3,
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={loading}
              sx={{
                px: 4,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: "bold",
                bgcolor: "#1565c0",
                "&:hover": {
                  bgcolor: "#0d47a1",
                }
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                editarId ? "Actualizar" : "Crear"
              )}
            </Button>
          </DialogActions>
        </Dialog>

        {/* SNACKBAR */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={cerrarSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert 
            onClose={cerrarSnackbar} 
            severity={snackbar.severity}
            variant="filled"
            sx={{ 
              width: "100%",
              borderRadius: 2,
              fontWeight: 600,
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
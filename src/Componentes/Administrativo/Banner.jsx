import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const BannerManager = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState({ titulo: "", descripcion: "", url: "" });
  const [editingId, setEditingId] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await axios.get("http://localhost:5000/banners/obtener");
      setBanners(res.data);
    } catch (error) {
      console.error("Error obteniendo banners", error);
      setMessage("Error al obtener los banners");
      setOpenSnackbar(true);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/banners/bannersact/${editingId}`, form);
        setMessage("Banner actualizado con éxito");
      } else {
        await axios.post("http://localhost:5000/banners/insertar", form);
        setMessage("Banner agregado con éxito");
      }
      fetchBanners();
      setForm({ titulo: "", descripcion: "", url: "" });
      setEditingId(null);
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error guardando banner", error);
      setMessage("Error al guardar el banner");
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (banner) => {
    setForm(banner);
    setEditingId(banner.id);
    // Scroll to form on mobile
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/banners/banners/${id}`);
      fetchBanners();
      setMessage("Banner eliminado con éxito");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error eliminando banner", error);
      setMessage("Error al eliminar el banner");
      setOpenSnackbar(true);
    }
  };

  const handleCancel = () => {
    setForm({ titulo: "", descripcion: "", url: "" });
    setEditingId(null);
  };

  // Render banners as cards on mobile/tablet
  const renderMobileView = () => (
    <Box sx={{ mt: 3 }}>
      {banners.map((banner) => (
        <Card key={banner.id} sx={{ mb: 2, borderLeft: `4px solid ${theme.palette.primary.main}` }}>
          <CardContent>
            <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
              {banner.titulo}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              ID: {banner.id}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {banner.descripcion}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, wordBreak: "break-all" }}>
              URL: {banner.url}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
              <Button
                startIcon={<EditIcon />}
                onClick={() => handleEdit(banner)}
                color="primary"
                size="small"
                sx={{ mr: 1 }}
              >
                Editar
              </Button>
              <Button 
                startIcon={<DeleteIcon />}
                onClick={() => handleDelete(banner.id)} 
                color="error" 
                size="small"
              >
                Eliminar
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  // Render banners as table on desktop
  const renderDesktopView = () => (
    <TableContainer component={Paper} sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}>
      <Table>
        <TableHead sx={{ backgroundColor: theme.palette.primary.light }}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", color: "white" }}>ID</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "white" }}>Título</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "white" }}>Descripción</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "white" }}>URL</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "white" }}>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {banners.map((banner) => (
            <TableRow key={banner.id} sx={{ "&:hover": { backgroundColor: theme.palette.action.hover } }}>
              <TableCell>{banner.id}</TableCell>
              <TableCell>{banner.titulo}</TableCell>
              <TableCell>{banner.descripcion}</TableCell>
              <TableCell sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }}>
                {banner.url}
              </TableCell>
              <TableCell>
                <IconButton onClick={() => handleEdit(banner)} color="primary" size="small" sx={{ mr: 1 }}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(banner.id)} color="error" size="small">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom color="primary" sx={{ fontWeight: "bold" }}>
          Gestión de Banners
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Card sx={{ p: 2, mb: 4, bgcolor: editingId ? "rgba(255, 152, 0, 0.05)" : "white" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color={editingId ? "warning.dark" : "primary"}>
              {editingId ? "Editar Banner" : "Agregar Nuevo Banner"}
            </Typography>
            
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Título"
                    name="titulo"
                    value={form.titulo}
                    onChange={handleChange}
                    fullWidth
                    required
                    variant="outlined"
                    size={isMobile ? "small" : "medium"}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Descripción"
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange}
                    fullWidth
                    required
                    variant="outlined"
                    size={isMobile ? "small" : "medium"}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="URL"
                    name="url"
                    value={form.url}
                    onChange={handleChange}
                    fullWidth
                    required
                    variant="outlined"
                    size={isMobile ? "small" : "medium"}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", gap: 2, justifyContent: isMobile ? "center" : "flex-start" }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color={editingId ? "warning" : "primary"}
                      sx={{ px: 3 }}
                    >
                      {editingId ? "Actualizar" : "Agregar"}
                    </Button>
                    {editingId && (
                      <Button variant="outlined" onClick={handleCancel}>
                        Cancelar
                      </Button>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>

      

        {banners.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography color="text.secondary">No hay banners disponibles</Typography>
          </Box>
        ) : isMobile || isTablet ? (
          renderMobileView()
        ) : (
          renderDesktopView()
        )}
      </Paper>


    </Container>
  );
};

export default BannerManager;
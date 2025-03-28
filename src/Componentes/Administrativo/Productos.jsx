// Componente mejorado para gestión de productos
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Snackbar,
  Alert,
  Tooltip,
  Paper,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  TablePagination,
  Divider,
  InputAdornment,
  CircularProgress,
  Backdrop,
  Fade,
  Stack,
  FormHelperText,
  Collapse,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemIcon,
  SwipeableDrawer,
  Tabs,
  Tab
} from "@mui/material";
import {
  Edit,
  Delete,
  Add,
  CloudUpload,
  FilterList,
  Sort,
  Search,
  ClearAll,
  PhotoLibrary,
  Close,
  HighlightOff,
  Info,
  Visibility,
  VisibilityOff,
  ImageSearch,
  Category,
  Palette,
  Straighten,
  Person,
  Inventory2,
  AttachMoney,
  Description
} from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import { useFormik } from "formik";
import * as Yup from "yup";

// Constantes para manejo de errores
const BACKEND_URL = "http://localhost:3001/api";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const VALID_MIME_TYPES = ["image/jpeg", "image/png", "image/gif"];

// Esquema de validación para Formik
const validationSchema = Yup.object({
  nombre_producto: Yup.string()
    .required("El nombre del producto es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  descripcion: Yup.string()
    .required("La descripción es requerida")
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(500, "La descripción no puede exceder 500 caracteres"),
  precio: Yup.number()
    .required("El precio es requerido")
    .positive("El precio debe ser mayor que 0")
    .max(999999, "El precio no puede exceder 999,999"),
  stock: Yup.number()
    .required("El stock es requerido")
    .integer("El stock debe ser un número entero")
    .min(0, "El stock no puede ser negativo")
    .max(9999, "El stock no puede exceder 9999"),
  id_categoria: Yup.string().required("Debe seleccionar una categoría"),
  id_color: Yup.string().required("Debe seleccionar un color"),
  id_talla: Yup.string().required("Debe seleccionar una talla"),
  id_genero: Yup.string().required("Debe seleccionar un género"),
});

const ProductoFormMejorado = () => {
  // Estados
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [colores, setColores] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [filters, setFilters] = useState({
    nombre: "",
    categoria: "",
    color: "",
    talla: "",
    genero: "",
  });
  const [openFilters, setOpenFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editMode, setEditMode] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detallesOpen, setDetallesOpen] = useState(false);
  const [productoDetalles, setProductoDetalles] = useState(null);
  const [tabDetalles, setTabDetalles] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Función para manejar envío del formulario
  async function handleSubmit(values, { resetForm }) {
    if (selectedImages.length === 0 && !editMode) {
      setSnackbar({
        open: true,
        message: "Debe subir al menos una imagen",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();

      // Datos del producto
      Object.keys(values).forEach((key) => {
        if (key !== "id" && values[key] !== null && values[key] !== undefined) {
          formData.append(key, values[key]);
        }
      });

      // Imágenes nuevas
      selectedImages.forEach((img) => {
        if (!img.isExisting && img.file) {
          formData.append("imagenes", img.file);
        }
      });

      // IDs de imágenes a mantener
      const existingImageIds = selectedImages
        .filter((img) => img.isExisting)
        .map((img) => img.id);

      if (existingImageIds.length > 0) {
        formData.append("mantenerImagenes", JSON.stringify(existingImageIds));
      }

      if (editMode) {
        await axios.put(`${BACKEND_URL}/actualizar/${values.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSnackbar({
          open: true,
          message: "Producto actualizado con éxito",
          severity: "success",
        });
      } else {
        await axios.post(`${BACKEND_URL}/agregarproducto`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSnackbar({
          open: true,
          message: "Producto creado con éxito",
          severity: "success",
        });
      }

      // Limpiar y actualizar
      resetForm();
      setSelectedImages([]);
      setEditMode(false);
      setOpenDialog(false);
      fetchProductos();
    } catch (error) {
      console.error("Error al guardar producto:", error);
      setSnackbar({
        open: true,
        message: `Error al ${editMode ? "actualizar" : "crear"} el producto`,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  // Formik para manejo de formulario y validaciones
  const formik = useFormik({
    initialValues: {
      id: null,
      nombre_producto: "",
      descripcion: "",
      precio: "",
      stock: "",
      id_categoria: "",
      id_color: "",
      id_talla: "",
      id_genero: "",
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  // Funciones para manejar carga y descarga de imágenes
  const onDrop = useCallback((acceptedFiles) => {
    const validFiles = acceptedFiles.filter(
      (file) =>
        VALID_MIME_TYPES.includes(file.type) &&
        file.size <= MAX_FILE_SIZE
    );

    if (validFiles.length !== acceptedFiles.length) {
      setSnackbar({
        open: true,
        message: "Algunas imágenes exceden el tamaño o no son del formato correcto",
        severity: "warning",
      });
    }

    const newImages = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setSelectedImages((prev) => [...prev, ...newImages]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif']
    },
    multiple: true,
  });

  const removeImage = (index) => {
    setSelectedImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  // Función para obtener productos filtrados
  const getFilteredProductos = () => {
    let filtered = [...productos];

    // Aplicar filtros
    if (filters.nombre) {
      filtered = filtered.filter(item =>
        item.nombre_producto.toLowerCase().includes(filters.nombre.toLowerCase())
      );
    }

    if (filters.categoria) {
      filtered = filtered.filter(item =>
        item.id_categoria === filters.categoria
      );
    }

    if (filters.color) {
      filtered = filtered.filter(item =>
        item.id_color === filters.color
      );
    }

    if (filters.talla) {
      filtered = filtered.filter(item =>
        item.id_talla === filters.talla
      );
    }

    if (filters.genero) {
      filtered = filtered.filter(item =>
        item.id_genero === filters.genero
      );
    }

    // Aplicar ordenamiento
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  };

  // Fetch data functions
  const fetchProductos = async () => {
    setTableLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/obtener`);
      setProductos(response.data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      setSnackbar({
        open: true,
        message: "Error al cargar los productos",
        severity: "error",
      });
    } finally {
      setTableLoading(false);
    }
  };

  const fetchCatalogos = async () => {
    try {
      const [categoriasRes, coloresRes, tallasRes, generosRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/obtenercat`),
        axios.get(`${BACKEND_URL}/colores`),
        axios.get(`${BACKEND_URL}/tallas`),
        axios.get(`${BACKEND_URL}/generos`),
      ]);

      setCategorias(categoriasRes.data);
      setColores(coloresRes.data);
      setTallas(tallasRes.data);
      setGeneros(generosRes.data);
    } catch (error) {
      console.error("Error al obtener catálogos:", error);
      setSnackbar({
        open: true,
        message: "Error al cargar los catálogos",
        severity: "error",
      });
    }
  };

  const fetchProductoById = async (id) => {
    setFormLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/obtener/${id}`);
      const producto = response.data;

      // Obtener imágenes del producto
      const imagenesResponse = await axios.get(`${BACKEND_URL}/imagenes/${id}`);
      const imagenes = imagenesResponse.data;

      // Llenar formik con datos
      formik.setValues({
        id: producto.id,
        nombre_producto: producto.nombre_producto,
        descripcion: producto.descripcion,
        precio: producto.precio,
        stock: producto.stock,
        id_categoria: producto.id_categoria,
        id_color: producto.id_color,
        id_talla: producto.id_talla,
        id_genero: producto.id_genero,
      });

      // Establecer imágenes existentes
      setSelectedImages(
        imagenes.map((img) => ({
          id: img.id,
          url: img.url,
          isExisting: true,
        }))
      );

      setEditMode(true);
      setOpenDialog(true);
    } catch (error) {
      console.error("Error al obtener producto:", error);
      setSnackbar({
        open: true,
        message: "Error al cargar el producto",
        severity: "error",
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Función para abrir el dialog de eliminación
  const handleOpenDeleteDialog = (event, id) => {
    event.stopPropagation(); // Evitar que se active handleOpenDetalles
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Función para cerrar el dialog sin eliminar
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };
  // Función para manejar eliminación
  const handleEliminarProducto = async () => {
    if (!productToDelete) return;

    setTableLoading(true);
    try {
      await axios.delete(`${BACKEND_URL}/eliminar/${productToDelete}`);
      setSnackbar({
        open: true,
        message: "Producto eliminado con éxito",
        severity: "success",
      });
      fetchProductos();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      setSnackbar({
        open: true,
        message: "Error al eliminar el producto",
        severity: "error",
      });
    } finally {
      setTableLoading(false);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  // Función para procesar color y asegurar visualización correcta
  const processColor = (colorString) => {
    // Si ya es un color válido en formato hex o rgb, devolverlo tal cual
    if (colorString?.startsWith('#') || colorString?.startsWith('rgb')) {
      return colorString;
    }

    // Colores básicos y sus equivalentes en hex
    const colorMap = {
      'rojo': '#ff0000',
      'azul': '#0000ff',
      'verde': '#008000',
      'amarillo': '#ffff00',
      'negro': '#000000',
      'blanco': '#ffffff',
      'gris': '#808080',
      'naranja': '#ffa500',
      'morado': '#800080',
      'rosa': '#ffc0cb',
      'marrón': '#a52a2a',
      'cyan': '#00ffff',
      'beige': '#f5f5dc',
      'turquesa': '#40e0d0',
      'dorado': '#ffd700',
      'plateado': '#c0c0c0'
    };

    // Intenta convertir nombres de colores comunes
    if (colorString && typeof colorString === 'string') {
      const normalizedColor = colorString.toLowerCase();
      if (colorMap[normalizedColor]) {
        return colorMap[normalizedColor];
      }
    }

    // Color por defecto si no se puede procesar
    return '#cccccc';
  };

  // Funciones para manejo de filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      nombre: "",
      categoria: "",
      color: "",
      talla: "",
      genero: "",
    });
  };

  // Funciones para ordenamiento
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Funciones para paginación
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Función para abrir detalles del producto
  const handleOpenDetalles = async (id) => {
    setDetailsLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/obtener/${id}`);
      const imagenesResponse = await axios.get(`${BACKEND_URL}/imagenes/${id}`);

      const producto = response.data;
      producto.imagenes = imagenesResponse.data;

      setProductoDetalles(producto);
      setDetallesOpen(true);
    } catch (error) {
      console.error("Error al obtener detalles del producto:", error);
      setSnackbar({
        open: true,
        message: "Error al cargar los detalles del producto",
        severity: "error",
      });
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCloseDetalles = () => {
    setDetallesOpen(false);
    setProductoDetalles(null);
    setTabDetalles(0);
  };

  const handleChangeTabDetalles = (event, newValue) => {
    setTabDetalles(newValue);
  };

  // Modal para vista previa de imágenes
  const openImagePreview = (images) => {
    setPreviewImages(images);
    setPreviewOpen(true);
  };

  const closeImagePreview = () => {
    setPreviewOpen(false);
    setPreviewImages([]);
  };

  // Inicializar datos
  useEffect(() => {
    fetchProductos();
    fetchCatalogos();
  }, []);

  // Limpiar URL de las vistas previas al desmontar el componente
  useEffect(() => {
    return () => {
      selectedImages.forEach((image) => {
        if (image.preview && !image.isExisting) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, [selectedImages]);

  // Preparar datos paginados
  const filteredProductos = getFilteredProductos();
  const paginatedProductos = filteredProductos.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Restablecer formulario al abrir el diálogo
  const handleOpenDialog = () => {
    formik.resetForm();
    setSelectedImages([]);
    setEditMode(false);
    setOpenDialog(true);
  };

  return (
    <Container maxWidth="xl" sx={{ padding: "40px 20px" }}>
      {/* Header y botón de añadir */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "700", color: "#0277bd" }}>
          Gestión de Productos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleOpenDialog}
          sx={{
            borderRadius: "16px",
            py: 1.5,
            px: 3,
            fontWeight: "600",
            boxShadow: "0 4px 12px rgba(2, 119, 189, 0.2)",
            backgroundColor: "#0277bd",
            "&:hover": { backgroundColor: "#01579b", transform: "translateY(-2px)" },
            transition: "all 0.3s ease",
          }}
        >
          Nuevo Producto
        </Button>
      </Box>

      {/* Panel de filtros */}
      <Card
        sx={{
          mb: 4,
          borderRadius: "20px",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.08)",
          overflow: "hidden"
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "600", color: "#0277bd" }}>
              Filtros y Ordenamiento
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => setOpenFilters(!openFilters)}
                sx={{
                  borderRadius: "12px",
                  borderWidth: "2px",
                  fontWeight: "600",
                  px: 2,
                  '&:hover': {
                    borderWidth: "2px",
                    backgroundColor: "rgba(2, 119, 189, 0.04)"
                  }
                }}
              >
                {openFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
              </Button>
              <Button
                variant="outlined"
                startIcon={<ClearAll />}
                onClick={clearFilters}
                sx={{
                  borderRadius: "12px",
                  borderWidth: "2px",
                  fontWeight: "600",
                  px: 2,
                  '&:hover': {
                    borderWidth: "2px"
                  }
                }}
                disabled={!Object.values(filters).some(v => v)}
                color="error"
              >
                Limpiar Filtros
              </Button>
            </Stack>
          </Box>

          <Collapse in={openFilters}>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  fullWidth
                  label="Buscar por nombre"
                  name="nombre"
                  value={filters.nombre}
                  onChange={handleFilterChange}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Categoría</InputLabel>
                  <Select
                    label="Categoría"
                    name="categoria"
                    value={filters.categoria}
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    {categorias.map((cat) => (
                      <MenuItem key={cat.id_categoria} value={cat.id_categoria}>
                        {cat.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Color</InputLabel>
                  <Select
                    label="Color"
                    name="color"
                    value={filters.color}
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    {colores.map((color) => (
                      <MenuItem key={color.id} value={color.id}>
                        {color.color}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Talla</InputLabel>
                  <Select
                    label="Talla"
                    name="talla"
                    value={filters.talla}
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    {tallas.map((talla) => (
                      <MenuItem key={talla.id} value={talla.id}>
                        {talla.talla}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Género</InputLabel>
                  <Select
                    label="Género"
                    name="genero"
                    value={filters.genero}
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    {generos.map((genero) => (
                      <MenuItem key={genero.id} value={genero.id}>
                        {genero.genero}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Collapse>
        </CardContent>
      </Card>

      {/* Tabla de productos */}
      <Card
        sx={{
          borderRadius: "20px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
          position: "relative",
          minHeight: "400px",
          overflow: "hidden"
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <TableContainer sx={{ maxHeight: "calc(100vh - 300px)" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#e3f2fd",
                      color: "#0277bd",
                      fontSize: "15px"
                    }}
                    onClick={() => handleSort("id")}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      ID
                      <Sort fontSize="small" sx={{ ml: 0.5, opacity: sortConfig.key === "id" ? 1 : 0.3 }} />
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#e3f2fd",
                      color: "#0277bd",
                      fontSize: "15px"
                    }}
                    onClick={() => handleSort("nombre_producto")}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      Nombre
                      <Sort fontSize="small" sx={{ ml: 0.5, opacity: sortConfig.key === "nombre_producto" ? 1 : 0.3 }} />
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#e3f2fd",
                      color: "#0277bd",
                      fontSize: "15px"
                    }}
                  >
                    Descripción
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#e3f2fd",
                      color: "#0277bd",
                      fontSize: "15px"
                    }}
                    onClick={() => handleSort("precio")}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      Precio
                      <Sort fontSize="small" sx={{ ml: 0.5, opacity: sortConfig.key === "precio" ? 1 : 0.3 }} />
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#e3f2fd",
                      color: "#0277bd",
                      fontSize: "15px"
                    }}
                    onClick={() => handleSort("stock")}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      Stock
                      <Sort fontSize="small" sx={{ ml: 0.5, opacity: sortConfig.key === "stock" ? 1 : 0.3 }} />
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#e3f2fd",
                      color: "#0277bd",
                      fontSize: "15px"
                    }}
                  >
                    Detalles
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#e3f2fd",
                      color: "#0277bd",
                      fontSize: "15px"
                    }}
                  >
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableLoading && productos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                      <CircularProgress size={48} sx={{ color: "#0277bd", mb: 2 }} />
                      <Typography variant="body1" sx={{ color: "#666" }}>
                        Cargando productos...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : paginatedProductos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                      <Box sx={{ color: "#999" }}>
                        <Inventory2 sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
                        <Typography variant="h6" color="textSecondary">
                          No se encontraron productos
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                          Intenta cambiar los filtros o añade un nuevo producto
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedProductos.map((producto) => (
                    <TableRow
                      key={producto.id}
                      hover
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(2, 119, 189, 0.04)'
                        },
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onClick={() => handleOpenDetalles(producto.id)}
                    >
                      <TableCell sx={{ fontSize: "14px" }}>{producto.id}</TableCell>
                      <TableCell sx={{ fontWeight: "600", fontSize: "14px" }}>
                        {producto.nombre_producto}
                      </TableCell>
                      <TableCell sx={{ maxWidth: "250px", fontSize: "14px" }}>
                        <Tooltip title={producto.descripcion}>
                          <Typography noWrap>
                            {producto.descripcion}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ fontSize: "14px", fontWeight: "500" }}>
                        ${Number(producto.precio).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={producto.stock}
                          color={producto.stock > 0 ? "success" : "error"}
                          sx={{
                            borderRadius: "12px",
                            fontWeight: "600",
                            minWidth: "60px"
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="column" spacing={1}>
                          <Chip
                            size="small"
                            label={producto.categoria}
                            variant="outlined"
                            sx={{
                              maxWidth: "150px",
                              borderRadius: "12px"
                            }}
                          />
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: "50%",
                                backgroundColor: processColor(producto.color?.toLowerCase()),
                                border: "1px solid #ddd",
                              }}
                            />
                            <Typography variant="caption">
                              {producto.color} | {producto.talla} | {producto.genero}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<Info />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDetalles(producto.id);
                            }}
                            sx={{
                              borderRadius: "12px",
                              backgroundColor: "#0277bd",
                              boxShadow: "none",
                              fontWeight: "600",
                              '&:hover': {
                                backgroundColor: "#01579b",
                                boxShadow: "0 4px 8px rgba(2, 119, 189, 0.3)"
                              }
                            }}
                          >
                            Detalles
                          </Button>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              fetchProductoById(producto.id);
                            }}
                            sx={{
                              color: "#0277bd",
                              backgroundColor: "rgba(2, 119, 189, 0.1)",
                              '&:hover': {
                                backgroundColor: "rgba(2, 119, 189, 0.2)",
                              }
                            }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            onClick={(e) => handleOpenDeleteDialog(e, producto.id)}
                            sx={{
                              color: "#d32f2f",
                              backgroundColor: "rgba(211, 47, 47, 0.1)",
                              '&:hover': {
                                backgroundColor: "rgba(211, 47, 47, 0.2)",
                              }
                            }}
                          >
                            <Delete />
                          </IconButton>

                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredProductos.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            sx={{ borderTop: "1px solid rgba(224, 224, 224, 1)" }}
          />
        </CardContent>
      </Card>

      {/* Diálogo de formulario */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        TransitionComponent={Fade}
        transitionDuration={300}
        PaperProps={{
          sx: {
            borderRadius: "20px",
            overflow: "hidden"
          }
        }}
      >
        <DialogTitle sx={{ bgcolor: "#0277bd", color: "white", py: 2.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              {editMode ? "Editar Producto" : "Nuevo Producto"}
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => setOpenDialog(false)}
              aria-label="close"
              sx={{
                backgroundColor: "rgba(255,255,255,0.1)",
                '&:hover': {
                  backgroundColor: "rgba(255,255,255,0.2)"
                }
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" noValidate onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nombre del producto"
                  name="nombre_producto"
                  value={formik.values.nombre_producto}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.nombre_producto && Boolean(formik.errors.nombre_producto)}
                  helperText={formik.touched.nombre_producto && formik.errors.nombre_producto}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descripción"
                  name="descripcion"
                  value={formik.values.descripcion}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.descripcion && Boolean(formik.errors.descripcion)}
                  helperText={formik.touched.descripcion && formik.errors.descripcion}
                  variant="outlined"
                  multiline
                  rows={3}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Precio"
                  name="precio"
                  type="number"
                  value={formik.values.precio}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.precio && Boolean(formik.errors.precio)}
                  helperText={formik.touched.precio && formik.errors.precio}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Stock"
                  name="stock"
                  type="number"
                  value={formik.values.stock}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.stock && Boolean(formik.errors.stock)}
                  helperText={formik.touched.stock && formik.errors.stock}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  required
                  error={formik.touched.id_categoria && Boolean(formik.errors.id_categoria)}
                >
                  <InputLabel>Categoría</InputLabel>
                  <Select
                    label="Categoría"
                    name="id_categoria"
                    value={formik.values.id_categoria}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {categorias.map((categoria) => (
                      <MenuItem key={categoria.id_categoria} value={categoria.id_categoria}>
                        {categoria.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.id_categoria && formik.errors.id_categoria && (
                    <FormHelperText>{formik.errors.id_categoria}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  required
                  error={formik.touched.id_color && Boolean(formik.errors.id_color)}
                >
                  <InputLabel>Color</InputLabel>
                  <Select
                    label="Color"
                    name="id_color"
                    value={formik.values.id_color}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {colores.map((color) => (
                      <MenuItem key={color.id} value={color.id}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box
                            sx={{
                              width: 16,
                              height: 16,
                              borderRadius: "50%",
                              backgroundColor: color.color.toLowerCase(),
                              border: "1px solid #ddd",
                            }}
                          />
                          {color.color}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.id_color && formik.errors.id_color && (
                    <FormHelperText>{formik.errors.id_color}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  required
                  error={formik.touched.id_talla && Boolean(formik.errors.id_talla)}
                >
                  <InputLabel>Talla</InputLabel>
                  <Select
                    label="Talla"
                    name="id_talla"
                    value={formik.values.id_talla}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {tallas.map((talla) => (
                      <MenuItem key={talla.id} value={talla.id}>
                        {talla.talla}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.id_talla && formik.errors.id_talla && (
                    <FormHelperText>{formik.errors.id_talla}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  required
                  error={formik.touched.id_genero && Boolean(formik.errors.id_genero)}
                >
                  <InputLabel>Género</InputLabel>
                  <Select
                    label="Género"
                    name="id_genero"
                    value={formik.values.id_genero}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {generos.map((genero) => (
                      <MenuItem key={genero.id} value={genero.id}>
                        {genero.genero}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.id_genero && formik.errors.id_genero && (
                    <FormHelperText>{formik.errors.id_genero}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }}>
                  <Chip label="Imágenes del Producto" color="primary" />
                </Divider>
                <Box
                  {...getRootProps()}
                  sx={{
                    border: "3px dashed #0277bd",
                    borderRadius: "16px",
                    p: 4,
                    mt: 2,
                    backgroundColor: isDragActive ? "rgba(2, 119, 189, 0.08)" : "rgba(2, 119, 189, 0.03)",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    '&:hover': {
                      backgroundColor: "rgba(2, 119, 189, 0.06)",
                      borderColor: "#01579b"
                    }
                  }}
                >
                  <input {...getInputProps()} />
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <CloudUpload sx={{ fontSize: 60, color: "#0277bd", mb: 2 }} />
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "#0277bd" }}>
                      {isDragActive
                        ? "¡Suelta las imágenes aquí!"
                        : "Arrastra y suelta imágenes aquí"}
                    </Typography>
                    <Typography variant="body1" gutterBottom color="textSecondary">
                      o haz clic para seleccionar desde tu dispositivo
                    </Typography>
                    <Chip
                      label="Formatos aceptados: JPG, PNG, GIF (Máx. 5MB)"
                      variant="outlined"
                      size="small"
                      sx={{ mt: 1, borderRadius: "10px" }}
                    />
                  </Box>
                </Box>

                {selectedImages.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: "#0277bd" }}>
                        Imágenes seleccionadas
                      </Typography>
                      <Chip
                        label={`${selectedImages.length} ${selectedImages.length === 1 ? "imagen" : "imágenes"}`}
                        color="primary"
                        sx={{ borderRadius: '10px', fontWeight: 500 }}
                      />
                    </Box>

                    <Grid container spacing={2}>
                      {selectedImages.map((image, index) => (
                        <Grid item xs={6} sm={4} md={3} key={index}>
                          <Box
                            sx={{
                              position: "relative",
                              borderRadius: "16px",
                              overflow: "hidden",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                              transition: "all 0.3s ease",
                              height: 180,
                              "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: "0 8px 16px rgba(0,0,0,0.16)"
                              },
                              "&:hover .image-overlay": {
                                opacity: 1
                              }
                            }}
                          >
                            <Box
                              component="img"
                              src={image.preview || image.url}
                              alt={`Vista previa ${index + 1}`}
                              sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                            <Box
                              className="image-overlay"
                              sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: "rgba(0,0,0,0.5)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                opacity: 0,
                                transition: "opacity 0.3s ease"
                              }}
                            >
                              <IconButton
                                size="large"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeImage(index);
                                }}
                                sx={{
                                  backgroundColor: "rgba(211, 47, 47, 0.9)",
                                  color: "white",
                                  "&:hover": {
                                    backgroundColor: "#d32f2f",
                                    transform: "scale(1.1)"
                                  },
                                  transition: "all 0.2s"
                                }}
                              >
                                <Delete />
                              </IconButton>
                            </Box>
                            <Box
                              sx={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                backgroundColor: "rgba(0,0,0,0.6)",
                                color: "white",
                                py: 0.5,
                                px: 1.5,
                                fontSize: "0.75rem",
                                fontWeight: 500
                              }}
                            >
                              {image.isExisting ? "Imagen existente" : `Imagen ${index + 1}`}
                            </Box>
                          </Box>
                        </Grid>
                      ))}

                      {/* Botón para añadir más imágenes */}
                      <Grid item xs={6} sm={4} md={3}>
                        <Box
                          {...getRootProps()}
                          sx={{
                            height: 180,
                            border: "2px dashed rgba(2, 119, 189, 0.5)",
                            borderRadius: "16px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            backgroundColor: "rgba(2, 119, 189, 0.03)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              backgroundColor: "rgba(2, 119, 189, 0.08)",
                              borderColor: "#0277bd"
                            }
                          }}
                        >
                          <input {...getInputProps()} />
                          <Add sx={{ fontSize: 40, color: "#0277bd", mb: 1 }} />
                          <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                            Agregar más
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            variant="outlined"
            sx={{
              borderRadius: "16px",
              py: 1.2,
              px: 3,
              fontWeight: 600,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
                backgroundColor: 'rgba(0,0,0,0.04)'
              }
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={formik.handleSubmit}
            variant="contained"
            sx={{
              borderRadius: "16px",
              backgroundColor: "#0277bd",
              py: 1.2,
              px: 3,
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(2, 119, 189, 0.3)',
              "&:hover": {
                backgroundColor: "#01579b",
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(2, 119, 189, 0.4)'
              },
              transition: 'all 0.3s ease'
            }}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Add />}
          >
            {editMode ? "Actualizar Producto" : "Guardar Producto"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para previsualizar imágenes */}
      <Dialog
        open={previewOpen}
        onClose={closeImagePreview}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '16px' }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">Imágenes del Producto</Typography>
            <IconButton onClick={closeImagePreview}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 2 }}>
            {previewImages.length > 0 ? (
              previewImages.map((img, index) => (
                <Box
                  key={index}
                  component="img"
                  src={img.url}
                  alt={`Imagen ${index + 1}`}
                  sx={{
                    maxWidth: "100%",
                    maxHeight: "400px",
                    objectFit: "contain",
                    borderRadius: "12px",
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.02)'
                    }
                  }}
                />
              ))
            ) : (
              <Typography variant="body1" color="textSecondary" sx={{ py: 4 }}>
                Este producto no tiene imágenes disponibles
              </Typography>
            )}
          </Box>
        </DialogContent>
      </Dialog>

      {/* Modal de detalles de producto */}
      <Dialog
        open={detallesOpen}
        onClose={handleCloseDetalles}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ bgcolor: "#0277bd", color: "white", py: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">
              Detalles del Producto
            </Typography>
            <IconButton color="inherit" onClick={handleCloseDetalles}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        {productoDetalles && (
          <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabDetalles}
                onChange={handleChangeTabDetalles}
                variant="fullWidth"
                sx={{
                  '& .MuiTab-root': {
                    fontWeight: 600,
                    py: 2
                  },
                  '& .Mui-selected': {
                    color: '#0277bd !important'
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#0277bd',
                    height: 3
                  }
                }}
              >
                <Tab label="Información General" icon={<Info />} iconPosition="start" />
                <Tab label="Galería de Imágenes" icon={<PhotoLibrary />} iconPosition="start" />
                <Tab label="Especificaciones" icon={<Description />} iconPosition="start" />
              </Tabs>
            </Box>

            <DialogContent dividers sx={{ px: 4, py: 3 }}>
              {/* Tab de Información General */}
              {tabDetalles === 0 && (
                <Box sx={{ animation: 'fadeIn 0.4s ease-in-out', '@keyframes fadeIn': { from: { opacity: 0 }, to: { opacity: 1 } } }}>
                  {/* Header con nombre del producto y acciones rápidas */}
                  <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    mb: 3
                  }}>
                    <Typography variant="h4" sx={{
                      fontWeight: 700,
                      color: '#0277bd',
                      mb: { xs: 2, sm: 0 },
                      position: 'relative',
                      '&:after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -8,
                        left: 0,
                        width: 60,
                        height: 4,
                        backgroundColor: '#0277bd',
                        borderRadius: 2
                      }
                    }}>
                      {productoDetalles.nombre_producto}
                    </Typography>

                    <Stack direction="row" spacing={1}>
                      <Chip
                        label={`$${Number(productoDetalles.precio).toFixed(2)}`}
                        color="primary"
                        icon={<AttachMoney />}
                        sx={{
                          fontWeight: 700,
                          fontSize: '1rem',
                          py: 2.5,
                          px: 1,
                          borderRadius: '12px',
                          boxShadow: '0 2px 8px rgba(2, 119, 189, 0.2)'
                        }}
                      />
                      <Chip
                        label={productoDetalles.stock > 0 ? `Disponible (${productoDetalles.stock})` : 'Sin stock'}
                        color={productoDetalles.stock > 0 ? "success" : "error"}
                        icon={productoDetalles.stock > 0 ? <Inventory2 /> : <HighlightOff />}
                        sx={{
                          fontWeight: 700,
                          fontSize: '1rem',
                          py: 2.5,
                          px: 1,
                          borderRadius: '12px',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                    </Stack>
                  </Box>

                  {/* Contenido principal en grid */}
                  <Grid container spacing={3}>
                    {/* Columna izquierda con imagen */}
                    <Grid item xs={12} md={6}>
                      <Card sx={{
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                        transition: 'transform 0.3s',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)'
                        }
                      }}>
                        <Box sx={{ position: 'relative' }}>
                          {/* Imagen principal */}
                          <Box
                            component="img"
                            src={productoDetalles.imagenes && productoDetalles.imagenes.length > 0
                              ? productoDetalles.imagenes[0].url
                              : '/placeholder-image.jpg'}
                            alt={productoDetalles.nombre_producto}
                            sx={{
                              width: '100%',
                              height: { xs: 300, sm: 400 },
                              objectFit: 'cover',
                              display: 'block'
                            }}
                          />

                          {/* Overlay con degradado para mejor legibilidad de elementos */}
                          <Box sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
                            height: '50%',
                            pointerEvents: 'none'
                          }} />

                          {/* Badge de categoría */}
                          <Chip
                            label={productoDetalles.categoria}
                            color="primary"
                            variant="filled"
                            size="medium"
                            sx={{
                              position: 'absolute',
                              top: 16,
                              left: 16,
                              fontWeight: 600,
                              borderRadius: '8px',
                              px: 1.5,
                              backgroundColor: 'rgba(2, 119, 189, 0.85)',
                              backdropFilter: 'blur(4px)'
                            }}
                          />

                          {/* Chip con contador de imágenes */}
                          {productoDetalles.imagenes && productoDetalles.imagenes.length > 1 && (
                            <Button
                              variant="contained"
                              startIcon={<PhotoLibrary />}
                              onClick={() => setTabDetalles(1)}
                              sx={{
                                position: 'absolute',
                                bottom: 16,
                                right: 16,
                                fontWeight: 600,
                                borderRadius: '12px',
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                color: '#0277bd',
                                backdropFilter: 'blur(4px)',
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 255, 255, 1)',
                                  transform: 'scale(1.05)'
                                },
                                transition: 'all 0.2s ease',
                                textTransform: 'none'
                              }}
                            >
                              Ver {productoDetalles.imagenes.length} imágenes
                            </Button>
                          )}
                        </Box>

                        {/* Thumbnails de las imágenes */}
                        {productoDetalles.imagenes && productoDetalles.imagenes.length > 1 && (
                          <Box sx={{
                            display: 'flex',
                            overflow: 'auto',
                            gap: 1,
                            p: 1.5,
                            backgroundColor: '#f5f5f5',
                            '&::-webkit-scrollbar': {
                              height: 4
                            },
                            '&::-webkit-scrollbar-thumb': {
                              backgroundColor: '#bdbdbd',
                              borderRadius: 2
                            }
                          }}>
                            {productoDetalles.imagenes.map((img, idx) => (
                              <Box
                                key={idx}
                                component="img"
                                src={img.url}
                                alt={`Imagen ${idx + 1}`}
                                sx={{
                                  width: 60,
                                  height: 60,
                                  objectFit: 'cover',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  border: idx === 0 ? '2px solid #0277bd' : '2px solid transparent',
                                  opacity: idx === 0 ? 1 : 0.7,
                                  transition: 'all 0.2s ease',
                                  '&:hover': {
                                    opacity: 1,
                                    transform: 'scale(1.05)'
                                  }
                                }}
                                onClick={() => openImagePreview([img])}
                              />
                            ))}
                          </Box>
                        )}
                      </Card>
                    </Grid>

                    {/* Columna derecha con información y características */}
                    <Grid item xs={12} md={6}>
                      <Stack spacing={3}>
                        {/* Sección de descripción */}
                        <Card sx={{
                          borderRadius: '16px',
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)'
                        }}>
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 2
                            }}>
                              <Description sx={{ color: '#0277bd', mr: 1.5 }} />
                              <Typography variant="h6" sx={{
                                fontWeight: 600,
                                color: '#0277bd'
                              }}>
                                Descripción
                              </Typography>
                            </Box>
                            <Typography variant="body1" sx={{
                              color: '#424242',
                              lineHeight: 1.7,
                              textAlign: 'justify'
                            }}>
                              {productoDetalles.descripcion}
                            </Typography>
                          </CardContent>
                        </Card>

                        {/* Sección de características */}
                        <Card sx={{
                          borderRadius: '16px',
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)'
                        }}>
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 2.5
                            }}>
                              <Info sx={{ color: '#0277bd', mr: 1.5 }} />
                              <Typography variant="h6" sx={{
                                fontWeight: 600,
                                color: '#0277bd',
                              }}>
                                Características
                              </Typography>
                            </Box>

                            <Grid container spacing={2}>
                              {/* Categoría */}
                              <Grid item xs={12} sm={6}>
                                <Box sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  p: 1.5,
                                  backgroundColor: 'rgba(2, 119, 189, 0.04)',
                                  borderRadius: '12px',
                                  height: '100%'
                                }}>
                                  <Avatar sx={{
                                    bgcolor: 'rgba(2, 119, 189, 0.12)',
                                    color: '#0277bd',
                                    mr: 2
                                  }}>
                                    <Category fontSize="small" />
                                  </Avatar>
                                  <Box>
                                    <Typography variant="caption" sx={{
                                      color: '#616161',
                                      fontWeight: 500,
                                      display: 'block'
                                    }}>
                                      Categoría
                                    </Typography>
                                    <Typography variant="body1" sx={{
                                      fontWeight: 600,
                                      color: '#212121'
                                    }}>
                                      {productoDetalles.categoria}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>

                              {/* Color */}
                              <Grid item xs={12} sm={6}>
                                <Box sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  p: 1.5,
                                  backgroundColor: 'rgba(2, 119, 189, 0.04)',
                                  borderRadius: '12px',
                                  height: '100%'
                                }}>
                                  <Avatar sx={{
                                    bgcolor: processColor(productoDetalles.color?.toLowerCase()),
                                    mr: 2,
                                    border: '2px solid white',
                                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
                                  }}>
                                    <Palette fontSize="small" sx={{ color: 'white' }} />
                                  </Avatar>
                                  <Box>
                                    <Typography variant="caption" sx={{
                                      color: '#616161',
                                      fontWeight: 500,
                                      display: 'block'
                                    }}>
                                      Color
                                    </Typography>
                                    <Typography variant="body1" sx={{
                                      fontWeight: 600,
                                      color: '#212121',
                                      display: 'flex',
                                      alignItems: 'center'
                                    }}>
                                      {productoDetalles.color}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>

                              {/* Talla */}
                              <Grid item xs={12} sm={6}>
                                <Box sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  p: 1.5,
                                  backgroundColor: 'rgba(2, 119, 189, 0.04)',
                                  borderRadius: '12px',
                                  height: '100%'
                                }}>
                                  <Avatar sx={{
                                    bgcolor: 'rgba(2, 119, 189, 0.12)',
                                    color: '#0277bd',
                                    mr: 2
                                  }}>
                                    <Straighten fontSize="small" />
                                  </Avatar>
                                  <Box>
                                    <Typography variant="caption" sx={{
                                      color: '#616161',
                                      fontWeight: 500,
                                      display: 'block'
                                    }}>
                                      Talla
                                    </Typography>
                                    <Typography variant="body1" sx={{
                                      fontWeight: 600,
                                      color: '#212121'
                                    }}>
                                      {productoDetalles.talla}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>

                              {/* Género */}
                              <Grid item xs={12} sm={6}>
                                <Box sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  p: 1.5,
                                  backgroundColor: 'rgba(2, 119, 189, 0.04)',
                                  borderRadius: '12px',
                                  height: '100%'
                                }}>
                                  <Avatar sx={{
                                    bgcolor: 'rgba(2, 119, 189, 0.12)',
                                    color: '#0277bd',
                                    mr: 2
                                  }}>
                                    <Person fontSize="small" />
                                  </Avatar>
                                  <Box>
                                    <Typography variant="caption" sx={{
                                      color: '#616161',
                                      fontWeight: 500,
                                      display: 'block'
                                    }}>
                                      Género
                                    </Typography>
                                    <Typography variant="body1" sx={{
                                      fontWeight: 600,
                                      color: '#212121'
                                    }}>
                                      {productoDetalles.genero}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Tab de Galería de Imágenes */}
              {tabDetalles === 1 && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#0277bd' }}>
                    Galería de Imágenes
                  </Typography>
                  {productoDetalles.imagenes && productoDetalles.imagenes.length > 0 ? (
                    <Grid container spacing={2}>
                      {productoDetalles.imagenes.map((img, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Box
                            sx={{
                              position: 'relative',
                              borderRadius: '16px',
                              overflow: 'hidden',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                              height: 250,
                              cursor: 'pointer',
                              transition: 'transform 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.02)'
                              }
                            }}
                            onClick={() => openImagePreview([img])}
                          >
                            <Box
                              component="img"
                              src={img.url}
                              alt={`Imagen ${index + 1}`}
                              sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                            <Box
                              sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                backgroundColor: 'rgba(0,0,0,0.6)',
                                color: 'white',
                                padding: '8px 16px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                              }}
                            >
                              <Typography variant="body2">Imagen {index + 1}</Typography>
                              <IconButton
                                size="small"
                                sx={{ color: 'white' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openImagePreview([img]);
                                }}
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Box
                      sx={{
                        textAlign: 'center',
                        py: 4,
                        backgroundColor: 'rgba(0,0,0,0.02)',
                        borderRadius: '12px'
                      }}
                    >
                      <ImageSearch sx={{ fontSize: 60, color: 'rgba(0,0,0,0.2)', mb: 2 }} />
                      <Typography variant="h6" color="textSecondary">
                        No hay imágenes disponibles
                      </Typography>
                    </Box>
                  )}
                </>
              )}

              {/* Tab de Especificaciones */}
              {tabDetalles === 2 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#0277bd' }}>
                      Especificaciones Técnicas
                    </Typography>
                    <TableContainer component={Paper} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell component="th" sx={{ fontWeight: 600, backgroundColor: 'rgba(2, 119, 189, 0.05)' }}>
                              ID
                            </TableCell>
                            <TableCell>{productoDetalles.id}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" sx={{ fontWeight: 600, backgroundColor: 'rgba(2, 119, 189, 0.05)' }}>
                              Nombre
                            </TableCell>
                            <TableCell>{productoDetalles.nombre_producto}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" sx={{ fontWeight: 600, backgroundColor: 'rgba(2, 119, 189, 0.05)' }}>
                              Descripción
                            </TableCell>
                            <TableCell>{productoDetalles.descripcion}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" sx={{ fontWeight: 600, backgroundColor: 'rgba(2, 119, 189, 0.05)' }}>
                              Precio
                            </TableCell>
                            <TableCell>${Number(productoDetalles.precio).toFixed(2)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" sx={{ fontWeight: 600, backgroundColor: 'rgba(2, 119, 189, 0.05)' }}>
                              Stock
                            </TableCell>
                            <TableCell>{productoDetalles.stock}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" sx={{ fontWeight: 600, backgroundColor: 'rgba(2, 119, 189, 0.05)' }}>
                              Categoría
                            </TableCell>
                            <TableCell>{productoDetalles.categoria}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" sx={{ fontWeight: 600, backgroundColor: 'rgba(2, 119, 189, 0.05)' }}>
                              Color
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box
                                  sx={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: '50%',
                                    backgroundColor: processColor(productoDetalles.color?.toLowerCase()),
                                    border: '1px solid #ddd'
                                  }}
                                />
                                {productoDetalles.color}
                              </Box>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" sx={{ fontWeight: 600, backgroundColor: 'rgba(2, 119, 189, 0.05)' }}>
                              Talla
                            </TableCell>
                            <TableCell>{productoDetalles.talla}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" sx={{ fontWeight: 600, backgroundColor: 'rgba(2, 119, 189, 0.05)' }}>
                              Género
                            </TableCell>
                            <TableCell>{productoDetalles.genero}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" sx={{ fontWeight: 600, backgroundColor: 'rgba(2, 119, 189, 0.05)' }}>
                              Fecha de Creación
                            </TableCell>
                            <TableCell>
                              {new Date(productoDetalles.fecha_creacion).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" sx={{ fontWeight: 600, backgroundColor: 'rgba(2, 119, 189, 0.05)' }}>
                              Última Actualización
                            </TableCell>
                            <TableCell>
                              {productoDetalles.fecha_actualizacion ? new Date(productoDetalles.fecha_actualizacion).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              }) : 'No actualizado'}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              )}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button
                variant="outlined"
                onClick={handleCloseDetalles}
                sx={{ borderRadius: '12px', fontWeight: 600 }}
              >
                Cerrar
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  handleCloseDetalles();
                  fetchProductoById(productoDetalles.id);
                }}
                startIcon={<Edit />}
                sx={{
                  borderRadius: '12px',
                  fontWeight: 600,
                  backgroundColor: '#0277bd',
                  '&:hover': { backgroundColor: '#01579b' }
                }}
              >
                Editar Producto
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Dialog de confirmación para eliminar producto */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Fade}
        transitionDuration={300}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            overflow: "hidden"
          }
        }}
      >
        <DialogTitle sx={{ bgcolor: "#d32f2f", color: "white", py: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Delete />
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              Confirmar Eliminación
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: "rgba(211, 47, 47, 0.1)",
                color: "#d32f2f",
                width: 50,
                height: 50,
                mr: 2
              }}
            >
              <HighlightOff fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                ¿Eliminar este producto?
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Esta acción no se puede deshacer y el producto será eliminado permanentemente.
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, bgcolor: "rgba(0,0,0,0.02)" }}>
          <Button
            onClick={handleCloseDeleteDialog}
            variant="outlined"
            sx={{
              borderRadius: "12px",
              fontWeight: 600,
              px: 3,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
                bgcolor: "rgba(0,0,0,0.02)"
              }
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleEliminarProducto}
            variant="contained"
            color="error"
            startIcon={<Delete />}
            sx={{
              borderRadius: "12px",
              fontWeight: 600,
              px: 3,
              boxShadow: "0 4px 12px rgba(211, 47, 47, 0.3)",
              bgcolor: "#d32f2f",
              "&:hover": {
                bgcolor: "#b71c1c",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 16px rgba(211, 47, 47, 0.4)"
              },
              transition: "all 0.3s ease"
            }}
          >
            Eliminar Producto
          </Button>
        </DialogActions>
      </Dialog>

      {/* Overlay de carga */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductoFormMejorado;
import React, { useState, useEffect } from "react";
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
  Divider,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import { Edit, Delete, Add, CloudUpload } from "@mui/icons-material";

const ProductoForm = () => {
  const [producto, setProducto] = useState({
    id: null,
    nombre_producto: "",
    descripcion: "",
    precio: "",
    stock: "",
    id_categoria: "",
    id_color: "",
    id_talla: "",
    id_genero: "",
    imagen: null,
  });

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [colores, setColores] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [tabValue, setTabValue] = useState(0);
  const [errors, setErrors] = useState({});

  // Validación de campos
  const validateForm = () => {
    let tempErrors = {};
    
    // Nombre del producto
    if (!producto.nombre_producto.trim()) {
      tempErrors.nombre_producto = "El nombre del producto es requerido";
    } else if (producto.nombre_producto.length < 2) {
      tempErrors.nombre_producto = "El nombre debe tener al menos 2 caracteres";
    } else if (producto.nombre_producto.length > 100) {
      tempErrors.nombre_producto = "El nombre no puede exceder 100 caracteres";
    }
  
    // Descripción
    if (!producto.descripcion.trim()) {
      tempErrors.descripcion = "La descripción es requerida";
    } else if (producto.descripcion.length < 10) {
      tempErrors.descripcion = "La descripción debe tener al menos 10 caracteres";
    } else if (producto.descripcion.length > 500) {
      tempErrors.descripcion = "La descripción no puede exceder 500 caracteres";
    }
  
    // Precio
    if (!producto.precio) {
      tempErrors.precio = "El precio es requerido";
    } else {
      const precioNum = Number(producto.precio);
      if (isNaN(precioNum) || precioNum <= 0) {
        tempErrors.precio = "El precio debe ser un número mayor a 0";
      } else if (precioNum > 999999) {
        tempErrors.precio = "El precio no puede exceder 999,999";
      }
    }
  
    // Stock
    if (!producto.stock) {
      tempErrors.stock = "El stock es requerido";
    } else {
      const stockNum = Number(producto.stock);
      if (!Number.isInteger(stockNum) || stockNum < 0) {
        tempErrors.stock = "El stock debe ser un número entero no negativo";
      } else if (stockNum > 9999) {
        tempErrors.stock = "El stock no puede exceder 9999";
      }
    }
  
    // Categoría
    if (!producto.id_categoria) {
      tempErrors.id_categoria = "Debe seleccionar una categoría";
    }
  
    // Color
    if (!producto.id_color) {
      tempErrors.id_color = "Debe seleccionar un color";
    }
  
    // Talla
    if (!producto.id_talla) {
      tempErrors.id_talla = "Debe seleccionar una talla";
    }
  
    // Género
    if (!producto.id_genero) {
      tempErrors.id_genero = "Debe seleccionar un género";
    }
  
    // Imagen (solo requerida al crear)
    if (!producto.id && !producto.imagen) {
      tempErrors.imagen = "Debe subir una imagen";
    } else if (producto.imagen instanceof File) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(producto.imagen.type)) {
        tempErrors.imagen = "Solo se permiten imágenes JPEG, PNG o GIF";
      } else if (producto.imagen.size > 5 * 1024 * 1024) { // 5MB
        tempErrors.imagen = "La imagen no puede exceder 5MB";
      }
    }
  
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Fetch functions (sin cambios)
  const fetchProductos = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/obtener");
      setProductos(response.data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      setSnackbarMessage("Error al cargar los productos");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/obtenercat");
      setCategorias(response.data);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  const fetchTallas = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/tallas");
      setTallas(response.data);
    } catch (error) {
      console.error("Error al obtener tallas:", error);
    }
  };

  const fetchColores = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/colores");
      setColores(response.data);
    } catch (error) {
      console.error("Error al obtener colores:", error);
    }
  };

  const fetchGeneros = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/generos");
      setGeneros(response.data);
    } catch (error) {
      console.error("Error al obtener géneros:", error);
    }
  };

  const fetchProductoById = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/obtener/${id}`);
      setProducto(response.data);
    } catch (error) {
      console.error("Error al obtener producto:", error);
      setSnackbarMessage("Error al cargar el producto");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleEliminarProducto = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/eliminar/${id}`);
      setSnackbarMessage("Producto eliminado con éxito");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchProductos();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      setSnackbarMessage("Error al eliminar el producto");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      setSnackbarMessage("Por favor, corrija los errores en el formulario");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
  
    try {
      const formData = new FormData();
      
      // Append all product data
      formData.append("nombre_producto", producto.nombre_producto);
      formData.append("descripcion", producto.descripcion);
      formData.append("precio", Number(producto.precio));
      formData.append("stock", Number(producto.stock));
      formData.append("id_categoria", Number(producto.id_categoria));
      formData.append("id_color", Number(producto.id_color));
      formData.append("id_talla", Number(producto.id_talla));
      formData.append("id_genero", Number(producto.id_genero));
  
      // Append image if exists
      if (producto.imagen) {
        formData.append("imagen", producto.imagen);
      }
  
      // Determinar si es una actualización o creación
      const url = producto.id 
        ? `http://localhost:3001/api/actualizar/${producto.id}` 
        : "http://localhost:3001/api/agregarProductos";
  
      const method = producto.id ? 'put' : 'post';
  
      await axios[method](url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      setSnackbarMessage(producto.id ? "Producto actualizado con éxito" : "Producto creado con éxito");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchProductos();
      
      // Reset form
      setProducto({
        id: null,
        nombre_producto: "",
        descripcion: "",
        precio: "",
        stock: "",
        id_categoria: "",
        id_color: "",
        id_talla: "",
        id_genero: "",
        imagen: null,
      });
      setErrors({});
  
    } catch (error) {
      console.error("Error al guardar/actualizar producto:", error);
      setSnackbarMessage("Error al guardar el producto");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto({ ...producto, [name]: value });
    // Validación en tiempo real
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let tempErrors = { ...errors };
    
    switch (name) {
      case "nombre_producto":
        if (!value.trim()) tempErrors.nombre_producto = "El nombre del producto es requerido";
        else if (value.length < 2) tempErrors.nombre_producto = "El nombre debe tener al menos 2 caracteres";
        else if (value.length > 100) tempErrors.nombre_producto = "El nombre no puede exceder 100 caracteres";
        else delete tempErrors.nombre_producto;
        break;
      case "descripcion":
        if (!value.trim()) tempErrors.descripcion = "La descripción es requerida";
        else if (value.length < 10) tempErrors.descripcion = "La descripción debe tener al menos 10 caracteres";
        else if (value.length > 500) tempErrors.descripcion = "La descripción no puede exceder 500 caracteres";
        else delete tempErrors.descripcion;
        break;
      case "precio":
        if (!value) tempErrors.precio = "El precio es requerido";
        else if (isNaN(value) || Number(value) <= 0) tempErrors.precio = "El precio debe ser un número mayor a 0";
        else if (Number(value) > 999999) tempErrors.precio = "El precio no puede exceder 999,999";
        else delete tempErrors.precio;
        break;
      case "stock":
        if (!value) tempErrors.stock = "El stock es requerido";
        else if (!Number.isInteger(Number(value)) || Number(value) < 0) tempErrors.stock = "El stock debe ser un número entero no negativo";
        else if (Number(value) > 9999) tempErrors.stock = "El stock no puede exceder 9999";
        else delete tempErrors.stock;
        break;
      case "id_categoria":
        if (!value) tempErrors.id_categoria = "Debe seleccionar una categoría";
        else delete tempErrors.id_categoria;
        break;
      case "id_color":
        if (!value) tempErrors.id_color = "Debe seleccionar un color";
        else delete tempErrors.id_color;
        break;
      case "id_talla":
        if (!value) tempErrors.id_talla = "Debe seleccionar una talla";
        else delete tempErrors.id_talla;
        break;
      case "id_genero":
        if (!value) tempErrors.id_genero = "Debe seleccionar un género";
        else delete tempErrors.id_genero;
        break;
      default:
        break;
    }
    setErrors(tempErrors);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProducto({ ...producto, imagen: file });
    validateField("imagen", file);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
    fetchTallas();
    fetchColores();
    fetchGeneros();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ padding: "40px 20px" }}>
      <Card sx={{ borderRadius: "12px", boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)", marginBottom: "40px" }}>
        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "700", color: "#0277bd", textAlign: "center" }}>
            Gestión de Productos
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Nombre del producto"
                  name="nombre_producto"
                  value={producto.nombre_producto}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  required
                  error={!!errors.nombre_producto}
                  helperText={errors.nombre_producto}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Descripción"
                  name="descripcion"
                  value={producto.descripcion}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={4}
                  required
                  error={!!errors.descripcion}
                  helperText={errors.descripcion}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Precio"
                  name="precio"
                  value={producto.precio}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  type="number"
                  required
                  inputProps={{ min: "0.01", step: "0.01" }}
                  error={!!errors.precio}
                  helperText={errors.precio}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Stock"
                  name="stock"
                  value={producto.stock}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  type="number"
                  required
                  inputProps={{ min: "0", step: "1" }}
                  error={!!errors.stock}
                  helperText={errors.stock}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" required error={!!errors.id_categoria}>
                  <InputLabel>Categoría</InputLabel>
                  <Select label="Categoría" name="id_categoria" value={producto.id_categoria} onChange={handleChange}>
                    {categorias.map((categoria) => (
                      <MenuItem key={categoria.id_categoria} value={categoria.id_categoria}>
                        {categoria.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.id_categoria && <Typography color="error" variant="caption">{errors.id_categoria}</Typography>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" required error={!!errors.id_color}>
                  <InputLabel>Color</InputLabel>
                  <Select label="Color" name="id_color" value={producto.id_color} onChange={handleChange}>
                    {colores.map((color) => (
                      <MenuItem key={color.id} value={color.id}>
                        {color.color}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.id_color && <Typography color="error" variant="caption">{errors.id_color}</Typography>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" required error={!!errors.id_talla}>
                  <InputLabel>Talla</InputLabel>
                  <Select label="Talla" name="id_talla" value={producto.id_talla} onChange={handleChange}>
                    {tallas.map((talla) => (
                      <MenuItem key={talla.id} value={talla.id}>
                        {talla.talla}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.id_talla && <Typography color="error" variant="caption">{errors.id_talla}</Typography>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" required error={!!errors.id_genero}>
                  <InputLabel>Género</InputLabel>
                  <Select label="Género" name="id_genero" value={producto.id_genero} onChange={handleChange}>
                    {generos.map((genero) => (
                      <MenuItem key={genero.id} value={genero.id}>
                        {genero.genero}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.id_genero && <Typography color="error" variant="caption">{errors.id_genero}</Typography>}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                  id="imagen-producto"
                />
                <label htmlFor="imagen-producto">
                  <Tooltip title="Seleccionar una imagen para el producto">
                    <Button
                      variant="contained"
                      component="span"
                      startIcon={<CloudUpload />}
                      sx={{
                        padding: "8px 16px",
                        fontWeight: "600",
                        borderRadius: "8px",
                        backgroundColor: "#0277bd",
                        "&:hover": { backgroundColor: "#01579b" },
                        transition: "all 0.3s ease",
                      }}
                    >
                      Subir Imagen
                    </Button>
                  </Tooltip>
                </label>
                {errors.imagen && (
                  <Typography color="error" variant="caption" sx={{ display: "block", mt: 1 }}>
                    {errors.imagen}
                  </Typography>
                )}
                {producto.imagen && (
                  <div style={{ marginTop: "16px", textAlign: "center" }}>
                    <Typography variant="body1" sx={{ fontWeight: "600", color: "#0277bd" }}>
                      Imagen del producto
                    </Typography>
                    <img
                      src={producto.imagen instanceof File ? URL.createObjectURL(producto.imagen) : producto.imagen}
                      alt="Vista previa de la imagen"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "200px",
                        borderRadius: "8px",
                        marginBottom: "8px",
                      }}
                    />
                    {producto.imagen instanceof File && (
                      <Typography variant="body2" sx={{ color: "#757575" }}>
                        Archivo seleccionado: {producto.imagen.name}
                      </Typography>
                    )}
                  </div>
                )}
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Add />}
                  sx={{
                    padding: "8px 16px",
                    fontWeight: "600",
                    borderRadius: "8px",
                    backgroundColor: "#0277bd",
                    "&:hover": { backgroundColor: "#01579b" },
                    transition: "all 0.3s ease",
                  }}
                >
                  {producto.id ? "Actualizar Producto" : "Agregar Producto"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {/* Tabla de productos (sin cambios en esta parte) */}
      <Card sx={{ borderRadius: "12px", boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)" }}>
        <CardContent>
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
              WELfontWeight: "700", 
              color: "#0277bd", 
              marginBottom: "24px", 
              textAlign: "center" 
            }}
          >
            Listado de Productos
          </Typography> 
          <Box sx={{ borderBottom: 1, borderColor: "divider", marginBottom: "24px" }}>
            <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
              <Tab label="Información Principal" sx={{ fontWeight: "600" }} />
              <Tab label="Características del Producto" sx={{ fontWeight: "600" }} />
            </Tabs>
          </Box>
          
          {tabValue === 0 && (
            <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: "none" }}>
              <TableContainer sx={{ maxHeight: "80vh" }}>
                <Table stickyHeader sx={{ minWidth: 850 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold", backgroundColor: "#e3f2fd", fontSize: "16px", padding: "12px" }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: "bold", backgroundColor: "#e3f2fd", fontSize: "16px", padding: "12px" }}>Nombre</TableCell>
                      <TableCell sx={{ fontWeight: "bold", backgroundColor: "#e3f2fd", fontSize: "16px", padding: "12px" }}>Descripción</TableCell>
                      <TableCell sx={{ fontWeight: "bold", backgroundColor: "#e3f2fd", fontSize: "16px", padding: "12px" }}>Precio</TableCell>
                      <TableCell sx={{ fontWeight: "bold", backgroundColor: "#e3f2fd", fontSize: "16px", padding: "12px" }}>Stock</TableCell>
                      <TableCell sx={{ fontWeight: "bold", backgroundColor: "#e3f2fd", fontSize: "16px", padding: "12px" }}>Imagen</TableCell>
                      <TableCell sx={{ fontWeight: "bold", backgroundColor: "#e3f2fd", fontSize: "16px", padding: "12px" }}>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productos.map((prod) => (
                      <TableRow key={prod.id} hover sx={{ height: "100px" }}>
                        <TableCell sx={{ padding: "12px" }}>{prod.id}</TableCell>
                        <TableCell sx={{ fontWeight: "500", padding: "12px" }}>{prod.nombre_producto}</TableCell>
                        <TableCell sx={{ maxWidth: "400px", overflowWrap: "break-word", padding: "12px" }}>{prod.descripcion}</TableCell>
                        <TableCell sx={{ padding: "12px" }}>${Number(prod.precio).toFixed(2)}</TableCell>
                        <TableCell sx={{ padding: "12px" }}>{prod.stock}</TableCell>
                        <TableCell sx={{ padding: "12px" }}>
                          {prod.imagen ? (
                            <img
                              src={prod.imagen}
                              alt={prod.nombre_producto}
                              style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                              }}
                            />
                          ) : (
                            <Typography variant="body2" color="textSecondary">
                              Sin imagen
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell sx={{ padding: "12px" }}>
                          <Tooltip title="Editar producto">
                            <IconButton
                              onClick={() => fetchProductoById(prod.id)}
                              sx={{ color: "#0277bd", "&:hover": { backgroundColor: "rgba(2, 119, 189, 0.1)" } }}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar producto">
                            <IconButton
                              onClick={() => handleEliminarProducto(prod.id)}
                              sx={{ color: "#d32f2f", "&:hover": { backgroundColor: "rgba(211, 47, 47, 0.1)" } }}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
          
          {tabValue === 1 && (
            <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: "none" }}>
              <TableContainer sx={{ maxHeight: "80vh" }}>
                <Table stickyHeader sx={{ minWidth: 850 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold", backgroundColor: "#e3f2fd", fontSize: "16px", padding: "12px" }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: "bold", backgroundColor: "#e3f2fd", fontSize: "16px", padding: "12px" }}>Nombre</TableCell>
                      <TableCell sx={{ fontWeight: "bold", backgroundColor: "#e3f2fd", fontSize: "16px", padding: "12px" }}>Talla</TableCell>
                      <TableCell sx={{ fontWeight: "bold", backgroundColor: "#e3f2fd", fontSize: "16px", padding: "12px" }}>Color</TableCell>
                      <TableCell sx={{ fontWeight: "bold", backgroundColor: "#e3f2fd", fontSize: "16px", padding: "12px" }}>Categoría</TableCell>
                      <TableCell sx={{ fontWeight: "bold", backgroundColor: "#e3f2fd", fontSize: "16px", padding: "12px" }}>Género</TableCell>
                      <TableCell sx={{ fontWeight: "bold", backgroundColor: "#e3f2fd", fontSize: "16px", padding: "12px" }}>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productos.map((prod) => (
                      <TableRow key={prod.id} hover sx={{ height: "100px" }}>
                        <TableCell sx={{ padding: "12px" }}>{prod.id}</TableCell>
                        <TableCell sx={{ fontWeight: "500", padding: "12px" }}>{prod.nombre_producto}</TableCell>
                        <TableCell sx={{ padding: "12px" }}>{prod.talla}</TableCell>
                        <TableCell sx={{ padding: "12px" }}>
                          <Box sx={{ 
                            display: "flex", 
                            alignItems: "center",
                            gap: "8px" 
                          }}>
                            <Box sx={{ 
                              width: "24px",
                              height: "24px",
                              backgroundColor: prod.color.toLowerCase(),
                              border: "1px solid #ddd",
                              borderRadius: "4px"
                            }}></Box>
                            {prod.color}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ padding: "12px" }}>{prod.categoria}</TableCell>
                        <TableCell sx={{ padding: "12px" }}>{prod.genero}</TableCell>
                        <TableCell sx={{ padding: "12px" }}>
                          <Tooltip title="Editar producto">
                            <IconButton
                              onClick={() => fetchProductoById(prod.id)}
                              sx={{ color: "#0277bd", "&:hover": { backgroundColor: "rgba(2, 119, 189, 0.1)" } }}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar producto">
                            <IconButton
                              onClick={() => handleEliminarProducto(prod.id)}
                              sx={{ color: "#d32f2f", "&:hover": { backgroundColor: "rgba(211, 47, 47, 0.1)" } }}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </CardContent>
      </Card>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductoForm;
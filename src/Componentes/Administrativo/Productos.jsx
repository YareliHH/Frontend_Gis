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
  // Estado del producto para creación/edición
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

  // Obtener productos
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

  // Obtener categorías desde la BD
  const fetchCategorias = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/obtenercat");
      setCategorias(response.data);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  // Obtener tallas desde la BD
  const fetchTallas = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/tallas");
      setTallas(response.data);
    } catch (error) {
      console.error("Error al obtener tallas:", error);
    }
  };

  // Obtener colores desde la BD
  const fetchColores = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/colores");
      setColores(response.data);
    } catch (error) {
      console.error("Error al obtener colores:", error);
    }
  };

  // Obtener géneros desde la BD
  const fetchGeneros = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/generos");
      setGeneros(response.data);
    } catch (error) {
      console.error("Error al obtener géneros:", error);
    }
  };

  // Obtener un producto por su ID para edición
  const fetchProductoById = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/obtener/${id}`);
      setProducto(response.data); // Se asume que la respuesta incluye el "id" y la URL de la imagen
    } catch (error) {
      console.error("Error al obtener producto:", error);
      setSnackbarMessage("Error al cargar el producto");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Eliminar un producto
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

  // Manejar el submit: crea o actualiza según el modo
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (producto.id) {
        // Modo edición
        // Si se seleccionó una nueva imagen, se envía FormData
        if (producto.imagen instanceof File) {
          const formData = new FormData();
          formData.append("nombre_producto", producto.nombre_producto);
          formData.append("descripcion", producto.descripcion);
          formData.append("precio", producto.precio);
          formData.append("stock", producto.stock);
          formData.append("id_categoria", producto.id_categoria);
          formData.append("id_color", producto.id_color);
          formData.append("id_talla", producto.id_talla);
          formData.append("id_genero", producto.id_genero);
          formData.append("imagenes", producto.imagen);

          await axios.put(`http://localhost:3001/api/actualizar/${producto.id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else {
          // Si no se seleccionó nueva imagen, se envían solo los datos de texto
          await axios.put(`http://localhost:3001/api/actualizar/${producto.id}`, {
            nombre_producto: producto.nombre_producto,
            descripcion: producto.descripcion,
            precio: producto.precio,
            stock: producto.stock,
            id_categoria: producto.id_categoria,
            id_color: producto.id_color,
            id_talla: producto.id_talla,
            id_genero: producto.id_genero,
          });
        }
        setSnackbarMessage("Producto actualizado con éxito");
      } else {
        // Modo creación: enviar FormData
        const formData = new FormData();
        formData.append("nombre_producto", producto.nombre_producto);
        formData.append("descripcion", producto.descripcion);
        formData.append("precio", producto.precio);
        formData.append("stock", producto.stock);
        formData.append("id_categoria", producto.id_categoria);
        formData.append("id_color", producto.id_color);
        formData.append("id_talla", producto.id_talla);
        formData.append("id_genero", producto.id_genero);
        if (producto.imagen) {
          formData.append("imagenes", producto.imagen);
        }
        await axios.post("http://localhost:3001/api/agregarproducto", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSnackbarMessage("Producto creado con éxito");
      }
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchProductos();
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
    } catch (error) {
      console.error("Error al guardar producto:", error);
      setSnackbarMessage("Error al guardar el producto");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto({ ...producto, [name]: value });
  };

  // Manejar cambio en la imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProducto({ ...producto, imagen: file });
  };

  // Cerrar Snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Cambiar de pestaña
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
      {/* Formulario para agregar/editar */}
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
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" required>
                  <InputLabel>Categoría</InputLabel>
                  <Select label="Categoría" name="id_categoria" value={producto.id_categoria} onChange={handleChange}>
                    {categorias.map((categoria) => (
                      <MenuItem key={categoria.id_categoria} value={categoria.id_categoria}>
                        {categoria.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" required>
                  <InputLabel>Color</InputLabel>
                  <Select label="Color" name="id_color" value={producto.id_color} onChange={handleChange}>
                    {colores.map((color) => (
                      <MenuItem key={color.id} value={color.id}>
                        {color.color}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" required>
                  <InputLabel>Talla</InputLabel>
                  <Select label="Talla" name="id_talla" value={producto.id_talla} onChange={handleChange}>
                    {tallas.map((talla) => (
                      <MenuItem key={talla.id} value={talla.id}>
                        {talla.talla}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" required>
                  <InputLabel>Género</InputLabel>
                  <Select label="Género" name="id_genero" value={producto.id_genero} onChange={handleChange}>
                    {generos.map((genero) => (
                      <MenuItem key={genero.id} value={genero.id}>
                        {genero.genero}
                      </MenuItem>
                    ))}
                  </Select>
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
      {/* Tabla de productos con dos secciones */}
      <Card sx={{ borderRadius: "12px", boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)" }}>
        <CardContent>
          <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          fontWeight: "700", 
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
          
          {/* Primera sección: Información básica */}
          {tabValue === 0 && (
            <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: "none" }}>
              <TableContainer sx={{ maxHeight: "80vh" /* Aumentado para mostrar más filas */ }}>
                <Table stickyHeader sx={{ minWidth: 850 /* Aumentado para más espacio horizontal */ }}>
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
                      <TableRow key={prod.id} hover sx={{ height: "100px" /* Aumentado para más espacio vertical por fila */ }}>
                        <TableCell sx={{ padding: "12px" }}>{prod.id}</TableCell>
                        <TableCell sx={{ fontWeight: "500", padding: "12px" }}>{prod.nombre_producto}</TableCell>
                        <TableCell sx={{ maxWidth: "400px" /* Aumentado */, overflowWrap: "break-word", padding: "12px" }}>{prod.descripcion}</TableCell>
                        <TableCell sx={{ padding: "12px" }}>${Number(prod.precio).toFixed(2)}</TableCell>
                        <TableCell sx={{ padding: "12px" }}>{prod.stock}</TableCell>
                        <TableCell sx={{ padding: "12px" }}>
                          {prod.imagen ? (
                            <img
                              src={prod.imagen}
                              alt={prod.nombre_producto}
                              style={{
                                width: "100px" /* Aumentado */,
                                height: "100px" /* Aumentado */,
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
          
          {/* Segunda sección: Características */}
          {tabValue === 1 && (
            <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: "none" }}>
              <TableContainer sx={{ maxHeight: "80vh" /* Aumentado para mostrar más filas */ }}>
                <Table stickyHeader sx={{ minWidth: 850 /* Aumentado para más espacio horizontal */ }}>
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
                      <TableRow key={prod.id} hover sx={{ height: "100px" /* Aumentado para más espacio vertical por fila */ }}>
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
                              width: "24px" /* Aumentado */,
                              height: "24px" /* Aumentado */,
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
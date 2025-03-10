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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";
import { Edit, Delete, Add, CloudUpload, Check, Close } from "@mui/icons-material";

const ProductoForm = () => {
  const [producto, setProducto] = useState({
    id: "",
    nombre_producto: "",
    descripcion: "",
    precio: "",
    talla: "",
    color: "",
    stock: "",
    id_categoria: "",
    genero: "",
    imagen: null,
  });

  const [productos, setProductos] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const categorias = ["Camisetas", "Pantalones", "Zapatos", "Accesorios"];
  const generos = ["Hombre", "Mujer", "Unisex"];
  const tallas = ["S", "M", "L", "XL"];
  const colores = ["Rojo", "Azul", "Verde", "Negro"];

  const fetchProductos = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/productosid");
      setProductos(response.data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      setSnackbarMessage("Error al cargar los productos");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const fetchProductoById = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/obtenerproducto/${id}`);
      setProducto(response.data);
      setOpenDialog(true);
    } catch (error) {
      console.error("Error al obtener producto:", error);
      setSnackbarMessage("Error al cargar el producto");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleAgregarProducto = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nombre_producto", producto.nombre_producto);
    formData.append("descripcion", producto.descripcion);
    formData.append("precio", producto.precio);
    formData.append("talla", producto.talla);
    formData.append("color", producto.color);
    formData.append("stock", producto.stock);
    formData.append("categoria_id", producto.id_categoria);
    formData.append("genero", producto.genero);
    if (producto.imagen) {
      formData.append("imagenes", producto.imagen);
    }
    try {
      const response = await axios.post("http://localhost:3001/api/agregar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSnackbarMessage("Producto creado con éxito");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchProductos();
      console.log("Respuesta del backend:", response.data);
      setProducto({
        id: "",
        nombre_producto: "",
        descripcion: "",
        precio: "",
        talla: "",
        color: "",
        stock: "",
        id_categoria: "",
        genero: "",
        imagen: null,
      });
    } catch (error) {
      console.error("Error al crear producto:", error);
      setSnackbarMessage("Error al crear el producto");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleActualizarProducto = async () => {
    try {
      await axios.put(`http://localhost:3001/api/actualizarproducto/${producto.id}`, producto);
      setSnackbarMessage("Producto actualizado con éxito");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchProductos();
      setOpenDialog(false);
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      setSnackbarMessage("Error al actualizar el producto");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleEliminarProducto = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/eliminarproducto/${id}`);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto({ ...producto, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProducto({ ...producto, imagen: file });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  return (
    <Container maxWidth="md" sx={{ padding: "40px 20px" }}>
      <Card sx={{ borderRadius: "12px", boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)", marginBottom: "40px" }}>
        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "700", color: "#0277bd", textAlign: "center" }}>
            Gestión de Productos
          </Typography>

          {/* Formulario para agregar producto */}
          <form onSubmit={handleAgregarProducto}>
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
                <FormControl fullWidth variant="outlined" required>
                  <InputLabel>Talla</InputLabel>
                  <Select label="Talla" name="talla" value={producto.talla} onChange={handleChange}>
                    {tallas.map((talla) => (
                      <MenuItem key={talla} value={talla}>
                        {talla}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" required>
                  <InputLabel>Color</InputLabel>
                  <Select label="Color" name="color" value={producto.color} onChange={handleChange}>
                    {colores.map((color) => (
                      <MenuItem key={color} value={color}>
                        {color}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                      <MenuItem key={categoria} value={categoria}>
                        {categoria}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" required>
                  <InputLabel>Género</InputLabel>
                  <Select label="Género" name="genero" value={producto.genero} onChange={handleChange}>
                    {generos.map((genero) => (
                      <MenuItem key={genero} value={genero}>
                        {genero}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} id="imagen-producto" />
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
                      src={URL.createObjectURL(producto.imagen)}
                      alt="Vista previa de la imagen"
                      style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "8px", marginBottom: "8px" }}
                    />
                    <Typography variant="body2" sx={{ color: "#757575" }}>
                      Archivo seleccionado: {producto.imagen.name}
                    </Typography>
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
                  Agregar Producto
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {/* Tabla de productos */}
      <Card sx={{ borderRadius: "12px", boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Descripción</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Precio</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Imagen</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Talla</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Color</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Stock</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Categoría</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Género</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productos.map((producto) => (
                <TableRow key={producto.id}>
                  <TableCell>{producto.id}</TableCell>
                  <TableCell>{producto.nombre_producto}</TableCell>
                  <TableCell>{producto.descripcion}</TableCell>
                  <TableCell>{producto.precio}</TableCell>
                  <TableCell>
                    {producto.imagen ? (
                      <img
                        src={producto.imagen} // Asume que producto.imagen es una URL
                        alt={producto.nombre_producto}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        Sin imagen
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{producto.talla || "N/A"}</TableCell>
                  <TableCell>{producto.color || "N/A"}</TableCell>
                  <TableCell>{producto.stock || "N/A"}</TableCell>
                  <TableCell>{producto.id_categoria || "N/A"}</TableCell>
                  <TableCell>{producto.genero || "N/A"}</TableCell>
                  <TableCell>
                    <Tooltip title="Editar producto">
                      <IconButton
                        onClick={() => fetchProductoById(producto.id)}
                        sx={{
                          color: "#0277bd",
                          transition: "all 0.3s ease",
                          "&:hover": { backgroundColor: "rgba(2, 119, 189, 0.1)", transform: "scale(1.1)" },
                        }}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar producto">
                      <IconButton
                        onClick={() => handleEliminarProducto(producto.id)}
                        sx={{
                          color: "#d32f2f",
                          transition: "all 0.3s ease",
                          "&:hover": { backgroundColor: "rgba(211, 47, 47, 0.1)", transform: "scale(1.1)" },
                        }}
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
      </Card>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Editar Producto</DialogTitle>
        <DialogContent>
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
                    <MenuItem key={categoria} value={categoria}>
                      {categoria}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" required>
                <InputLabel>Género</InputLabel>
                <Select label="Género" name="genero" value={producto.genero} onChange={handleChange}>
                  {generos.map((genero) => (
                    <MenuItem key={genero} value={genero}>
                      {genero}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDialog(false)}
            startIcon={<Close />}
            sx={{
              color: "#757575",
              transition: "all 0.3s ease",
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.05)" },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleActualizarProducto}
            variant="contained"
            startIcon={<Check />}
            sx={{
              backgroundColor: "#0277bd",
              "&:hover": { backgroundColor: "#01579b" },
              padding: "8px 16px",
              fontWeight: "600",
              borderRadius: "8px",
              transition: "all 0.3s ease",
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductoForm;
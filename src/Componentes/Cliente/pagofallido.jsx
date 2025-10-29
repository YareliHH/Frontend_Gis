import { Cancel } from "@mui/icons-material";
import { Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function PagoFallido() {
  const navigate = useNavigate();

  const handleReintentarPago = () => {
    navigate("/cliente/pago"); // Redirige a la pantalla de pago
  };

  const handleVolverCarrito = () => {
    navigate("/cliente/carrito-compras"); // Redirige al carrito de compras
  };

  return (
    <Box textAlign="center" p={4}>
      <Cancel sx={{ fontSize: 80, color: "#E53935" }} />
      <Typography variant="h5" mt={2} fontWeight="bold">
        Pago fallido
      </Typography>
      <Typography variant="body1" mt={1}>
        No pudimos procesar tu pago. Intenta nuevamente.
      </Typography>
      <Box mt={3}>
        <Button
          variant="contained"
          color="error"
          sx={{ mr: 2 }}
          onClick={handleReintentarPago}
        >
          Reintentar pago
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={handleVolverCarrito}
        >
          Volver al carrito
        </Button>
      </Box>
    </Box>
  );
}

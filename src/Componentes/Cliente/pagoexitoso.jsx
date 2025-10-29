import { CheckCircle } from "@mui/icons-material";
import { Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function PagoExitoso() {
  const navigate = useNavigate();

  const handleVolverInicio = () => {
    navigate("/cliente"); // Redirige al inicio del cliente
  };

  return (
    <Box textAlign="center" p={4}>
      <CheckCircle sx={{ fontSize: 80, color: "#4CAF50" }} />
      <Typography variant="h5" mt={2} fontWeight="bold">
        ¡Pago exitoso!
      </Typography>
      <Typography variant="body1" mt={1}>
        Tu compra ha sido procesada correctamente.
      </Typography>
      <Box mt={3}>
        <Button
          variant="outlined"
          color="success"
          onClick={handleVolverInicio}
        >
          Volver al inicio
        </Button>
      </Box>
    </Box>
  );
}

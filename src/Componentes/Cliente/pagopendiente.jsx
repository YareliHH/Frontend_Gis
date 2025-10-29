import { AccessTime } from "@mui/icons-material";
import { Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function PagoPendiente() {
  const navigate = useNavigate(); // Hook para navegación

  const handleVolverInicio = () => {
    navigate("/cliente"); // Redirige al inicio del cliente
  };

  return (
    <Box textAlign="center" p={4}>
      <AccessTime sx={{ fontSize: 80, color: "#FFC107" }} />
      <Typography variant="h5" mt={2} fontWeight="bold">
        Pago pendiente
      </Typography>
      <Typography variant="body1" mt={1}>
        Estamos verificando tu pago
      </Typography>
      <Box mt={3}>
        <Button
          variant="outlined"
          sx={{ color: "#FFC107", borderColor: "#FFC107" }}
          onClick={handleVolverInicio}
        >
          Volver al inicio
        </Button>
      </Box>
    </Box>
  );
}

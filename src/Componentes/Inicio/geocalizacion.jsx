import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography
} from "@mui/material";
import LocationIcon from "@mui/icons-material/LocationOn";

const Geocalizacion = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const asked = localStorage.getItem("locationPermissionAsked");

    // Si es PRIMERA VEZ → mostrar modal
    if (!asked) {
      setOpen(true);
      return;
    }

    // Si ya se dio permiso antes → obtener ubicación automáticamente (pero sin guardarla)
    const status = localStorage.getItem("locationPermission");

    if (status === "granted") {
      navigator.geolocation.getCurrentPosition(
        () => console.log("Ubicación obtenida (no guardada)"),
        (err) => console.error("Error obteniendo ubicación:", err)
      );
    }
  }, []);

  const savePermission = (granted) => {
    localStorage.setItem("locationPermissionAsked", "true");
    localStorage.setItem("locationPermission", granted ? "granted" : "denied");
    setOpen(false);
  };

  const handleAllow = () => {
    if (!navigator.geolocation) {
      alert("La geolocalización no es compatible.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        console.log("Permiso otorgado. No se guardan coordenadas.");
        savePermission(true);
      },
      (err) => {
        console.error("Usuario negó o falló:", err);
        savePermission(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleDeny = () => {
    savePermission(false);
  };

  return (
    <>
      <Dialog open={open} onClose={handleDeny}>
        <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
          <LocationIcon sx={{ mr: 1 }} color="primary" />
          Permiso de ubicación
        </DialogTitle>

        <DialogContent>
          <Typography>
            Esta aplicación necesita acceder a tu ubicación para ofrecerte
            información personalizada.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleAllow} variant="contained">
            Permitir
          </Button>
          <Button onClick={handleDeny} color="error">
            Denegar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Geocalizacion;

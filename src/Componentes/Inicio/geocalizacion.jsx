import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography
} from '@mui/material';
import LocationIcon from '@mui/icons-material/LocationOn';

const Geocalizacion = () => {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    const asked = localStorage.getItem('locationPermissionAsked');

    if (asked) {
      const status = localStorage.getItem('locationPermission');
      if (status === 'granted') {
        navigator.geolocation.getCurrentPosition(
          pos => handleSuccess(pos),
          err => console.error(err)
        );
      }
    } else {
      setOpen(true);
    }
  }, []);

  const handleSuccess = (position) => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    // Guardar en localStorage
    localStorage.setItem("locationPermissionAsked", "true");
    localStorage.setItem("locationPermission", "granted");
    localStorage.setItem("latitude", lat);
    localStorage.setItem("longitude", lng);

    setCoords({ lat, lng });
    setOpen(false);
  };

  const handleAllow = () => {
    if (!("geolocation" in navigator)) {
      alert("La geolocalización no es soportada.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => handleSuccess(pos),
      (err) => {
        localStorage.setItem("locationPermissionAsked", "true");
        localStorage.setItem("locationPermission", "denied");
        setOpen(false);
        console.error(err);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleDeny = () => {
    localStorage.setItem("locationPermissionAsked", "true");
    localStorage.setItem("locationPermission", "denied");
    setOpen(false);
  };

  return (
    <>
      {/* Modal de permisos */}
      <Dialog open={open} onClose={handleDeny}>
        <DialogTitle>
          <LocationIcon sx={{ mr: 1 }} color="primary" />
          Permiso de ubicación
        </DialogTitle>
        <DialogContent>
          <Typography>
            Esta aplicación necesita tu ubicación para mostrarte información personalizada.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAllow} variant="contained" color="primary">
            Permitir
          </Button>
          <Button onClick={handleDeny} color="error">
            Denegar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Si ya se obtuvo la ubicación del usuario */}
      {coords && (
        <div style={{ marginTop: "20px" }}>
          <Typography variant="h6">Tu ubicación:</Typography>
          <Typography>Latitud: {coords.lat}</Typography>
          <Typography>Longitud: {coords.lng}</Typography>

          {/* Mapa de GisLive */}
          <div
            style={{
              width: "100%",
              height: "400px",
              marginTop: "20px",
              borderRadius: "10px",
              overflow: "hidden"
            }}
          >
            <iframe
              title="GisLive Mapa"
              width="100%"
              height="100%"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.5209730214216!2d-98.42294!3d21.13635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d76f92ac1bc6bf%3A0x55d68d70e5583f55!2sRopa%20Cl%C3%ADnica%20Gis%20Live!5e0!3m2!1ses!2smx!4v1731960000000!5m2!1ses!2smx"
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
};

export default Geocalizacion;

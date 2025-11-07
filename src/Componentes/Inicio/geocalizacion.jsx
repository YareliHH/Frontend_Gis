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

const LocationPermission = ({ onPermissionGranted, onPermissionDenied }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasAsked = localStorage.getItem('locationPermissionAsked');
    if (hasAsked) {
      const status = localStorage.getItem('locationPermission');
      if (status === 'granted') {
        onPermissionGranted?.();
      } else if (status === 'denied') {
        onPermissionDenied?.(new Error('Ubicación previamente denegada'));
      }
    } else {
      setOpen(true); // Mostrar diálogo si no se ha preguntado antes
    }
  }, [onPermissionDenied, onPermissionGranted]);

  const handleAllow = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          localStorage.setItem('locationPermissionAsked', 'true');
          localStorage.setItem('locationPermission', 'granted');
          setOpen(false);
          onPermissionGranted?.(position);
        },
        (error) => {
          localStorage.setItem('locationPermissionAsked', 'true');
          localStorage.setItem('locationPermission', 'denied');
          setOpen(false);
          onPermissionDenied?.(error);
        },
        {
          timeout: 10000,
          maximumAge: 600000
        }
      );
    } else {
      localStorage.setItem('locationPermissionAsked', 'true');
      localStorage.setItem('locationPermission', 'denied');
      setOpen(false);
      onPermissionDenied?.(new Error('Geolocalización no soportada'));
    }
  };

  const handleDeny = () => {
    localStorage.setItem('locationPermissionAsked', 'true');
    localStorage.setItem('locationPermission', 'denied');
    setOpen(false);
    onPermissionDenied?.(new Error('Permiso de ubicación denegado por el usuario'));
  };

  return (
    <Dialog open={open} onClose={handleDeny}>
      <DialogTitle>
        <LocationIcon color="primary" sx={{ verticalAlign: 'middle', mr: 1 }} />
        Permiso de ubicación
      </DialogTitle>
      <DialogContent>
        <Typography>
          Esta aplicación necesita acceder a tu ubicación para ofrecerte una mejor
          experiencia. ¿Deseas permitir el acceso?
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
  );
};

export default LocationPermission;

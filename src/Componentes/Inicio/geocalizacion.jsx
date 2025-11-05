import React, { useEffect } from 'react';
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
  useEffect(() => {
    const hasAsked = localStorage.getItem('locationPermissionAsked');
    if (hasAsked) {
      const status = localStorage.getItem('locationPermission');
      if (status === 'granted') {
        onPermissionGranted?.();
      } else if (status === 'denied') {
        onPermissionDenied?.(new Error('Ubicación previamente denegada'));
      }
      return;
    }
  }, [onPermissionDenied, onPermissionGranted]);

  const requestLocation = () => {
    localStorage.setItem('locationPermissionAsked', 'true');

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          localStorage.setItem('locationPermission', 'granted');
          onPermissionGranted?.(position);
        },
        (error) => {
          localStorage.setItem('locationPermission', 'denied');
          onPermissionDenied?.(error);
        },
        {
          timeout: 10000,
          maximumAge: 600000
        }
      );
    } else {
      localStorage.setItem('locationPermission', 'denied');
      onPermissionDenied?.(new Error('Geolocalización no soportada'));
    }
  };

  return (
    <Dialog open>
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
        <Button onClick={requestLocation} variant="contained" color="primary">
          Permitir
        </Button>
        <Button
          onClick={() =>
            onPermissionDenied?.(new Error('Permiso de ubicación denegado por el usuario'))
          }
          color="error"
        >
          Denegar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LocationPermission;

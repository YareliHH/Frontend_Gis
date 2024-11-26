import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { format } from 'date-fns';

const Actividades = () => {
  const [actividades, setActividades] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const response = await fetch('https://backendgislive.onrender.com/api/reportes/actividades', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorDetails = await response.json();
          throw new Error(errorDetails.message || 'Error al obtener las actividades');
        }

        const data = await response.json();
        setActividades(data); // Guardar los datos recibidos
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Desactivar el estado de carga
      }
    };

    fetchActividades();
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <Typography variant="h5" sx={{ marginBottom: 2 }}>Actividades Registradas</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#e3f2fd' }}>
                <TableRow>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Actividad</TableCell>
                  <TableCell>Fecha</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {actividades.length > 0 ? (
                actividades.map((actividad) => (
                  <TableRow key={actividad.id}>
                    <TableCell>{actividad.usuario}</TableCell>
                    <TableCell>{actividad.actividad}</TableCell>
                    <TableCell>{format(new Date(actividad.fecha), 'dd/MM/yyyy HH:mm:ss')}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>No hay actividades registradas</TableCell>
              </TableRow>
              )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default Actividades;
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
        const response = await fetch('http://localhost:3001/api/reportes/actividades', {
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
    <Box sx={{ padding: 3, display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ textAlign: 'center', fontSize: '1rem' }}>{error}</Typography>
      ) : (
        <>
        <Paper sx={{ width: '80%', padding: 1, marginBottom: 2, backgroundColor: '#e3f2fd', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold', color: '#1976d2', fontSize: '1rem' }}>
          Actividades Registradas
        </Typography>
      </Paper>
          <TableContainer component={Paper} sx={{ maxWidth: '1000px', width: '80%', borderRadius: 2, boxShadow: 3, padding: 2 }}>
            <Table size="small">
              <TableHead sx={{ backgroundColor: '#1976d2' }}>
                <TableRow>
                  <TableCell sx={{ fontSize: '1rem', fontWeight: 'bold', textAlign: 'center' }}>Usuario</TableCell>
                  <TableCell sx={{ fontSize: '1rem', fontWeight: 'bold', textAlign: 'center' }}>Actividad</TableCell>
                  <TableCell sx={{ fontSize: '1rem', fontWeight: 'bold', textAlign: 'center' }}>Fecha</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {actividades.length > 0 ? (
                  actividades.map((actividad) => (
                    <TableRow key={actividad.id}>
                      <TableCell sx={{ fontSize: '0.9rem', textAlign: 'center' }}>{actividad.usuario}</TableCell>
                      <TableCell sx={{ fontSize: '0.9rem', textAlign: 'center' }}>{actividad.actividad}</TableCell>
                      <TableCell sx={{ fontSize: '0.9rem', textAlign: 'center' }}>
                        {format(new Date(actividad.fecha), 'dd/MM/yyyy HH:mm:ss')}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} sx={{ textAlign: 'center', fontSize: '0.9rem' }}>
                      No hay actividades registradas
                    </TableCell>
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

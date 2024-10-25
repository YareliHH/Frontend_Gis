import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {TextField,Button,Typography,Box,List,ListItem,ListItemText,IconButton,} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const EmpresaComponent = () => {
  const [empresas, setEmpresas] = useState([]);
  const [nombre, setNombre] = useState('');
  const [slogan, setSlogan] = useState('');
  const [logo, setLogo] = useState('');
  const [redesSociales, setRedesSociales] = useState([{ red: '', url: '' }]);
  const [contacto, setContacto] = useState({ direccion: '', correoElectronico: '', telefono: '' });
  const [accion, setAccion] = useState('Crear');
  const [id, setId] = useState('');

  // Obtener empresas al cargar el componente
  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await axios.get('/api/empresas');
        setEmpresas(response.data);
      } catch (error) {
        console.error('Error al obtener empresas:', error);
      }
    };
    fetchEmpresas();
  }, []);

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const empresaData = {
      nombre,
      slogan,
      logo,
      redesSociales,
      contacto,
    };

    try {
      if (accion === 'Crear') {
        await axios.post('/api/empresas', empresaData);
        alert('Empresa creada exitosamente');
      } else {
        await axios.put(`/api/empresas/${id}`, empresaData);
        alert('Empresa actualizada exitosamente');
      }
      // Limpiar el formulario
      resetForm();
      // Volver a obtener las empresas
      const response = await axios.get('/api/empresas');
      setEmpresas(response.data);
    } catch (error) {
      console.error('Error al guardar la empresa:', error);
      alert('Error al guardar la empresa');
    }
  };

  // Manejar la selección de una empresa para editar
  const handleEdit = (empresa) => {
    setId(empresa.id);
    setNombre(empresa.nombre);
    setSlogan(empresa.slogan);
    setLogo(empresa.logo);
    setRedesSociales(empresa.redesSociales);
    setContacto(empresa.contacto);
    setAccion('Actualizar');
  };

  // Manejar el cambio en los campos de texto
  const resetForm = () => {
    setId('');
    setNombre('');
    setSlogan('');
    setLogo('');
    setRedesSociales([{ red: '', url: '' }]);
    setContacto({ direccion: '', correoElectronico: '', telefono: '' });
    setAccion('Crear');
  };

  // Función para añadir una nueva red social
  const handleAddRedSocial = () => {
    setRedesSociales([...redesSociales, { red: '', url: '' }]);
  };

  // Función para manejar el cambio en redes sociales
  const handleRedSocialChange = (index, field, value) => {
    const newRedesSociales = [...redesSociales];
    newRedesSociales[index][field] = value;
    setRedesSociales(newRedesSociales);
  };

  // Función para eliminar una red social
  const handleRemoveRedSocial = (index) => {
    const newRedesSociales = redesSociales.filter((_, i) => i !== index);
    setRedesSociales(newRedesSociales);
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        {accion} Empresa
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          sx={{ marginBottom: 2 }}
        />
        <TextField
          fullWidth
          label="Slogan"
          value={slogan}
          onChange={(e) => setSlogan(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          fullWidth
          label="Logo URL"
          value={logo}
          onChange={(e) => setLogo(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        
        <Typography variant="h6">Redes Sociales</Typography>
        {redesSociales.map((redSocial, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
            <TextField
              label="Red (ej. Facebook, Instagram)"
              value={redSocial.red}
              onChange={(e) => handleRedSocialChange(index, 'red', e.target.value)}
              sx={{ marginRight: 1 }}
            />
            <TextField
              label="URL"
              value={redSocial.url}
              onChange={(e) => handleRedSocialChange(index, 'url', e.target.value)}
              sx={{ marginRight: 1 }}
            />
            <IconButton onClick={() => handleRemoveRedSocial(index)} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
        <Button
          variant="outlined"
          onClick={handleAddRedSocial}
          startIcon={<AddIcon />}
          sx={{ marginBottom: 2 }}
        >
          Añadir Red Social
        </Button>

        <Typography variant="h6">Contacto</Typography>
        <TextField
          fullWidth
          label="Dirección"
          value={contacto.direccion}
          onChange={(e) => setContacto({ ...contacto, direccion: e.target.value })}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          fullWidth
          label="Correo Electrónico"
          type="email"
          value={contacto.correoElectronico}
          onChange={(e) => setContacto({ ...contacto, correoElectronico: e.target.value })}
          required
          sx={{ marginBottom: 2 }}
        />
        <TextField
          fullWidth
          label="Teléfono"
          value={contacto.telefono}
          onChange={(e) => setContacto({ ...contacto, telefono: e.target.value })}
          sx={{ marginBottom: 2 }}
        />
        <Button variant="contained" type="submit" sx={{ marginTop: 2 }}>
          {accion} Empresa
        </Button>
      </form>

      <Typography variant="h4" gutterBottom sx={{ marginTop: 4 }}>
        Lista de Empresas
      </Typography>
      <List>
        {empresas.map((empresa) => (
          <ListItem key={empresa.id} secondaryAction={
            <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(empresa)}>
              <EditIcon />
            </IconButton>
          }>
            <ListItemText primary={empresa.nombre} secondary={empresa.slogan} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default EmpresaComponent;

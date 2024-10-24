import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EmpresaComponent = () => {
  const [empresas, setEmpresas] = useState([]);
  const [nombre, setNombre] = useState('');
  const [slogan, setSlogan] = useState('');
  const [logo, setLogo] = useState('');
  const [redesSociales, setRedesSociales] = useState({ facebook: '', instagram: '' });
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
    setRedesSociales({ facebook: '', instagram: '' });
    setContacto({ direccion: '', correoElectronico: '', telefono: '' });
    setAccion('Crear');
  };

  return (
    <div>
      <h2>{accion} Empresa</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Slogan"
          value={slogan}
          onChange={(e) => setSlogan(e.target.value)}
        />
        <input
          type="text"
          placeholder="Logo URL"
          value={logo}
          onChange={(e) => setLogo(e.target.value)}
        />
        <input
          type="text"
          placeholder="Facebook URL"
          value={redesSociales.facebook}
          onChange={(e) => setRedesSociales({ ...redesSociales, facebook: e.target.value })}
        />
        <input
          type="text"
          placeholder="Instagram URL"
          value={redesSociales.instagram}
          onChange={(e) => setRedesSociales({ ...redesSociales, instagram: e.target.value })}
        />
        <input
          type="text"
          placeholder="Dirección"
          value={contacto.direccion}
          onChange={(e) => setContacto({ ...contacto, direccion: e.target.value })}
        />
        <input
          type="email"
          placeholder="Correo Electrónico"
          value={contacto.correoElectronico}
          onChange={(e) => setContacto({ ...contacto, correoElectronico: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Teléfono"
          value={contacto.telefono}
          onChange={(e) => setContacto({ ...contacto, telefono: e.target.value })}
        />
        <button type="submit">{accion} Empresa</button>
      </form>

      <h2>Lista de Empresas</h2>
      <ul>
        {empresas.map((empresa) => (
          <li key={empresa.id}>
            <h3>{empresa.nombre}</h3>
            <p>{empresa.slogan}</p>
            <button onClick={() => handleEdit(empresa)}>Editar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmpresaComponent;

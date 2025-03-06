import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const productos = [
  { id: 1, nombre: "Filipina Azul", categoria: "uniforme", precio: 450 },
  { id: 2, nombre: "Pantalón Blanco", categoria: "uniforme", precio: 350 },
  { id: 3, nombre: "Bata Médica", categoria: "bata", precio: 550 },
  // Agrega más productos aquí...
];

const Busqueda = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("query");

  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    if (query) {
      const filtrados = productos.filter((producto) =>
        producto.nombre.toLowerCase().includes(query.toLowerCase())
      );
      setResultados(filtrados);
    }
  }, [query]);

  return (
    <div>
      <h2>Resultados de búsqueda para "{query}"</h2>
      {resultados.length > 0 ? (
        <ul>
          {resultados.map((producto) => (
            <li key={producto.id}>
              {producto.nombre} - ${producto.precio}
            </li>
          ))}
        </ul>
      ) : (
        <p>No se encontraron resultados.</p>
      )}
    </div>
  );
};

export default Busqueda;

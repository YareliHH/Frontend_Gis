import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/ventas"; // Ajusta la URL según tu configuración

const Ventas = () => {
    const [ventas, setVentas] = useState([]);
    const [nuevaVenta, setNuevaVenta] = useState({
        cantidad: "",
        precio_unitario: "",
        total: "",
        fecha: "",
        metodo_pago: ""
    });

    // Obtener todas las ventas
    useEffect(() => {
        axios.get(API_URL)
            .then(response => setVentas(response.data))
            .catch(error => console.error("Error obteniendo ventas:", error));
    }, []);

    // Obtener una venta por ID
    const obtenerVenta = (id) => {
        axios.get(`${API_URL}/${id}`)
            .then(response => console.log("Venta obtenida:", response.data))
            .catch(error => console.error("Error obteniendo la venta:", error));
    };

    // Registrar una nueva venta
    const registrarVenta = () => {
        axios.post(API_URL, nuevaVenta)
            .then(response => {
                console.log(response.data.mensaje);
                setVentas([...ventas, { ...nuevaVenta, id: response.data.id }]);
                setNuevaVenta({ cantidad: "", precio_unitario: "", total: "", fecha: "", metodo_pago: "" });
            })
            .catch(error => console.error("Error registrando la venta:", error));
    };

    // Actualizar una venta
    const actualizarVenta = (id) => {
        axios.put(`${API_URL}/${id}`, nuevaVenta)
            .then(response => {
                console.log(response.data.mensaje);
                setVentas(ventas.map(v => (v.id === id ? { ...v, ...nuevaVenta } : v)));
            })
            .catch(error => console.error("Error actualizando la venta:", error));
    };

    // Eliminar una venta
    const eliminarVenta = (id) => {
        axios.delete(`${API_URL}/${id}`)
            .then(response => {
                console.log(response.data.mensaje);
                setVentas(ventas.filter(v => v.id !== id));
            })
            .catch(error => console.error("Error eliminando la venta:", error));
    };

    return (
        <div>
            <h1>Gestión de Ventas</h1>
            <input type="number" placeholder="Cantidad" value={nuevaVenta.cantidad} onChange={e => setNuevaVenta({ ...nuevaVenta, cantidad: e.target.value })} />
            <input type="number" placeholder="Precio Unitario" value={nuevaVenta.precio_unitario} onChange={e => setNuevaVenta({ ...nuevaVenta, precio_unitario: e.target.value })} />
            <input type="number" placeholder="Total" value={nuevaVenta.total} onChange={e => setNuevaVenta({ ...nuevaVenta, total: e.target.value })} />
            <input type="date" value={nuevaVenta.fecha} onChange={e => setNuevaVenta({ ...nuevaVenta, fecha: e.target.value })} />
            <input type="text" placeholder="Método de Pago" value={nuevaVenta.metodo_pago} onChange={e => setNuevaVenta({ ...nuevaVenta, metodo_pago: e.target.value })} />
            <button onClick={registrarVenta}>Registrar Venta</button>

            <h2>Lista de Ventas</h2>
            <ul>
                {ventas.map(venta => (
                    <li key={venta.id}>
                        {venta.cantidad} - {venta.precio_unitario} - {venta.total} - {venta.fecha} - {venta.metodo_pago}
                        <button onClick={() => obtenerVenta(venta.id)}>Ver</button>
                        <button onClick={() => actualizarVenta(venta.id)}>Actualizar</button>
                        <button onClick={() => eliminarVenta(venta.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Ventas;

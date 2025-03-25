import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Crear contexto del carrito
const CarritoContext = createContext();
export const useCarrito = () => useContext(CarritoContext);

export const CarritoProvider = ({ children }) => {
    const [carrito, setCarrito] = useState([]);
    const usuario_id = 1; // ID del usuario autenticado (ajústalo según tu autenticación)

    useEffect(() => {
        obtenerCarrito();
    }, []);

    const obtenerCarrito = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/carrito/${usuario_id}`);
            setCarrito(response.data);
        } catch (error) {
            console.error("Error al obtener el carrito:", error);
        }
    };

    const agregarProducto = async (producto_id) => {
        try {
            await axios.post("http://localhost:3000/carrito/agregar", { usuario_id, producto_id });
            obtenerCarrito();
        } catch (error) {
            console.error("Error al agregar el producto:", error);
        }
    };

    const eliminarProducto = async (producto_id) => {
        try {
            await axios.delete(`http://localhost:3000/carrito/eliminar/${usuario_id}/${producto_id}`);
            obtenerCarrito();
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
        }
    };

    const vaciarCarrito = async () => {
        try {
            await axios.delete(`http://localhost:3000/carrito/vaciar/${usuario_id}`);
            setCarrito([]);
        } catch (error) {
            console.error("Error al vaciar el carrito:", error);
        }
    };

    return (
        <CarritoContext.Provider value={{ carrito, agregarProducto, eliminarProducto, vaciarCarrito }}>
            {children}
        </CarritoContext.Provider>
    );
};

// Componente de Carrito
const Carrito = () => {
    const { carrito, eliminarProducto, vaciarCarrito } = useCarrito();

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Carrito de Compras</h2>
            {carrito.length === 0 ? (
                <p>No hay productos en el carrito</p>
            ) : (
                <ul>
                    {carrito.map((producto) => (
                        <li key={producto.producto_id} className="flex justify-between p-2 border-b">
                            <span>{producto.nombre}</span>
                            <button onClick={() => eliminarProducto(producto.producto_id)} className="text-red-500">Eliminar</button>
                        </li>
                    ))}
                </ul>
            )}
            {carrito.length > 0 && (
                <button onClick={vaciarCarrito} className="mt-4 bg-red-500 text-white p-2 rounded">
                    Vaciar Carrito
                </button>
            )}
        </div>
    );
};

// Componente de Producto
const Producto = ({ producto }) => {
    const { agregarProducto } = useCarrito();

    return (
        <div className="border p-4 rounded shadow">
            <h3 className="text-lg font-bold">{producto.nombre}</h3>
            <button onClick={() => agregarProducto(producto.id)} className="mt-2 bg-blue-500 text-white p-2 rounded">
                Agregar al Carrito
            </button>
        </div>
    );
};

// Componente Principal
const App = () => {
    return (
        <CarritoProvider>
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-6">Tienda</h1>
                <Carrito />
            </div>
        </CarritoProvider>
    );
};

export default App;

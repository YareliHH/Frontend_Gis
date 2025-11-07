import { renderHook, waitFor } from "@testing-library/react";
import { useState, useEffect } from "react";
import axios from "axios";

// Mock de axios
jest.mock("axios");

const API_URL = "https://backend-gis-1.onrender.com/api/insignias";

function useObtenerInsignias() {
  const [insignias, setInsignias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsignias = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_URL}/obtener`);
        setInsignias(res.data);
      } catch (error) {
        setInsignias([]);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInsignias();
  }, []);

  return { insignias, loading, error };
}

describe("Pruebas de integración - API Insignias", () => {
  
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada test
    jest.clearAllMocks();
  });

  test("Debe obtener correctamente las insignias desde la API", async () => {
    const insigniasMock = [
      { id: 1, nombre: "Explorador", tipo: "Logro", regla: "Visitar 5 lugares" },
      { id: 2, nombre: "Veteranoo", tipo: "Experiencia", regla: "10 compras completadas" },
    ];

    // Configurar el mock para que resuelva con los datos
    axios.get.mockResolvedValueOnce({ data: insigniasMock });

    const { result } = renderHook(() => useObtenerInsignias());

    // Esperar a que las insignias se carguen
    await waitFor(
      () => {
        expect(result.current.insignias).toHaveLength(2);
      },
      { timeout: 5000 }
    );

    // Verificar que los datos son correctos
    expect(result.current.insignias).toEqual(insigniasMock);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    
    // Verificar que se llamó con la URL correcta
    expect(axios.get).toHaveBeenCalledWith(`${API_URL}/obtener`);
  });

  test("Debe manejar errores al obtener insignias", async () => {
    // Configurar el mock para que rechace con un error
    const errorMessage = "Request failed with status code 500";
    axios.get.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useObtenerInsignias());

    // Esperar a que el error se establezca
    await waitFor(
      () => {
        expect(result.current.error).not.toBeNull();
      },
      { timeout: 5000 }
    );

    expect(result.current.insignias).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  test("Debe manejar respuesta vacía de la API", async () => {
    // Configurar mock para devolver array vacío
    axios.get.mockResolvedValueOnce({ data: [] });

    const { result } = renderHook(() => useObtenerInsignias());

    // Esperar a que loading sea false
    await waitFor(
      () => {
        expect(result.current.loading).toBe(false);
      },
      { timeout: 5000 }
    );

    expect(result.current.insignias).toEqual([]);
    expect(result.current.insignias).toHaveLength(0);
    expect(result.current.error).toBeNull();
  });

  test("Debe manejar timeout de la API", async () => {
    // Configurar mock para timeout
    const timeoutError = new Error("timeout of 5000ms exceeded");
    timeoutError.code = "ECONNABORTED";
    axios.get.mockRejectedValueOnce(timeoutError);

    const { result } = renderHook(() => useObtenerInsignias());

    // Esperar a que el error de timeout se establezca
    await waitFor(
      () => {
        expect(result.current.error).not.toBeNull();
      },
      { timeout: 5000 }
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.insignias).toEqual([]);
    expect(result.current.error).toContain("timeout");
  });
});
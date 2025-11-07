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
    jest.clearAllMocks();
  });

  test("Debe obtener correctamente las insignias desde la API", async () => {
    const insigniasMock = [
      { id: 1, nombre: "Explorador", tipo: "Logro", regla: "Visitar 5 lugares" },
      { id: 2, nombre: "Veteranoooooo", tipo: "Experiencia", regla: "10 compras completadas" }
    ];

    axios.get.mockResolvedValueOnce({ data: insigniasMock });

    const { result } = renderHook(() => useObtenerInsignias());

    await waitFor(() => {
      expect(result.current.insignias).toHaveLength(2);
    });

    // ✅ Validar estructura y tipos
    result.current.insignias.forEach((insignia) => {
      expect(typeof insignia.id).toBe("number");
      expect(typeof insignia.nombre).toBe("string");
      expect(typeof insignia.tipo).toBe("string");
      expect(typeof insignia.regla).toBe("string");

      expect(insignia.nombre.length).toBeGreaterThan(0);
      expect(insignia.regla.length).toBeGreaterThan(0);

      // ✅ Tipos válidos
      expect(["Logro", "Experiencia", "Nivel"]).toContain(insignia.tipo);
    });

    // ✅ Validación exacta (fallará si editas algo)
    expect(result.current.insignias[0]).toEqual({
      id: 1,
      nombre: "Explorador",
      tipo: "Logro",
      regla: "Visitar 5 lugares"
    });

    expect(result.current.insignias[1]).toEqual({
      id: 2,
      nombre: "Veterano",
      tipo: "Experiencia",
      regla: "10 compras completadas"
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test("Debe manejar errores al obtener insignias", async () => {
    const errorMessage = "Request failed with status code 500";
    axios.get.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useObtenerInsignias());

    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });

    expect(result.current.insignias).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  test("Debe manejar respuesta vacía de la API", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    const { result } = renderHook(() => useObtenerInsignias());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.insignias).toEqual([]);
    expect(result.current.insignias).toHaveLength(0);
    expect(result.current.error).toBeNull();
  });

  test("Debe manejar timeout de la API", async () => {
    const timeoutError = new Error("timeout of 5000ms exceeded");
    timeoutError.code = "ECONNABORTED";
    axios.get.mockRejectedValueOnce(timeoutError);

    const { result } = renderHook(() => useObtenerInsignias());

    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.insignias).toEqual([]);
    expect(result.current.error).toContain("timeout");
  });
});

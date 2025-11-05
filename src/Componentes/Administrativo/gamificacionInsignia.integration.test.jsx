import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useState, useEffect } from "react";

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
  let mock;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  test("Debe obtener correctamente las insignias desde la API", async () => {
    const insigniasMock = [
      { id: 1, nombre: "Explorador", tipo: "Logro", regla: "Visitar 5 lugares" },
      { id: 2, nombre: "Veterano", tipo: "Experiencia", regla: "10 compras completadas" },
    ];

    mock.onGet(`${API_URL}/obtener`).reply(200, insigniasMock);

    const { result } = renderHook(() => useObtenerInsignias());

    // Verificar estado inicial
    expect(result.current.loading).toBe(true);
    expect(result.current.insignias).toEqual([]);

    // Esperar a que se complete la petición
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.insignias).toEqual(insigniasMock);
    expect(result.current.insignias).toHaveLength(2);
    expect(result.current.error).toBeNull();
  });

  test("Debe manejar errores al obtener insignias", async () => {
    mock.onGet(`${API_URL}/obtener`).reply(500);

    const { result } = renderHook(() => useObtenerInsignias());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.insignias).toEqual([]);
    expect(result.current.error).toBeTruthy();
  });

  test("Debe manejar respuesta vacía de la API", async () => {
    mock.onGet(`${API_URL}/obtener`).reply(200, []);

    const { result } = renderHook(() => useObtenerInsignias());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.insignias).toEqual([]);
    expect(result.current.insignias).toHaveLength(0);
  });

  test("Debe manejar timeout de la API", async () => {
    mock.onGet(`${API_URL}/obtener`).timeout();

    const { result } = renderHook(() => useObtenerInsignias());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.insignias).toEqual([]);
    expect(result.current.error).toBeTruthy();
  });
});
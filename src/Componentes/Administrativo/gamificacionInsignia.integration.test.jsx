import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { renderHook, waitFor } from "@testing-library/react";
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

  beforeEach(() => {
    // Crear una nueva instancia del mock antes de cada test
    mock = new MockAdapter(axios, { delayResponse: 0 });
  });

  afterEach(() => {
    // Limpiar y restaurar después de cada test
    mock.reset();
    mock.restore();
  });

  test("Debe obtener correctamente las insignias desde la API", async () => {
    const insigniasMock = [
      { id: 1, nombre: "Explorador", tipo: "Logro", regla: "Visitar 5 lugares" },
      { id: 2, nombre: "Veterano", tipo: "Experiencia", regla: "10 compras completadas" },
    ];

    // Configurar el mock ANTES de renderizar el hook
    mock.onGet(`${API_URL}/obtener`).reply(200, insigniasMock);

    const { result } = renderHook(() => useObtenerInsignias());

    // Esperar a que loading sea false
    await waitFor(
      () => {
        expect(result.current.loading).toBe(false);
      },
      { timeout: 3000 }
    );

    // Verificar resultados
    expect(result.current.insignias).toHaveLength(2);
    expect(result.current.insignias).toEqual(insigniasMock);
    expect(result.current.error).toBeNull();
  });

  test("Debe manejar errores al obtener insignias", async () => {
    mock.onGet(`${API_URL}/obtener`).reply(500);

    const { result } = renderHook(() => useObtenerInsignias());

    await waitFor(
      () => {
        expect(result.current.loading).toBe(false);
      },
      { timeout: 3000 }
    );

    expect(result.current.insignias).toEqual([]);
    expect(result.current.error).toBeTruthy();
  });

  test("Debe manejar respuesta vacía de la API", async () => {
    mock.onGet(`${API_URL}/obtener`).reply(200, []);

    const { result } = renderHook(() => useObtenerInsignias());

    await waitFor(
      () => {
        expect(result.current.loading).toBe(false);
      },
      { timeout: 3000 }
    );

    expect(result.current.insignias).toEqual([]);
    expect(result.current.insignias).toHaveLength(0);
  });

  test("Debe manejar timeout de la API", async () => {
    mock.onGet(`${API_URL}/obtener`).timeout();

    const { result } = renderHook(() => useObtenerInsignias());

    await waitFor(
      () => {
        expect(result.current.loading).toBe(false);
      },
      { timeout: 3000 }
    );

    expect(result.current.insignias).toEqual([]);
    expect(result.current.error).toBeTruthy();
  });
});
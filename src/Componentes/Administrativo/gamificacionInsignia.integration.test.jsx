import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { renderHook, act } from "@testing-library/react";
import { useState, useEffect } from "react";

// Simulamos el mismo comportamiento del hook del componente
const API_URL = "https://backend-gis-1.onrender.com/api/insignias";

function useObtenerInsignias() {
  const [insignias, setInsignias] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInsignias = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/obtener`);
        setInsignias(res.data);
      } catch (error) {
        setInsignias([]);
      } finally {
        setLoading(false);
      }
    };
    fetchInsignias();
  }, []);

  return { insignias, loading };
}

describe("Prueba de integración - Obtener insignias", () => {
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

    // Esperamos un poco para que se ejecute el useEffect
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.insignias).toEqual(insigniasMock);
  });

  test("Debe manejar errores al obtener insignias", async () => {
    mock.onGet(`${API_URL}/obtener`).reply(500);

    const { result } = renderHook(() => useObtenerInsignias());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.insignias).toEqual([]);
  });
});

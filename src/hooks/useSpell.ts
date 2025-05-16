import { useCallback, useEffect, useState } from "react";
import type { Spell, CastResult } from "../api/spell";
import {
  fetchSpell,
  castSpell,
  sendInput as sendInputApi,
  invokeSpell,
  getInputBuffer,
} from "../api/spell";

export function useSpell() {
  const [spell, setSpell] = useState<Spell | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inputBuffer, setInputBuffer] = useState<string[]>([]); // 🆕 актуальный буфер орбов с сервера

  const loadSpell = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchSpell();
      setSpell(data);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        setError(err.message);
      } else {
        setError("Unknown error");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const loadInputBuffer = useCallback(async () => {
    try {
      const buffer = await getInputBuffer();
      setInputBuffer(buffer);
    } catch (err) {
      console.error("Failed to load input buffer:", err);
    }
  }, []);

  // ✅ Отправить орб (Q/W/E)
  const sendInput = useCallback(
    async (key: string) => {
      try {
        await sendInputApi(key);
        await loadInputBuffer(); // 🧠 обновляем буфер после ввода
      } catch (err: unknown) {
        console.error("Failed to send input:", err);
      }
    },
    [loadInputBuffer]
  );

  // ✅ Выполнить каст
  const invoke = useCallback(async (): Promise<CastResult | null> => {
    try {
      const result = await invokeSpell();
      if (result) {
        setSpell(result.spell);
        setInputBuffer([]); // 🧹 очищаем буфер после каста
        return result;
      }
      return null;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Invoke failed");
      }
      return null;
    }
  }, []);

  const cast = useCallback(
    async (combo: string): Promise<CastResult | null> => {
      try {
        const result = await castSpell(combo);
        if (result) {
          setSpell(result.spell);
          return result;
        }
        return null;
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to cast");
        }
        return null;
      }
    },
    []
  );

  useEffect(() => {
    loadSpell();
    loadInputBuffer();
  }, [loadSpell, loadInputBuffer]);

  return {
    spell,
    loading,
    error,
    inputBuffer, // 🧠 отдаём в UI
    sendInput,
    invoke,
    cast,
    refresh: loadSpell,
  };
}

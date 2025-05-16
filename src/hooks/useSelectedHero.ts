import { useCallback, useEffect, useState } from "react";
import type { Hero } from "../api/hero"; // ✅ исправили импорт
import { fetchSelectedHero, selectHero } from "../api/hero";

export function useSelectedHero() {
  const [hero, setHero] = useState<Hero | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSelectedHero()
      .then(setHero)
      .catch(() => setError("Failed to load selected hero"));
  }, []);

  const refreshHero = useCallback(async () => {
    try {
      const h = await fetchSelectedHero();
      setHero(h);
    } catch {
      setError("Failed to refresh hero");
    }
  }, []);

  const chooseHero = useCallback(async (newHero: Hero) => {
    try {
      await selectHero(newHero);
      setHero(newHero);
      return true;
    } catch {
      // ✅ err не нужен — подчинились линтеру
      setError("Too soon! Wait a bit before choosing again.");
      return false;
    }
  }, []);

  return {
    hero,
    chooseHero,
    refreshHero,
    error,
  };
}

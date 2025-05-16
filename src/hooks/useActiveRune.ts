import { useEffect, useState } from "react";

export interface Rune {
  name: string;
  description: string;
  image: string;
}

const STORAGE_KEY = "activeRune";

export function useActiveRune(durationSeconds: number = 45) {
  const [activeRune, setActiveRune] = useState<Rune | null>(null);
  const [timer, setTimer] = useState(0);

  // Чтение из localStorage при загрузке
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const expiresAt = parsed.expiresAt;
      const now = Date.now();

      if (expiresAt > now) {
        setActiveRune(parsed.rune);
        setTimer(Math.floor((expiresAt - now) / 1000));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Таймер и сброс
  useEffect(() => {
    if (!activeRune || timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setActiveRune(null);
          localStorage.removeItem(STORAGE_KEY);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeRune, timer]);

  const pickUpRune = (rune: Rune) => {
    const expiresAt = Date.now() + durationSeconds * 1000;
    setActiveRune(rune);
    setTimer(durationSeconds);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ rune, expiresAt }));
  };

  return { activeRune, timer, pickUpRune };
}

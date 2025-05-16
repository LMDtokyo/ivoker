export interface Spell {
  id: string;
  combo: string;
  image: string;
}

export interface CastResult {
  success: boolean;
  rank: string;
  cast_time_ms: number;
  spell: Spell;
}

const BASE_URL = "http://localhost:3001";

// 🔁 Получить текущий активный спелл
export async function fetchSpell(): Promise<Spell> {
  const res = await fetch(`${BASE_URL}/spell`);
  if (!res.ok) throw new Error("Failed to fetch spell");
  return res.json();
}

// 🧪 (необязательный старый метод)
export async function castSpell(combo: string): Promise<CastResult | null> {
  const res = await fetch(`${BASE_URL}/cast`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(combo),
  });

  if (!res.ok) throw new Error("Failed to cast spell");
  const result = await res.json();
  return result ?? null;
}

// ✅ Отправить один орб (Q/W/E)
export async function sendInput(key: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/input`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(key),
  });

  if (!res.ok) throw new Error("Failed to send input");
}

// ✅ Вызвать инвокацию (нажатие R)
export async function invokeSpell(): Promise<CastResult | null> {
  const res = await fetch(`${BASE_URL}/invoke`, {
    method: "POST",
  });

  if (!res.ok) throw new Error("Failed to invoke spell");
  const result = await res.json();
  return result ?? null;
}

// ✅ Получить текущий буфер орбов (["Q", "W", "E"])
export async function getInputBuffer(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/input/buffer`);
  if (!res.ok) throw new Error("Failed to fetch input buffer");
  return res.json();
}

export interface Rune {
  name: string;
  description: string;
}

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export async function fetchRune(): Promise<Rune> {
  const res = await fetch(`${BASE_URL}/rune`);
  if (!res.ok) throw new Error("Failed to fetch rune");
  return await res.json();
}

export interface Rune {
  name: string;
  description: string;
}

export async function fetchRune(): Promise<Rune> {
  const res = await fetch("http://localhost:3001/rune");
  if (!res.ok) throw new Error("Failed to fetch rune");
  return await res.json();
}

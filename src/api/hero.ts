export interface Hero {
  name: string;
  image: string;
}

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export async function selectHero(hero: Hero): Promise<void> {
  await fetch(`${BASE_URL}/hero/select`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(hero),
  });
}

export async function fetchSelectedHero(): Promise<Hero | null> {
  const res = await fetch(`${BASE_URL}/hero/active`);
  return res.ok ? await res.json() : null;
}

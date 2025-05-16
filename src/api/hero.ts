export interface Hero {
  name: string;
  image: string;
}

export async function selectHero(hero: Hero): Promise<void> {
  await fetch("http://localhost:3001/hero/select", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(hero),
  });
}

export async function fetchSelectedHero(): Promise<Hero | null> {
  const res = await fetch("http://localhost:3001/hero/active");
  return res.ok ? await res.json() : null;
}

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export async function fetchGreeting(name: string): Promise<string> {
  const res = await fetch(
    `${BASE_URL}/greeting?name=${encodeURIComponent(name)}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch greeting from server");
  }

  return await res.text();
}

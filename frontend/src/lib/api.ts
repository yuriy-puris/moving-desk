const BASE_URL = import.meta.env.VITE_API_URL as string

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    ...init,
  })

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }

  return res.json() as Promise<T>
}

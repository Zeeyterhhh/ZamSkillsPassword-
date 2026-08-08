// API Helper for Zamfara Skills Passport REST Endpoints

export async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {})
    },
    ...options
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'An unexpected error occurred' }));
    throw new Error(errorData.error || `HTTP error ${res.status}`);
  }

  return res.json() as Promise<T>;
}

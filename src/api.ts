export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`GET ${path} failed`);
  return response.json();
}

export async function apiSend<T>(path: string, method: string, body?: unknown): Promise<T> {
  const response = await fetch(path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok && response.status !== 204) throw new Error(`${method} ${path} failed`);
  if (response.status === 204) return undefined as T;
  return response.json();
}

export const DEFAULT_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';
export const DEFAULT_API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN ?? '';

export interface ApiClientConfig {
  baseUrl: string;
  token?: string;
}

interface ApiRequestInit extends RequestInit {
  json?: unknown;
}

function joinUrl(baseUrl: string, path: string) {
  const normalizedBase = baseUrl.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

export async function apiRequest<T>(config: ApiClientConfig, path: string, init: ApiRequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers instanceof Headers ? Object.fromEntries(init.headers.entries()) : (init.headers as Record<string, string> | undefined)),
  };

  if (config.token) {
    headers['Authorization'] = `Bearer ${config.token}`;
  }

  const response = await fetch(joinUrl(config.baseUrl, path), {
    ...init,
    headers,
    body: init.json !== undefined ? JSON.stringify(init.json) : init.body,
  });

  const text = await response.text();
  let parsed: unknown;
  try {
    parsed = text ? JSON.parse(text) : undefined;
  } catch (err) {
    parsed = undefined;
  }

  if (!response.ok) {
    const message = (parsed as { message?: string } | undefined)?.message ?? text || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return parsed as T;
}

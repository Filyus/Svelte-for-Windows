import type { ApiType } from './api';

// Client-side API functions
export async function fetchApi<T extends keyof ApiType>(
  endpoint: T,
  data?: ApiType[T]['input']
): Promise<ApiType[T]['output']> {
  const response = await fetch(`http://localhost:3000/api/${endpoint}`, {
    method: data ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  });
  return response.json();
} 
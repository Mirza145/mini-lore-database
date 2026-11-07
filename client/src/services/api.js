const BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

function buildQuery(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') search.set(key, value);
  });
  const query = search.toString();
  return query ? `?${query}` : '';
}

async function request(path, { method = 'GET', body, signal } = {}) {
  let response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new ApiError('Could not reach the server. Is the API running on port 5000?', 0);
  }

  const text = await response.text();
  let payload = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    throw new ApiError(
      payload?.error?.message || `Request failed with status ${response.status}.`,
      response.status,
      payload?.error?.details,
    );
  }

  return payload?.data ?? payload;
}

export const api = {
  health: () => request('/health'),
  getStats: () => request('/stats'),

  listCharacters: (params) => request(`/characters${buildQuery(params)}`),
  getCharacter: (id) => request(`/characters/${id}`),
  createCharacter: (payload) => request('/characters', { method: 'POST', body: payload }),
  updateCharacter: (id, payload) => request(`/characters/${id}`, { method: 'PATCH', body: payload }),
  deleteCharacter: (id) => request(`/characters/${id}`, { method: 'DELETE' }),

  listRelationships: (params) => request(`/relationships${buildQuery(params)}`),
  createRelationship: (payload) => request('/relationships', { method: 'POST', body: payload }),
  updateRelationship: (id, payload) => request(`/relationships/${id}`, { method: 'PATCH', body: payload }),
  deleteRelationship: (id) => request(`/relationships/${id}`, { method: 'DELETE' }),

  listLoreEntries: (params) => request(`/lore-entries${buildQuery(params)}`),
  getLoreEntry: (id) => request(`/lore-entries/${id}`),
  createLoreEntry: (payload) => request('/lore-entries', { method: 'POST', body: payload }),
  updateLoreEntry: (id, payload) => request(`/lore-entries/${id}`, { method: 'PATCH', body: payload }),
  deleteLoreEntry: (id) => request(`/lore-entries/${id}`, { method: 'DELETE' }),
};

export default api;

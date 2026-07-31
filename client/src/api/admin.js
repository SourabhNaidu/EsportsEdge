const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function adminRequest(path, token, options = {}) {
  const response = await fetch(`${API_URL}/admin${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    ...options,
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Admin request failed');
  }

  return data;
}

export function listAdminResource(resource, token) {
  return adminRequest(`/${resource}`, token);
}

export function createAdminResource(resource, token, payload) {
  return adminRequest(`/${resource}`, token, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}


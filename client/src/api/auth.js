const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function requestAuth(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Authentication request failed');
  }

  return data;
}

export function registerUser(payload) {
  return requestAuth('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function loginUser(payload) {
  return requestAuth('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getProfile(token) {
  return requestAuth('/auth/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


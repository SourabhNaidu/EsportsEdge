const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function requestMatches(path) {
  const response = await fetch(`${API_URL}${path}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Match request failed');
  }

  return data;
}

export function listMatches({ status = '', q = '' } = {}) {
  const params = new URLSearchParams();

  if (status) {
    params.set('status', status);
  }

  if (q) {
    params.set('q', q);
  }

  const query = params.toString();
  return requestMatches(`/matches${query ? `?${query}` : ''}`);
}


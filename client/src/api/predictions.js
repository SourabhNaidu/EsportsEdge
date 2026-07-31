const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function predictionRequest(path, token, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Prediction request failed');
  }

  return data;
}

export function createPrediction(token, payload) {
  return predictionRequest('/predictions', token, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getMyPrediction(token, matchId) {
  return predictionRequest(`/predictions/matches/${matchId}/me`, token);
}


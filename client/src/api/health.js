const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function getApiHealth() {
  const response = await fetch(`${API_URL}/health`);

  if (!response.ok) {
    throw new Error('Health check failed');
  }

  return response.json();
}


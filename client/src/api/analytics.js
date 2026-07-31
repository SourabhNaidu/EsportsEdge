const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function getMatchAnalytics(matchId) {
  const response = await fetch(`${API_URL}/analytics/matches/${matchId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Analytics request failed');
  }

  return data;
}


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function getLeaderboard() {
  const response = await fetch(`${API_URL}/leaderboard`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Leaderboard request failed');
  }

  return data;
}


// api.js – AlphaEdge Frontend API Config

// Set backend API URL
const API_BASE_URL = "https://alphaedge-backend.onrender.com";

// Fetch chart data for a stock symbol
export async function fetchCandles(symbol = "RELIANCE") {
  try {
    const response = await fetch(`${API_BASE_URL}/api/candles/${symbol}`);
    if (!response.ok) throw new Error("Backend error");
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("API Error:", err);
    return [];
  }
}

// Health check (optional)
export async function checkHealth() {
  const res = await fetch(`${API_BASE_URL}/health`);
  return res.ok;
}
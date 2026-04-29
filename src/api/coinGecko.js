const BASE_URL = "https://api.coingecko.com/api/v3";

export const fetchCryptos = async (currency = "usd") => {
  const response = await fetch(
    `${BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch cryptos");
  }
  return response.json(); // else return data in json
};
export const fetchCoinData = async (id) => {
  const response = await fetch(`${BASE_URL}/coins/${id}?localization=false`);
  if (!response.ok) {
    throw new Error("Failed to fetch coin data");
  }
  return response.json(); // else return data in json
};
export const fetchChartData = async (id, currency = "usd") => {
  const response = await fetch(
    `${BASE_URL}/coins/${id}/market_chart?vs_currency=${currency}&days=7`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch chart data");
  }
  return response.json();
};

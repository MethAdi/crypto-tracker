export const formatPrice = (price, currency = "usd") => {
  const upperCurrency = currency.toUpperCase();
  if (price < 0.01) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: upperCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(price);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: upperCurrency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

export const formatMarketCap = (marketCap) => {
  if (marketCap >= 1e12) return `${(marketCap / 1e12).toFixed(2)}T`;
  if (marketCap >= 1e9) return `${(marketCap / 1e9).toFixed(2)}B`;
  if (marketCap >= 1e6) return `${(marketCap / 1e6).toFixed(2)}M`;
  if (marketCap >= 1e3) return `${(marketCap / 1e3).toFixed(2)}K`;
  return marketCap.toLocaleString();
};

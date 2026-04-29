import { useParams, useNavigate } from "react-router";
import { fetchCoinData, fetchChartData } from "../api/coinGecko";
import { useState, useEffect } from "react";
import { formatMarketCap, formatPrice } from "../utils/formatter";
import {
  CartesianGrid,
  LineChart,
  ResponsiveContainer,
  YAxis,
  Line,
  XAxis,
  Tooltip,
} from "recharts";

export const CoinDetail = ({ isDarkMode, toggleTheme, currency = "usd" }) => {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    setChartData([]); // Clear old chart data to prevent currency mismatch
    loadCoinData();
    loadChartData();
  }, [id, currency]);

  const loadCoinData = async () => {
    try {
      const data = await fetchCoinData(id);
      setCoin(data);
    } catch (error) {
      console.error("Error fetching coin data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const loadChartData = async () => {
    try {
      const data = await fetchChartData(id, currency);
      const formattedData = data.prices.map(([timestamp, price]) => ({
        time: new Date(timestamp).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        price: parseFloat(price).toFixed(2),
      }));
      setChartData(formattedData);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };
  if (isLoading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner" />
          <p>Loading coin data...</p>
        </div>
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="app">
        <div className="no-results">
          <p>Coin Not Found</p>
          <button onClick={() => navigate("/")} className="back-button">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const priceChange = coin.market_data?.price_change_percentage_24h || 0;
  const isPositive = priceChange >= 0;
  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <h1>🚀 Crypto Tracker</h1>
            <p>Track your favorite cryptocurrencies in real-time</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button 
              className="theme-toggle" 
              onClick={toggleTheme}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '0.75rem',
                cursor: 'pointer',
                color: isDarkMode ? '#fff' : '#000',
                fontSize: '1.2rem',
                transition: '0.3s'
              }}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button onClick={() => navigate("/")} className="back-button">
              Go Back
            </button>
          </div>
        </div>
      </header>
      <div className="coin-detail">
        <div className="coin-header">
          <div className="coin-title">
            <img src={coin.image?.large || coin.image?.small} alt={coin.name} />
            <div>
              <h1>{coin.name}</h1>
              <p className="symbol">{coin.symbol.toUpperCase()}</p>
            </div>
          </div>
          <span className="rank">
            Rank #{coin.market_data?.market_cap_rank || "N/A"}
          </span>
        </div>
        <div className="coin-price-section">
          <div className="current-price">
            <h2>{formatPrice(coin.market_data?.current_price?.[currency] || 0, currency)}</h2>
            <span
              className={`change-badge ${isPositive ? "positive" : "negative"}`}
            >
              {Math.abs(priceChange).toFixed(2) || 0}%
            </span>
          </div>
          <div className="price-ranges">
            <div className="price-range">
              <span className="range-label">24h High</span>
              <span className="range-value">
                {formatPrice(coin.market_data?.high_24h?.[currency] || 0, currency)}
              </span>
            </div>
            <div className="price-range">
              <span className="range-label">24h Low</span>
              <span className="range-value">
                {formatPrice(coin.market_data?.low_24h?.[currency] || 0, currency)}
              </span>
            </div>
          </div>
        </div>
        <div className="chart-section">
          <h3>Price Chart (Last 7 Days)</h3>

          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis
                dataKey="time"
                stroke="#9ca3af"
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke="#9ca3af"
                style={{ fontSize: "12px" }}
                domain={["auto", "auto"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(20, 20, 40, 0.95)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  color: "#e0e0e0",
                }}
              />
              <Line
                dataKey="price"
                stroke="#007bff"
                strokeWidth={2}
                dot={false}
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Market Cap</span>
            <span className="stat-value">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumSignificantDigits: 1 }).format(0).replace(/\d/g, '').replace(/\./g, "").trim()}{formatMarketCap(coin.market_data.market_cap[currency] || 0)}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Volume (24h)</span>
            <span className="stat-value">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumSignificantDigits: 1 }).format(0).replace(/\d/g, '').replace(/\./g, "").trim()}{formatMarketCap(coin.market_data.total_volume[currency] || 0)}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Circulating Supply</span>
            <span className="stat-value">
              {formatMarketCap(
                coin.market_data.circulating_supply?.toLocaleString() || 0,
              )}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Total Supply</span>
            <span className="stat-value">
              {formatMarketCap(
                coin.market_data.total_supply?.toLocaleString() || 0,
              )}
            </span>
          </div>
        </div>
      </div>
      <footer className="footer">
        <p>Data provided by CoinGecko API. Updated every 30 seconds</p>
      </footer>
    </div>
  );
};

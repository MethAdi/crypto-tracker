import { fetchCryptos } from "../api/coinGecko";
import { useEffect } from "react";
import { useState } from "react";
import { CryptoCard } from "../components/CryptoCard";
import { formatPrice } from "../utils/formatter";

export const Home = ({ isDarkMode, toggleTheme, currency, setCurrency }) => {
  const [cryptoList, setCryptoList] = useState([]);
  const [filteredList, setFilteredList] = useState([]); // holds the filtered data
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const [sortBy, setSortBy] = useState("market_cap_rank");

  const fetchCryptoData = async () => {
    try {
      const data = await fetchCryptos(currency);
      setCryptoList(data);
    } catch (error) {
      console.error("Error fetching cryptos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCryptoList([]); // Clear old data to prevent currency symbol mismatch if fetch fails
    setIsLoading(true);
    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 30000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, [currency]);

  useEffect(() => {
    filterandSort();
  }, [cryptoList, sortBy, searchQuery]);

  const filterandSort = () => {
    let filtered = Array.isArray(cryptoList)
      ? cryptoList.filter(
          (crypto) =>
            crypto.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            crypto.symbol?.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : [];
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "market_cap":
          return a.market_cap - b.market_cap;
        case "price":
          return a.current_price - b.current_price;
        case "price_desc":
          return b.current_price - a.current_price;
        case "volume":
          return (a.total_volume || 0) - (b.total_volume || 0);
        case "change":
          return a.price_change_percentage_24h - b.price_change_percentage_24h;
        default:
          return a.market_cap_rank - b.market_cap_rank;
      }
    });
    setFilteredList(filtered);
  };

  const trendingSorted = [...cryptoList].sort(
    (a, b) =>
      (b.price_change_percentage_24h || 0) -
      (a.price_change_percentage_24h || 0),
  );
  const topGainers = trendingSorted.slice(0, 3);
  const topLosers = trendingSorted.slice(-3).reverse();

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <h1>🚀 Crypto Tracker</h1>
            <p>Track your favorite cryptocurrencies in real-time</p>
          </div>
          <div
            className="search-section"
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            <input
              type="text"
              placeholder="Search cryptocurrencies..."
              className="search-input"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={{
                padding: "0.75rem",
                borderRadius: "8px",
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "blue",
                cursor: "pointer",
              }}
            >
              <option value="usd">USD ($)</option>
              <option value="eur">EUR (€)</option>
              <option value="gbp">GBP (£)</option>
              <option value="inr">INR (₹)</option>
              <option value="jpy">JPY (¥)</option>
            </select>
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "8px",
                padding: "0.75rem",
                cursor: "pointer",
                color: isDarkMode ? "#fff" : "#000",
                fontSize: "1.2rem",
                transition: "0.3s",
              }}
            >
              {isDarkMode ? "🌙" : "☀️"}
            </button>
          </div>
        </div>
      </header>

      {!isLoading && topGainers.length > 0 && (
        <div
          style={{
            maxWidth: "1400px",
            margin: "2rem auto 0",
            padding: "0 2rem",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
            }}
          >
            <div
              style={{
                background: "rgba(46, 213, 115, 0.05)",
                border: "1px solid rgba(46, 213, 115, 0.2)",
                padding: "1.5rem",
                borderRadius: "16px",
              }}
            >
              <h2
                style={{
                  color: "#2ed573",
                  marginBottom: "1rem",
                  fontSize: "1.2rem",
                }}
              >
                📈 Top Gainers
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {topGainers.map((coin) => (
                  <div
                    key={coin.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <img
                        src={coin.image}
                        alt={coin.name}
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                        }}
                      />
                      <span
                        style={{
                          fontWeight: "600",
                          color: isDarkMode ? "#fff" : "#000",
                        }}
                      >
                        {coin.name}
                      </span>
                      <span
                        style={{
                          color: "#9ca3af",
                          marginLeft: "0.5rem",
                          fontSize: "0.9rem",
                        }}
                      >
                        {formatPrice(coin.current_price, currency)}
                      </span>
                    </div>
                    <span style={{ color: "#2ed573", fontWeight: "700" }}>
                      +{coin.price_change_percentage_24h?.toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                background: "rgba(255, 71, 87, 0.05)",
                border: "1px solid rgba(255, 71, 87, 0.2)",
                padding: "1.5rem",
                borderRadius: "16px",
              }}
            >
              <h2
                style={{
                  color: "#ff4757",
                  marginBottom: "1rem",
                  fontSize: "1.2rem",
                }}
              >
                📉 Top Losers
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {topLosers.map((coin) => (
                  <div
                    key={coin.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <img
                        src={coin.image}
                        alt={coin.name}
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                        }}
                      />
                      <span
                        style={{
                          fontWeight: "600",
                          color: isDarkMode ? "#fff" : "#000",
                        }}
                      >
                        {coin.name}
                      </span>
                      <span
                        style={{
                          color: "#9ca3af",
                          marginLeft: "0.5rem",
                          fontSize: "0.9rem",
                        }}
                      >
                        {formatPrice(coin.current_price, currency)}
                      </span>
                    </div>
                    <span style={{ color: "#ff4757", fontWeight: "700" }}>
                      {coin.price_change_percentage_24h?.toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="controls">
        <div className="filter-group">
          <label>Sort By:</label>
          <select
            style={{ color: "blue" }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="market_cap_rank">Rank</option>
            <option value="market_cap">Market Cap</option>
            <option value="price">Price</option>
            <option value="volume">Volume</option>
            <option value="change">24h Change</option>
            <option value="name">Name</option>
          </select>
          <div className="view-toggle">
            <button
              className={viewMode === "grid" ? "active" : ""}
              onClick={() => setViewMode("grid")}
            >
              Grid
            </button>
            <button
              className={viewMode === "list" ? "active" : ""}
              onClick={() => setViewMode("list")}
            >
              {" "}
              List{" "}
            </button>
          </div>
        </div>
      </div>
      {isLoading ? (
        <div className="loading">
          <div className="spinner" />
          <p>Loading crypto data...</p>
        </div>
      ) : (
        <div className={`crypto-container ${viewMode}`}>
          {filteredList.map((crypto, key) => (
            <CryptoCard crypto={crypto} key={key} currency={currency} />
          ))}
        </div>
      )}
      <footer className="footer">
        <p>Data provided by CoinGecko API. Updated every 30 seconds</p>
      </footer>
    </div>
  );
};

import { fetchCryptos } from "../api/coinGecko";
import { useEffect } from "react";
import { useState } from "react";
import { CryptoCard } from "../components/CryptoCard";

export const Home = () => {
  const [cryptoList, setCryptoList] = useState([]);
  const [filteredList, setFilteredList] = useState([]); // holds the filtered data
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const [sortBy, setSortBy] = useState("market_cap_rank");

  useEffect(() => {
    //when page loads fetches the data and prints it in console
    const interval = setInterval(fetchCryptoData, 300);
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    filterandSort();
  }, [cryptoList, sortBy, searchQuery]);

  const fetchCryptoData = async () => {
    try {
      const data = await fetchCryptos();
      setCryptoList(data);
    } catch (error) {
      console.error("Error fetching cryptos:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <h1>🚀 Crypto Tracker</h1>
            <p>Track your favorite cryptocurrencies in real-time</p>
          </div>
          <div className="search-section">
            <input
              type="text"
              placeholder="Search cryptocurrencies..."
              className="search-input"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>
        </div>
      </header>
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
            <CryptoCard crypto={crypto} key={key} />
          ))}
        </div>
      )}
      <footer className="footer">
        <p>Data provided by CoinGecko API. Updated every 30 seconds</p>
      </footer>
    </div>
  );
};

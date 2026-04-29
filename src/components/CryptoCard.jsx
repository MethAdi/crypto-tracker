import { formatPrice, formatMarketCap } from "../utils/formatter";
import { Link } from "react-router";

export const CryptoCard = ({ crypto, currency = "usd" }) => {
  return (
    <Link
      to={`/coin/${crypto.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="crypto-card">
        <div className="crypto-header">
          <div className="crypto-info">
            <img src={crypto.image} alt={crypto.name} />
            <div>
              <h3>{crypto.name}</h3>
              <p className="symbol">{crypto.symbol.toUpperCase()}</p>
              <span className="rank ">#{crypto.market_cap_rank}</span>
            </div>
          </div>
        </div>
        <div className="crypto-price">
          <p className="price">
            {" "}
            {formatPrice(crypto.current_price, currency)}
          </p>
          <p
            className={`change ${crypto.price_change_percentage_24h >= 0 ? " positive" : "negative"}`}
          >
            {Math.abs(crypto.price_change_percentage_24h?.toFixed(2))}%
          </p>
        </div>
        <div className="crypto-stats">
          <div className="stats">
            <span className="stat-label">Market Cap </span>
            <span className="stat-value">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency,
                maximumSignificantDigits: 1,
              })
                .format(0)
                .replace(/\d/g, "")
                .replace(/\./g, "")
                .trim()}
              {formatMarketCap(crypto.market_cap || 0)}
            </span>
          </div>
          <div className="stats">
            <span className="stat-label">Volume </span>
            <span className="stat-value">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency,
                maximumSignificantDigits: 1,
              })
                .format(0)
                .replace(/\d/g, "")
                .replace(/\./g, "")
                .trim()}
              {formatMarketCap(crypto.total_volume || 0)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

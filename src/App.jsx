import { BrowserRouter, Routes, Route } from "react-router";
import { Home } from "./pages/Home";
import { CoinDetail } from "./pages/CoinDetail";
import { useState, useEffect } from "react";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : true;
  });

  const [currency, setCurrency] = useState(() => {
    const saved = localStorage.getItem("currency");
    return saved || "usd";
  });

  useEffect(() => {
    document.body.className = isDarkMode ? "" : "light-mode";
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              isDarkMode={isDarkMode}
              toggleTheme={toggleTheme}
              currency={currency}
              setCurrency={setCurrency}
            />
          }
        />
        <Route
          path="/coin/:id"
          element={
            <CoinDetail
              isDarkMode={isDarkMode}
              toggleTheme={toggleTheme}
              currency={currency}
              setCurrency={setCurrency}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import React, { useState } from "react";
import { motion } from "framer-motion";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiKey = "bff775e66df74d95a73214330251209";

  const getWeather = async () => {
    if (!city) {
      setError("Please enter a city");
      setWeather(null);
      return;
    }

    setLoading(true);
    try {
      const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=yes`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("City not found");
      const data = await res.json();

      const newWeather = {
        location: data.location.name,
        country: data.location.country,
        temp: data.current.temp_c,
        condition: data.current.condition.text,
        icon: data.current.condition.icon,
        humidity: data.current.humidity,
        wind: data.current.wind_kph,
        time: data.location.localtime,
      };

      setWeather(newWeather);
      setHistory((prev) => [newWeather.location, ...prev.slice(0, 4)]);
      setError("");
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  // 🎨 Change background dynamically
  const getBackgroundClass = () => {
    if (!weather) return "app";
    if (weather.condition.toLowerCase().includes("sun")) return "app sunny";
    if (weather.condition.toLowerCase().includes("rain")) return "app rainy";
    if (weather.condition.toLowerCase().includes("cloud")) return "app cloudy";
    return "app default";
  };

  return (
    <div className={getBackgroundClass()}>
      <motion.div
        className="weather-container"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2>🌦️ Weather App</h2>
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={getWeather}>Get Weather</button>

        {loading && <p className="loading">⏳ Fetching weather...</p>}
        {error && <p className="error">{error}</p>}

        {weather && (
          <motion.div
            className="result"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3>{weather.location}, {weather.country}</h3>
            <img src={weather.icon} alt={weather.condition} />
            <p>🌡️ {weather.temp}°C</p>
            <p>☁️ {weather.condition}</p>
            <p>💧 Humidity: {weather.humidity}%</p>
            <p>🌬️ Wind: {weather.wind} kph</p>
            <p>🕒 Local Time: {weather.time}</p>
          </motion.div>
        )}

        {history.length > 0 && (
          <motion.div
            className="history"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h4>Recent Searches</h4>
            <ul>
              {history.map((item, i) => (
                <li key={i} onClick={() => setCity(item)}>
                  🔎 {item}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default App;
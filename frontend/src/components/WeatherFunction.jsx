import React, { useState } from 'react';
import { fetchWeather } from '../api/weatherApi';

export default function WeatherFunction({ setMessages, setCurrentFunction }) {
  const [city, setCity] = useState('');

  const handleSubmit = async () => {
    try {
      const weatherData = await fetchWeather(city);
      setMessages(prev => [...prev, { 
        from: 'bot', 
        text: `Weather in ${city}: Temperature: ${weatherData.main.temp}°C, 
               Humidity: ${weatherData.main.humidity}%, 
               Wind Speed: ${weatherData.wind.speed} m/s` 
      }]);
    } catch (error) {
      console.error('Error fetching weather:', error);
      setMessages(prev => [...prev, { from: 'bot', text: 'Error fetching weather data. Please try again.' }]);
    }
    setCurrentFunction(null);
  };

  return (
    <div>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city name"
      />
      <button onClick={handleSubmit}>Get Weather</button>
      <button onClick={() => setCurrentFunction(null)}>Exit</button>
    </div>
  );
}
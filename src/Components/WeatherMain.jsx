import React, { useState, useRef } from 'react';
import { ThemeProvider, Container, Paper, CircularProgress, Alert } from '@mui/material';
import theme from '../Theme/Muitheme';
import Header from './Header';
import CitySelector from './CitySelector';
import CurrentWeatherCard from './CurrentWeartherCard';
import ForecastGrid from './ForecastGrid';
import ExportPDFButton from './ExportButton';

export default function WeatherApp() {
  const [selectedCity, setSelectedCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const containerRef = useRef();


  const fetchWeather = async (cityName) => {
    if (!cityName) return;
    setLoading(true);
    setError(null);
    setWeather(null);
    setForecast([]);

    try {
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}`);
      const geoData = await geoRes.json();
      if (!geoData.results?.length) throw new Error('City not found');
      const { latitude, longitude, name, country } = geoData.results[0];

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
                  `&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
      const weatherRes = await fetch(url);
      const weatherData = await weatherRes.json();

      setWeather({ ...weatherData.current_weather, name, country });
      setForecast(
        weatherData.daily.time.map((date, i) => ({
          date,
          max: weatherData.daily.temperature_2m_max[i],
          min: weatherData.daily.temperature_2m_min[i],
          code: weatherData.daily.weathercode[i]
        }))
      );
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper ref={containerRef} elevation={6} sx={{ p: 4, borderRadius: 3, bgcolor: 'background.default' }}>
          <CitySelector selectedCity={selectedCity} setSelectedCity={setSelectedCity} fetchWeather={fetchWeather} />
          {loading && <CircularProgress sx={{ display: 'block', mx: 'auto' }} />}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {weather && <CurrentWeatherCard weather={weather} />}
          {forecast.length > 0 && <ForecastGrid forecast={forecast} />}
          {weather && <ExportPDFButton containerRef={containerRef} selectedCity={selectedCity} />}
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

import React, { useState, useRef } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  AppBar,
  Toolbar,
  Container,
  Paper,
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Alert,
  Autocomplete,
  TextField,
  Grid,
  Button
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AirIcon from '@mui/icons-material/Air';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const popularCities = ['Delhi', 'London', 'New York', 'Tokyo', 'Paris', 'Sydney'];
const weatherIcons = {
  0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
  45: '🌫️', 48: '🌫️', 51: '🌧️',
  53: '🌧️', 55: '🌧️', 61: '🌦️',
  63: '🌧️', 65: '🌧️', 71: '🌨️',
  73: '🌨️', 75: '🌨️', 80: '🌦️',
  81: '🌦️', 82: '🌦️', 95: '⛈️',
  96: '🌩️', 99: '🌩️'
};

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#ff9800' },
    background: { default: '#eef3f8' }
  },
  typography: {
    h4: { fontWeight: 600 },
    h6: { fontWeight: 500 }
  }
});

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

  const handleExportPDF = () => {
    if (!containerRef.current) return;
    html2canvas(containerRef.current).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${selectedCity || 'weather'}.pdf`);
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            🌦️ Weather Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper ref={containerRef} elevation={6} sx={{ p: 4, borderRadius: 3, bgcolor: 'background.default' }}>
          <Typography variant="h4" align="center" gutterBottom>
            Real-Time Weather 
          </Typography>

          <Autocomplete
            freeSolo
            options={popularCities}
            value={selectedCity}
            onChange={(_, newValue) => {
              setSelectedCity(newValue || '');
              newValue && fetchWeather(newValue);
            }}
            onInputChange={(_, inputValue, reason) => {
              if (reason === 'input') setSelectedCity(inputValue);
            }}
            sx={{ mb: 3 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select or Type a City"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && selectedCity) fetchWeather(selectedCity);
                }}
              />
            )}
          />

          {loading && <CircularProgress sx={{ display: 'block', mx: 'auto' }} />}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {weather && (
            <Card elevation={3} sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h5">
                  <LocationOnIcon fontSize="small" /> {weather.name}, {weather.country}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Typography variant="h2" sx={{ mr: 1 }}>{weatherIcons[weather.weathercode] || '❓'}</Typography>
                  <Typography variant="h3">{weather.temperature}°C</Typography>
                </Box>
                <Typography><AirIcon fontSize="small" /> Wind: {weather.windspeed} km/h</Typography>
                <Typography variant="caption">As of {weather.time}</Typography>
              </CardContent>
            </Card>
          )}

          {forecast.length > 0 && (
            <>
              <Typography variant="h6" gutterBottom>5-Day Forecast</Typography>
              <Grid container spacing={3}>
                {forecast.map((day, i) => (
                  <Grid item xs={12} sm={6} md={4} key={i}>
                    <Card elevation={3} sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>{day.date}</Typography>
                      <Box sx={{ fontSize: 40, my: 1 }}>{weatherIcons[day.code] || '❓'}</Box>
                      <Typography variant="body1"><strong>High:</strong> {day.max}°C</Typography>
                      <Typography variant="body2" color="text.secondary"><strong>Low:</strong> {day.min}°C</Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}

          {weather && (
            <Box textAlign="center" mt={4}>
              <Button variant="contained" color="primary" onClick={handleExportPDF}>
                Export as PDF
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
}




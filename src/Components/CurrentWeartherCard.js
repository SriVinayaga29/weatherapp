import { Card, CardContent, Typography, Box } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AirIcon from '@mui/icons-material/Air';
import { weatherIcons } from '../Constants/Icons';

export default function CurrentWeatherCard({ weather }) {
  return (
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
  );
}

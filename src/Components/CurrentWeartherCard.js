import { Card, CardContent, Typography, Box, Stack } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AirIcon from '@mui/icons-material/Air';
import OpacityIcon from '@mui/icons-material/Opacity'; // Humidity icon
import SpeedIcon from '@mui/icons-material/Speed'; // Pressure icon
import WbSunnyIcon from '@mui/icons-material/WbSunny'; // For sunny status
import CloudIcon from '@mui/icons-material/Cloud'; // For cloudy status
import GrainIcon from '@mui/icons-material/Grain'; // For rain/drizzle
import { weatherIcons } from '../Constants/Icons';

// Helper to get descriptive weather status text & icon
function getWeatherStatus(weather) {
  // You can adjust this mapping based on your weather codes or descriptions
  const { weathercode, description } = weather;

  // Example based on weathercode (you can adapt to your API)
  if ([61, 63, 65].includes(weathercode)) return { text: 'Likely to rain', Icon: GrainIcon };
  if ([80, 81, 82].includes(weathercode)) return { text: 'Showers', Icon: GrainIcon };
  if ([95, 96, 99].includes(weathercode)) return { text: 'Thunderstorms', Icon: GrainIcon };
  if ([1, 2, 3].includes(weathercode)) return { text: 'Cloudy', Icon: CloudIcon };
  if (weathercode === 0) return { text: 'Sunny', Icon: WbSunnyIcon };

  // fallback: use description if provided
  if (description) return { text: description, Icon: WbSunnyIcon };

  return { text: 'Weather info unavailable', Icon: WbSunnyIcon };
}

export default function CurrentWeatherCard({ weather }) {
  const { text: statusText, Icon: StatusIcon } = getWeatherStatus(weather);

  return (
    <Card elevation={3} sx={{ mb: 4, borderRadius: 2, bgcolor: 'background.paper' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationOnIcon fontSize="small" sx={{ mr: 0.5, color: 'primary.main' }} />
          <Typography variant="h5" color="primary.main" fontWeight="bold">
            {weather.name}, {weather.country}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="h2" sx={{ mr: 1 }}>
            {weatherIcons[weather.weathercode] || '❓'}
          </Typography>
          <Typography variant="h3" fontWeight="medium">
            {weather.temperature}°C
          </Typography>
        </Box>

        {/* Weather Status */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'text.secondary' }}>
          <StatusIcon fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="body2">{statusText}</Typography>
        </Box>

        <Stack direction="row" spacing={3} sx={{ mb: 1 }}>
          <Typography sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
            <AirIcon fontSize="small" sx={{ mr: 0.5 }} /> Wind: {weather.windspeed} km/h
          </Typography>

          <Typography sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
            <OpacityIcon fontSize="small" sx={{ mr: 0.5 }} /> Humidity: {weather.humidity}%
          </Typography>

          <Typography sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
            <SpeedIcon fontSize="small" sx={{ mr: 0.5 }} /> Pressure: {weather.pressure} hPa
          </Typography>
        </Stack>

        <Typography variant="caption" color="text.secondary">
          As of {new Date(weather.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Typography>
      </CardContent>
    </Card>
  );
}

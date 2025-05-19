import { Grid, Card, Typography, Box } from '@mui/material';
import { weatherIcons } from '../Constants/Icons';
export default function ForecastGrid({ forecast }) {
  return (
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
  );
}

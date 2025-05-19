import { Grid, Card, Typography, Box } from '@mui/material';
import { weatherIcons } from '../Constants/Icons';

export default function ForecastGrid({ forecast }) {
  return (
    <>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          mb: 4,
          fontWeight: '600',
          letterSpacing: 1,
          color: 'text.primary',
          textAlign: 'center',
          fontFamily: "'Roboto', sans-serif",
        }}
      >
        5-Day Forecast
      </Typography>
      <Grid container spacing={3}>
        {forecast.map((day, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Card
              elevation={4}
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: 'background.paper',
                color: 'text.primary',
                boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                },
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 1,
                  fontWeight: '700',
                  letterSpacing: 0.5,
                  color: 'text.secondary',
                }}
              >
                {new Date(day.date).toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </Typography>

              <Box
                sx={{
                  fontSize: 48,
                  my: 2,
                  userSelect: 'none',
                  color: 'primary.main',
                }}
              >
                {weatherIcons[day.code] || '❓'}
              </Box>

              <Typography
                variant="h6"
                sx={{ fontWeight: '600', mb: 0.5 }}
              >
                High: {day.max}°C
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary' }}
              >
                Low: {day.min}°C
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

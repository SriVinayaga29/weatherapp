import { Autocomplete, TextField } from '@mui/material';
import { popularCities } from '../Constants/Cities';

export default function CitySelector({ selectedCity, setSelectedCity, fetchWeather }) {
  return (
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
  );
}

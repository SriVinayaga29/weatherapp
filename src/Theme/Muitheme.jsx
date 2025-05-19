import { createTheme } from '@mui/material/styles';

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

export default theme;

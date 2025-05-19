import { AppBar, Toolbar, Typography } from '@mui/material';

export default function Header() {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          🌦️ Weather Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#1DCD9F' },
    secondary: { main: '#169976' },
    background: { default: '#222222', paper: '#000000' },
    text: { primary: '#FFFFFF', secondary: '#34C6A3' },
    action: { active: '#1DCD9F', hover: '#169976' },
  },
  typography: {
    h3: { fontWeight: 'bold', color: '#FFFFFF', fontSize: '2.5rem' },
    body1: { color: '#34C6A3', fontSize: '1.2rem' },
  },
});

export default theme;
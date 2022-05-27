import { createTheme } from '@mui/material/styles';
import { green, grey, red } from '@mui/material/colors';

const rawTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      light: '#69696a',
      main: '#28282a',
      dark: '#1e1e1f',
    },
    secondary: {
      light: '#fff5f8',
      main: '#ff3366',
      dark: '#e62958',
    }
  },
  typography: {
    fontFamily: "Inter,ui-sans-serif,system-ui",
    fontSize: 14,
    fontWeightLight: 400, // Work Sans
    fontWeightRegular: 500, // Work Sans
    fontWeightMedium: 700, // Roboto Condensed
  },
});

const fontHeader = {
  color: rawTheme.palette.text.primary,
  fontWeight: rawTheme.typography.fontWeightMedium,
  fontFamily: "Poppins, ui-sans-serif, system-ui;",
  textTransform: 'uppercase',
};

const theme = {
  ...rawTheme,
  palette: {
    ...rawTheme.palette,
    background: {
      ...rawTheme.palette.background,
      default: "#035CA3",
      placeholder: grey[200],
      paper: "#024376",
      dark: "#003661"
    },
    primary: {
      light: '#fff5f8',
      main: '#28282a',
      dark: '#1e1e1f',
    },
    secondary: {
      light: '#ffd700',
      main: '#D1B000',
      dark: '#A38A00',
    }
  },
  typography: {
    ...rawTheme.typography,
    fontHeader,
    h1: {
      ...rawTheme.typography.h1,
      ...fontHeader,
      letterSpacing: 0,
      fontSize: 50,
    },
    h2: {
      ...rawTheme.typography.h2,
      ...fontHeader,
      fontSize: 35,
    },
    h3: {
      ...rawTheme.typography.h3,
      ...fontHeader,
      fontSize: 30,
    },
    h4: {
      ...rawTheme.typography.h4,
      ...fontHeader,
      fontSize: 26,
    },
    h5: {
      ...rawTheme.typography.h5,
      ...fontHeader,
      fontSize: 22,
    },
    h6: {
      ...rawTheme.typography.h6,
      ...fontHeader,
      fontSize: 20,
    },
    subtitle1: {
      ...rawTheme.typography.subtitle1,
      fontSize: "1.25rem",
    },
    subtitle2: {
      ...rawTheme.typography.subtitle2,
      fontSize: "0.975rem",
    },
    body1: {
      ...rawTheme.typography.body2,
      fontWeight: rawTheme.typography.fontWeightRegular,
      fontSize: 16,
    },
    body2: {
      ...rawTheme.typography.body1,
      fontSize: 14,
    },
  },
};

export default theme;

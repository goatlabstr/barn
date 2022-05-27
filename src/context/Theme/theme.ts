import {createTheme} from '@mui/material/styles';
import {grey} from '@mui/material/colors';

const rawTheme = createTheme({
    palette: {
        mode: 'dark'
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
            default: "#081534",
            placeholder: grey[200],
            paper: "#09173A",
            dark: "#0b0b21"
        },
        primary: {
            light: '#4b9fea',
            main: '#1e88e5',
            dark: '#155fa0',
        },
        secondary: {
            light: '#dabf33',
            main: '#D1B000',
            dark: '#927b00',
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

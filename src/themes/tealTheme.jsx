import { createTheme } from "@mui/material/styles";
// save as themes/tealTheme.jsx
// creates a new theme containing overrides for any defaults
// see https://mui.com/material-ui/customization/theming/
export const tealTheme = createTheme({
        palette: {
          primary: { main: '#ffffff', contrastText: '#ffffff' }, // Dark Grey
          secondary: { main: '#aaaaaa', contrastText: '#000000' }, // Light Grey
        },
        typography: {
          fontFamily: 'Montserrat',
          fontSize: 14,
          h1: { fontSize: 30 },
        },
        shape: { borderRadius: 0 },
        components: {
          MuiCssBaseline: {
            styleOverrides: `a { color: #aaaaaa; }`, // Styling anchor elements
          },
          MuiButton: { defaultProps: { variant: 'contained' } },
          MuiTextField: { defaultProps: { variant: 'filled' } },
        },
      });
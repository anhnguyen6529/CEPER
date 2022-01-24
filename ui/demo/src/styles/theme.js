import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        background: {
          default: "#F0F4F5"
        },
        primary: {
          main: "#009ABB"
        },
        secondary: {
          main: "#09425A"
        }
    },
    typography: {
      fontFamily: [
        '"Times New Roman"', 
        'Times',
        'serif'
      ].join(','),
    },
    override: {
      MuiButton: {
        root: {
          textTransform: 'none',
        }
      }
    }
})

theme.props = {
  MuiButton: {
    root: {
      textTransform: 'none',
    }
  }
}

export default theme;
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
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none'
          }
        }
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            color: 'black',
            fontSize: 16
          }
        }
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            paddingTop: '12px',
            paddingBottom: '12px'
          },
          input: {
            paddingTop: 0,
            paddingBottom: 0
          }
        }
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            fontSize: '13px',
            maxWidth: 320
          }
        }
      }
    }
})

export default theme;
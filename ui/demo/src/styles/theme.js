import { Popper } from '@mui/material';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        background: {
          default: "#F0F4F5"
        },
        primary: {
          main: "#009ABB",
          light: "#D9EFFE",
          dark: "#09425A",
          darker: "#062E3E",
          contrastText: '#FFF'
        },
        primaryGreen: {
          main: "#00BB9A",
          light: "#D9FEEF",
          dark: "#095A42",
          darker: "#063E2E",
          contrastText: '#FFF'
        },
        primaryRed: {
          main: "#BB090A",
          light: "#FFDBD8",
          dark: "#8C1515",
          darker: "#620E0E",
          contrastText: '#FFF'
        },
        primaryOrange: {
          main: "#FF9100",
          light: "#FEEFD9",
          dark: "#B26500",
          darker: "#7C4600",
          contrastText: '#FFF'
        },
        primaryPurple: {
          main: "#BB009A",
          light: "#FED9EF",
          dark: "#82006B",
          darker: "#5B004A",
          contrastText: '#FFF'
        },
        secondary: {
          main: "#09425A"
        },
        text: {
          disabled: "#000"
        },
        success: {
          main: "#388E3C"
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
            textTransform: 'none',
            '&.Mui-disabled': {
              color: 'rgba(0, 0, 0, 0.38)',
              backgroundColor: 'rgba(0, 0, 0, 0.26)',
              border: 'none'
            }
          },
        }
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            '&.Mui-disabled': {
              backgroundColor: 'rgba(0, 0, 0, 0.06)'
            }
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
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: '0.5px solid rgba(224, 224, 224, 1)',
            fontSize: '16px',
            whiteSpace: 'pre-line'
          },
          head: {
            borderBottom: '0.5px solid rgba(200, 200, 224, 1)',
            fontWeight: 'bold'
          }
        }
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            borderBottom: '0.5px solid rgba(224, 224, 224, 1)',
            '&.MuiTableRow-hover:hover': { 
              backgroundColor: 'rgba(0, 0, 0, 0.08)'
            },
          },
          head: {
            borderBottom: '0.5px solid rgba(200, 200, 224, 1)',
          },
        }
      },
      MuiListSubheader: {
        styleOverrides: {
          root: {
            fontWeight: 'bold'
          }
        }
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            fontWeight: 'bold',
            fontSize: 18,
          }
        }
      },
      MuiDialogContentText: {
        styleOverrides: {
          root: {
            color: 'black',
            whiteSpace: 'pre-wrap'
          }
        }
      },
      MuiDialogActions: {
        styleOverrides: {
          root: {
            paddingLeft: 24,
            paddingRight: 24,
            paddingBottom: 16
          }
        }
      },
      MuiAutocomplete: {
        defaultProps: {
          noOptionsText: '(trống)',
          PopperComponent: (params) => <Popper {...params} placement='bottom-start' />
        },
        styleOverrides: {
          popper: {
            minWidth: 300
          }
        }
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            whiteSpace: 'pre-wrap'
          }
        }
      }
    }
})

export default theme;
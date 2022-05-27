import React from "react";
import { Button as MuiButton, darken } from "@mui/material";

const ROOT = {
    minWidth: 120,
    height: 36,
    fontWeight: 'bold'
}

const Button = ({ children, variant, sx, ...other }) => {
    return (
        <>
        {variant === "primary" &&
            <MuiButton
                variant="contained"
                color="primary"
                sx={{ 
                    ...ROOT,
                    ...sx
                }} 
                {...other}
            >
                {children}
            </MuiButton>
        }
        {variant === "primary-dark" &&
            <MuiButton
                sx={{ 
                    ...ROOT,
                    bgcolor: (theme) => theme.palette.primary.dark, 
                    color: 'white',
                    '&:hover': {
                        bgcolor: (theme) => theme.palette.primary.darker, 
                    },
                    ...sx
                }} 
                {...other}
            >
                {children}
            </MuiButton>
        }
        {variant === "secondary" &&
            <MuiButton
                sx={{ 
                    ...ROOT,
                    bgcolor: (theme) => theme.palette.primary.light, 
                    color: (theme) => theme.palette.primary.main,
                    '&:hover': {
                        bgcolor: (theme) => darken(theme.palette.primary.light, 0.05)
                    },
                    ...sx
                }} 
                {...other}
            >
                {children}
            </MuiButton>
        }
        {variant === "outlined" &&
            <MuiButton
                variant="outlined"
                color="primary"
                sx={{ ...ROOT, bgcolor: 'white', '&:hover': { bgcolor: darken('#FFF', 0.05) },  ...sx }} 
                {...other}
            >
                {children}
            </MuiButton>
        }
        {variant === "outlined-dark" &&
            <MuiButton
                variant="outlined"
                sx={{ 
                    ...ROOT, 
                    color: (theme) => theme.palette.primary.dark,
                    borderColor: (theme) => theme.palette.primary.dark,
                    bgcolor: 'white', 
                    '&:hover': { 
                        color: (theme) => theme.palette.primary.dark,
                        bgcolor: darken('#FFF', 0.05),
                        borderColor: (theme) => theme.palette.primary.dark,
                    },  
                    ...sx 
                }} 
                {...other}
            >
                {children}
            </MuiButton>
        }
        {variant === "text" && 
            <MuiButton
                sx={{ ...ROOT, ...sx }} 
                {...other}
            >
                {children}
            </MuiButton>
        }
        </>
        
    )
}

Button.defaultProps = {
    variant: "primary",
    sx: {}
}

export default Button;
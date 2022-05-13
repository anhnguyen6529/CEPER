import React from "react";
import { Button as MuiButton, darken } from "@mui/material";
import { useSelector } from "react-redux";

const ROOT = {
    minWidth: 120,
    height: 36,
    fontWeight: 'bold'
}

const Button = ({ children, variant, sx, ...other }) => {
    const { accentColor } = useSelector((state) => state.auth.settings.appearance);

    return (
        <>
        {variant === "primary" &&
            <MuiButton
                variant="contained"
                color={accentColor}
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
                    bgcolor: (theme) => theme.palette[accentColor].dark, 
                    color: 'white',
                    '&:hover': {
                        bgcolor: (theme) => theme.palette[accentColor].darker, 
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
                    bgcolor: (theme) => theme.palette[accentColor].light, 
                    color: (theme) => theme.palette[accentColor].main,
                    '&:hover': {
                        bgcolor: (theme) => darken(theme.palette[accentColor].light, 0.05)
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
                color={accentColor}
                sx={{ ...ROOT, bgcolor: 'white', '&:hover': { bgcolor: darken('#FFF', 0.05) },  ...sx }} 
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
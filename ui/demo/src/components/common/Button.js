import React from "react";
import { Button as MuiButton } from "@mui/material";

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
                sx={{ 
                    ...ROOT,
                    background: '#009ABB', 
                    color: 'white',
                    '&:hover': {
                        background: '#48B0F7', 
                    },
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
                    background: '#09425A', 
                    color: 'white',
                    '&:hover': {
                        background: '#276078', 
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
                    background: '#D9EFFE', 
                    color: '#009ABB',
                    '&:hover': {
                        background: '#D2E8F7'
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
                sx={{ 
                    ...ROOT,
                    background: 'white', 
                    color: '#009ABB',
                    border: '1px solid #009ABB',
                    '&:hover': {
                        background: '#F0F4F5', 
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
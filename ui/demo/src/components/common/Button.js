import React from "react";
import { Button as MuiButton} from "@mui/material";

// interface ButtonIProps {
//     variant: "primary" | "secondary" | "outlined",
//     text: string,
//     icon?: any,
//     onClick?: any
// }

const Button = ({ variant, text, icon, onClick }) => {
    return (
        <>
        {variant === "primary" &&
            <MuiButton
                sx={{ 
                    width: 120,
                    height: 36,
                    background: '#009ABB', 
                    textTransform: 'none', 
                    fontWeight: 'bold',
                    color: 'white',
                    '&:hover': {
                        background: '#48B0F7', 
                    }
                }} 
                startIcon={icon}
                onClick={onClick}
            >
                {text}
            </MuiButton>
        }
        {variant === "secondary" &&
            <MuiButton
                sx={{ 
                    width: 120,
                    height: 36,
                    background: '#D9EFFE', 
                    textTransform: 'none', 
                    fontWeight: 'bold',
                    color: '#009ABB',
                    '&:hover': {
                        background: '#48B0F7', 
                    }
                }} 
                startIcon={icon}
                onClick={onClick}
            >
                {text}
            </MuiButton>
        }
        {variant === "outlined" &&
            <MuiButton
                sx={{ 
                    width: 120,
                    height: 36,
                    background: 'white', 
                    textTransform: 'none', 
                    fontWeight: 'bold',
                    color: '#009ABB',
                    border: '2px solid #009ABB',
                    '&:hover': {
                        background: '#F0F4F5', 
                    }
                }} 
                startIcon={icon}
                onClick={onClick}
            >
                {text}
            </MuiButton>
        }
        </>
        
    )
}

export default Button;
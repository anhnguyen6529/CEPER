import React, { useState, useEffect } from "react";
import { KeyboardArrowUp } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useSelector } from "react-redux";

const ScrollToTop = () => {
    const { accentColor } = useSelector((state) => state.auth.settings.appearance);
    const [showTopBtn, setShowTopBtn] = useState(false);

    const scrollFunction = () => {
        if (window.scrollY > 400) {
            setShowTopBtn(true);
        } else {
            setShowTopBtn(false);
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', scrollFunction);
        return () => {
            window.removeEventListener('scroll', scrollFunction);
        }
    }, []);

    const goToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <>
            {showTopBtn && (
                <IconButton 
                    sx={{ 
                        position: "fixed", 
                        right: 20, 
                        bottom: 12, 
                        zIndex: (theme) => theme.zIndex.drawer + 2, 
                        bgcolor: (theme) => theme.palette[accentColor].dark, 
                        color: "white",
                        '&:hover': {
                            bgcolor: (theme) => theme.palette[accentColor].dark, 
                            color: "white"
                        }
                    }} 
                    onClick={goToTop}
                >
                    <KeyboardArrowUp />
                </IconButton>
            )}
        </>
    );
};

export default ScrollToTop;
import React, { useState, useEffect } from "react";
import { KeyboardArrowUp } from "@mui/icons-material";
import { IconButton } from "@mui/material";

const ScrollToTop = () => {
    const [showTopBtn, setShowTopBtn] = useState(false);

    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                setShowTopBtn(true);
            } else {
                setShowTopBtn(false);
            }
            });
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
                        bottom: 25, 
                        zIndex: 1, 
                        bgcolor: "#09425A", 
                        color: "white",
                        '&:hover': {
                            bgcolor: "#09425A", 
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
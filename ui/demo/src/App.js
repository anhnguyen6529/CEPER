import React, { useEffect, useMemo, lazy, Suspense } from "react";
import { Routes, Route, Navigate, BrowserRouter as Router } from "react-router-dom";
import { createTheme, darken, ThemeProvider } from '@mui/material/styles';
import { useSelector } from "react-redux";
import { options } from "./styles/theme";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const User = lazy(() => import("./pages/User"));

export const recommendPrimary = { 
    "#009ABB": { light: "#D9EFFE", dark: "#09425A", darker: "#062E3E",contrastText: "#FFF" },
    "#00BB9A": { light: "#D9FEEF", dark: "#095A42", darker: "#063E2E", contrastText: '#FFF' },
    "#BB090A": { light: "#FFDBD8", dark: "#8C1515", darker: "#620E0E", contrastText: '#FFF' },
    "#FF9100": { light: "#FEEFD9", dark: "#B26500", darker: "#7C4600", contrastText: '#FFF' },
    "#BB009A": { light: "#FED9EF", dark: "#82006B", darker: "#5B004A", contrastText: '#FFF' },
};

const App = () => {
    const { accentColor } = useSelector((state) => state.auth.settings.appearance);
    
    const customTheme = useMemo(() => 
        createTheme({
            ...options,
            palette: {
                primary: {
                    main: accentColor,
                    darker: darken(accentColor, 0.5),
                    ...(Object.keys(recommendPrimary).includes(accentColor) && recommendPrimary[accentColor]),
                }
            }
            // eslint-disable-next-line
        }), [accentColor]);
    
    useEffect(() => {
        window.history.scrollRestoration = "manual"
    }, []);

    return (
        <ThemeProvider theme={customTheme}>
            <Router>
                <Suspense fallback={<div style={{ padding: 10 }}>Đang tải trang...</div>}>
                    <Routes>     
                        <Route exact path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/user/HSBA" element={<User />} />
                        <Route path="/user/HSBA/:pid" element={<User />} />
                        <Route path="/user/settings" element={<User />} />
                        
                        <Route exact path="*" element={<Navigate to="/" />}/>    
                    </Routes>
                </Suspense>
            </Router>
        </ThemeProvider>
    );
}

export default App;
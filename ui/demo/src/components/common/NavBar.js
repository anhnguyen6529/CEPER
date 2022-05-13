import React from "react";
import { AppBar, Toolbar, Container, Grid, Link } from "@mui/material";
import logo from "../../images/logo_white.svg";
import { useSelector } from "react-redux";

const NavBar = ({ children }) => {
    const { accentColor } = useSelector((state) => state.auth.settings.appearance);

    return (
        <AppBar 
            color="transparent"
            position="fixed"
            elevation={0}
        >
            <Toolbar sx={{ bgcolor: (theme) => theme.palette[accentColor].main, height: 72 }}>
                <Container>
                    <Grid container spacing={0} alignItems="center">
                        <Grid item xs={8}>
                            <Link href="/">
                                <img src={logo} alt="logo" style={{ maxWidth: 150 }}/>
                            </Link>
                        </Grid>
                        <Grid item xs={4} align="right">
                            {children}
                        </Grid>
                    </Grid>
                </Container>
            </Toolbar>
        </AppBar>
    )
}

export default NavBar;
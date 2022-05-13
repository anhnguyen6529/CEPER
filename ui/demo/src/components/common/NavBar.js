import React from "react";
import { AppBar, Toolbar, Container, Grid, Link } from "@mui/material";
import logo from "../../images/logo.svg";

const NavBar = ({ children }) => {
    return (
        <AppBar 
            color="transparent"
            position="fixed"
            elevation={0}
        >
            <Toolbar sx={{ bgcolor: 'white', height: 72 }}>
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
import React from "react";
import { Container, Box, Typography, Grid, Link } from "@mui/material";
import logo from '../../images/logo_white.svg';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{ py: 2, mt: 'auto', bgcolor: (theme) => theme.palette.primary.main, color: 'white' }}
        >
            <Container maxWidth="md">
                <Grid container sx={{ my: 2 }}>
                    <Grid item xs={7}>
                        <Box className="df fdc jcc" sx={{ height: '100%' }}>
                            <Link href="/">
                                <img src={logo} alt="" style={{ maxWidth: 180 }}/>
                            </Link>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                Copyright © 2021 CEPER. All Rights Reserved.
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={2.5}>
                        <Box>
                            <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>Số điện thoại</Typography>
                            <Typography variant="body2" >01234567xx</Typography>
                        </Box>
                        <Box sx={{ mt: 1.5 }}>
                            <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>Email</Typography>
                            <Typography variant="body2" >ceper@gmail.com</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={2.5}>
                            <Typography variant="body2" fontWeight="bold" sx={{ mb: 1.5 }}>Thông tin</Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}>Hướng dẫn sử dụng</Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}>Chính sách bảo mật</Typography>
                            <Typography variant="body2">Điều khoản</Typography>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}

export default Footer;
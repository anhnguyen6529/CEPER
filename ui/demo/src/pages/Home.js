import React from 'react';
import { Container, Grid, Typography, Link, Box } from '@mui/material';
import { NavBar, Button, Footer } from '../components/common';
import { makeStyles } from '@mui/styles';
import landingImg from '../images/landing_01.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileMedical, faPencilAlt, faSearch } from "@fortawesome/free-solid-svg-icons";
import useToken from '../hooks/useToken';
import { useSelector } from 'react-redux';
import Lazyload from 'react-lazyload';
import "../styles/index.css";

const useStyles = makeStyles(() => ({
    root: {
        minHeight: `calc(100vh - 72px)`,
    },
    landingImg: {
        height: 320
    },
    featuresBox: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 150,
        marginBottom: 100
    },
    featuresLine: {
        width: 150,
        height: 8,
        borderRadius: 20
    },
}))

const BoxFeature = ({ icon, title, subtitle }) => {    
    return (
        <Box 
            sx={{ 
                '& > *': {
                    transitionProperty: 'all',
                    transitionDuration: '0.5s', 
                    position: 'relative'
                },
                '&:hover': {
                    '& > :nth-of-type(1)': {
                        height: 8
                    },
                    '& > :nth-of-type(2)': {
                        boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.25)',
                        mt: -1,
                        '& > svg': {
                            color: (theme) => theme.palette.primary.main
                        }        
                    },
                    
                }
            }}
        >    
            <Box sx={{ width: '100%', height: 0, bgcolor: (theme) => theme.palette.primary.main, borderRadius: '8px 8px 0px 0px', zIndex: 2 }} />  
            <Box sx={{ pb: 6, pt: 8, zIndex: 1, bgcolor: 'white', borderRadius: '8px' }} className="df aic jcc fdc" >
                {icon} 
                <Typography variant="h6" fontWeight="bold" sx={{ my: 3 }}>{title}</Typography>
                <Typography align="center" sx={{ width: 150, whiteSpace: "pre-wrap" }}>{subtitle}</Typography>
            </Box>
        </Box>
    )
}

const Home = () => {
    const classes = useStyles();
    const { name, role, id } = useSelector((state) => state.auth.user);
    const { token } = useToken();

    return (
        <div className={classes.root}>
            <NavBar>
                {!token ? 
                    <Link href="/login" underline="none">
                        <Button variant="outlined">Đăng nhập</Button>
                    </Link>
                : <Typography color="primary" fontWeight="bold">{name}</Typography>}
            </NavBar>

            <Container sx={{ pt: '150px' }}>
                <Grid container>
                    <Grid item xs={8}>
                        <Typography fontSize={42} fontWeight="bold" sx={{ width: 600 }}>
                            Giải pháp quản lý  
                            <Typography component="span" fontSize={42} fontWeight="bold" color="primary">
                                {' '}hồ sơ bệnh án
                            </Typography>
                        </Typography>

                        <Typography variant="h6" sx={{ width: 580, mt: 3, mb: 5 }}>
                            <b>CEPER</b> mang đến công cụ <b>hỗ trợ cho công tác khám chữa bệnh</b> của các bác sĩ 
                            <b> cũng như công tác theo dõi, chăm sóc bệnh nhân</b> của các nhân viên y tế. Hệ thống 
                            cho phép bác sĩ, điều dưỡng và bệnh nhân có thể truy cập thông tin bệnh án một cách <b>nhanh chóng và chính xác</b>.
                        </Typography>

                        <Link href={!token ? "/login" : (role === "BN" ? `user/HSBA/${id}` : "user/HSBA")} underline="none">
                            <Button variant="primary">Sử dụng ngay</Button>
                        </Link>
                    </Grid>
                    
                    <Grid item xs={4}>
                        <Lazyload height={320}>      
                            <img src={landingImg} alt="" className={classes.landingImg} width="370" height="320" />
                        </Lazyload>
                    </Grid>
                </Grid>

                <Box className={classes.featuresBox}>
                    <Box className={classes.featuresLine} sx={{ bgcolor: (theme) => theme.palette.primary.main }} />

                    <Typography fontSize={28} fontWeight="bold" sx={{ mt: 2, mb: 8 }}>
                        Các tính năng và dịch vụ
                    </Typography>

                    <Grid container spacing={7.5} maxWidth="md">
                        <Grid item xs={4} >
                            <BoxFeature 
                                icon={<FontAwesomeIcon icon={faFileMedical} size="3x" />}
                                title="Tạo bệnh án"
                                subtitle={"Hỗ trợ điều dưỡng\ntạo bệnh án tiện lợi,\n nhanh chóng"}
                            />
                        </Grid>
                        <Grid item xs={4} >
                            <BoxFeature 
                                icon={<FontAwesomeIcon icon={faSearch} size="3x" />}
                                title="Xem bệnh án"
                                subtitle={"Hỗ trợ xem và tra cứu hồ sơ bệnh án bằng \n tìm kiếm nâng cao"}
                            />
                        </Grid>
                        <Grid item xs={4} >
                            <BoxFeature 
                                icon={<FontAwesomeIcon icon={faPencilAlt} size="3x" />}
                                title="Cập nhật bệnh án"
                                subtitle="Hỗ trợ cập nhật hồ sơ bệnh án với công cụ kiểm tra văn bản"
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Container>

            <Footer />
        </div>
    )
}

export default Home;
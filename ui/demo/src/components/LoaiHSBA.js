import React, { useContext } from "react";
import { Card, CardContent, Container, Box, CardMedia, Typography, Grid } from "@mui/material";
import '../styles/index.css';
import { makeStyles } from '@mui/styles';
import bloodTests from "../images/blood_tests.png";
import medicalKit from "../images/medical_kit.png";
import stethoscope from "../images/stethoscope.png";
import { BorderLinearProgress } from "./common";
import UserContext from "../contexts/UserContext";
import DanhSachHSBA from "./DanhSachHSBA";
import HSBA from "./HSBA";

const useStyles = makeStyles(() => ({
    card: {
        backgroundColor: '#D9EFFE',
        padding: 24,
        cursor: 'pointer',
        transform: 'scale(1) translateZ(0)',
        transition: 'transform 200ms linear, boxShadow 200ms linear',
        '&:hover': {
            transform: 'scale(1.05) translateZ(0)',
            boxShadow: '0px 5px #48B0F7'
        }
    },
    cardMedia: {
        width: 64
    }
}))

const LoaiHSBA = () => {
    const classes = useStyles();
    const { loaiHSBA, setLoaiHSBA, selectedHSBA } = useContext(UserContext);

    return (
        <Container>
            {loaiHSBA === '' ? 
                <Box className="df aic jcc">
                    <Grid container spacing={4} sx={{ mt: 3, mb: 5 }}>
                        <Grid item xs={4}>
                            <Card className={classes.card} onClick={() => setLoaiHSBA("BAKB")}>
                                <CardContent className="df" sx={{ p: 0, mb: 3 }}>
                                    <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1, pr: 7 }}>
                                        Bệnh án khám bệnh
                                    </Typography>
                                    <CardMedia 
                                        component="img"
                                        className={classes.cardMedia}
                                        image={stethoscope}
                                        alt=""
                                    />  
                                </CardContent>
                                <BorderLinearProgress variant="determinate" value={9.09} />
                                <Typography fontWeight="bold" variant="h6" color="#009ABB" sx={{ mt: 1 }}>
                                    5
                                    <Typography component="span" color="black">
                                        {' '}trong 55 hồ sơ bệnh án
                                    </Typography>
                                </Typography>
                            </Card>
                        </Grid>

                        <Grid item xs={4}>
                            <Card className={classes.card} onClick={() => setLoaiHSBA("BADT")}>
                                <CardContent className="df" sx={{ p: 0, mb: 3 }}>
                                    <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1, pr: 7 }}>
                                        Bệnh án điều trị
                                    </Typography>
                                    <CardMedia 
                                        component="img"
                                        className={classes.cardMedia}
                                        image={bloodTests}
                                        alt=""
                                    />  
                                </CardContent>
                                <BorderLinearProgress variant="determinate" value={12.72} />
                                <Typography fontWeight="bold" variant="h6" color="#009ABB" sx={{ mt: 1 }}>
                                    7
                                    <Typography component="span" color="black">
                                        {' '}trong 55 hồ sơ bệnh án
                                    </Typography>
                                </Typography>
                            </Card>
                        </Grid>

                        <Grid item xs={4}>
                            <Card className={classes.card} onClick={() => setLoaiHSBA("BAKBDT")}>
                                <CardContent className="df" sx={{ p: 0, mb: 3 }}>
                                    <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1, pr: 7 }}>
                                        Bệnh án khám bệnh & điều trị
                                    </Typography>
                                    <CardMedia 
                                        component="img"
                                        className={classes.cardMedia}
                                        image={medicalKit}
                                        alt=""
                                    />  
                                </CardContent>
                                <BorderLinearProgress variant="determinate" value={7.27} />
                                <Typography fontWeight="bold" variant="h6" color="#009ABB" sx={{ mt: 1 }}>
                                    4
                                    <Typography component="span" color="black">
                                        {' '}trong 55 hồ sơ bệnh án
                                    </Typography>
                                </Typography>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            : 
                selectedHSBA === '' ? <DanhSachHSBA /> : <HSBA />
            }  
        </Container>
    )
}

export default LoaiHSBA;
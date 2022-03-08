import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import "../../styles/index.css";

const BoxKhamBenh = () => {
    const { khamBenh } = useSelector(state => state.HSBA);

    return (
        <Box>
            <Grid container>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Khám toàn thân</Typography>
                </Grid>
                <Grid item xs={10}>
                    <Typography sx={{ pl: 3 }}>{!!khamBenh.khamToanThan ? khamBenh.khamToanThan : <i>(trống)</i>}</Typography>
                </Grid>
            </Grid>
            <Grid container sx={{ pt: 2 }}>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Tuần hoàn</Typography>
                </Grid>
                <Grid item xs={10}>
                    <Typography sx={{ pl: 3 }}>{!!khamBenh.tuanHoan ? khamBenh.tuanHoan : <i>(trống)</i>}</Typography>
                </Grid>
            </Grid>
            <Grid container sx={{ pt: 2 }}>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Hô hấp</Typography>
                </Grid>
                <Grid item xs={10}>
                    <Typography sx={{ pl: 3 }}>{!!khamBenh.hoHap ? khamBenh.hoHap : <i>(trống)</i>}</Typography>
                </Grid>
            </Grid>
            <Grid container sx={{ pt: 2 }}>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Tiêu hóa</Typography>
                </Grid>
                <Grid item xs={10}>
                    <Typography sx={{ pl: 3 }}>{!!khamBenh.tieuHoa ? khamBenh.tieuHoa : <i>(trống)</i>}</Typography>
                </Grid>
            </Grid>
            <Grid container sx={{ pt: 2 }}>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Thận - Tiết niệu - Sinh dục</Typography>
                </Grid>
                <Grid item xs={10}>
                    <Typography sx={{ pl: 3 }}>{!!khamBenh.than ? khamBenh.than : <i>(trống)</i>}</Typography>
                </Grid>
            </Grid>
            <Grid container sx={{ pt: 2 }}>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Thần kinh</Typography>
                </Grid>
                <Grid item xs={10}>
                    <Typography sx={{ pl: 3 }}>{!!khamBenh.thanKinh ? khamBenh.thanKinh : <i>(trống)</i>}</Typography>
                </Grid>
            </Grid>
            <Grid container sx={{ pt: 2 }}>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Cơ - Xương - Khớp</Typography>
                </Grid>
                <Grid item xs={10}>
                    <Typography sx={{ pl: 3 }}>{!!khamBenh.coXuongKhop ? khamBenh.coXuongKhop : <i>(trống)</i>}</Typography>
                </Grid>
            </Grid>
            <Grid container sx={{ pt: 2 }}>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Tai - Mũi - Họng</Typography>
                </Grid>
                <Grid item xs={10}>
                    <Typography sx={{ pl: 3 }}>{!!khamBenh.taiMuiHong ? khamBenh.taiMuiHong : <i>(trống)</i>}</Typography>
                </Grid>
            </Grid>
            <Grid container sx={{ pt: 2 }}>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Răng - Hàm - Mặt</Typography>
                </Grid>
                <Grid item xs={10}>
                    <Typography sx={{ pl: 3 }}>{!!khamBenh.rangHamMat ? khamBenh.rangHamMat : <i>(trống)</i>}</Typography>
                </Grid>
            </Grid>
            <Grid container sx={{ pt: 2 }}>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Mắt</Typography>
                </Grid>
                <Grid item xs={10}>
                    <Typography sx={{ pl: 3 }}>{!!khamBenh.mat ? khamBenh.mat : <i>(trống)</i>}</Typography>
                </Grid>
            </Grid>
            <Grid container sx={{ pt: 2 }}>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Nội tiết, dinh dưỡng và các bệnh lý khác</Typography>
                </Grid>
                <Grid item xs={10}>
                    <Typography sx={{ pl: 3 }}>{!!khamBenh.noiTiet ? khamBenh.noiTiet : <i>(trống)</i>}</Typography>
                </Grid>
            </Grid>
        </Box>
    )
}

export default BoxKhamBenh;
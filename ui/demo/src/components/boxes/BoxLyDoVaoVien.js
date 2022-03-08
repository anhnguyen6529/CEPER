import React from "react";
import { Box, Grid, Typography, Divider } from "@mui/material";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { RadioButtonChecked, RadioButtonUnchecked } from "@mui/icons-material";
import "../../styles/index.css";

const BoxLyDoVaoVien = () => {
    const { lyDoVaoVien } = useSelector(state => state.HSBA);

    return (
        <Box>
            <Grid container spacing={3}>
                <Grid item xs={9}>
                    <Typography>{!!lyDoVaoVien.lyDo ? lyDoVaoVien.lyDo : <i>(trống)</i>}</Typography>
                </Grid>
                <Grid item xs={3} align="right">
                    <Typography>Vào ngày thứ {!!lyDoVaoVien.vaoNgayThu ? <b>{lyDoVaoVien.vaoNgayThu}</b> : "..."} của bệnh</Typography>
                </Grid>
            </Grid>

            <Divider sx={{ my: 2 }}/>
            <Grid container>
                <Grid item xs={3}>
                    <Typography fontWeight="bold">Ngày vào viện</Typography>
                </Grid>
                <Grid item xs={9}>
                    <Typography>{!!lyDoVaoVien.ngayVaoVien ? format(new Date(lyDoVaoVien.ngayVaoVien), "dd/MM/yyyy") : <i>(trống)</i>}</Typography>
                </Grid>
            </Grid>
            
            <Grid container sx={{ pt: 1 }}>
                <Grid item xs={3}>
                    <Typography fontWeight="bold">Chẩn đoán của nơi giới thiệu</Typography>
                </Grid>
                <Grid item xs={7}>
                    <Typography>{!!lyDoVaoVien.chanDoanNoiGioiThieu ? lyDoVaoVien.chanDoanNoiGioiThieu : <i>(trống)</i>}</Typography>
                </Grid>
                <Grid item xs={2}>
                    <Box className="df aic jcfe">
                        {lyDoVaoVien.noiGioiThieu === "Y tế" ? <RadioButtonChecked fontSize="small"/> : <RadioButtonUnchecked fontSize="small" />}
                        <Typography sx={{ ml: 1, mr: 3 }}>Y tế</Typography>

                        {lyDoVaoVien.noiGioiThieu === "Tự đến" ? <RadioButtonChecked fontSize="small"/> : <RadioButtonUnchecked fontSize="small" />}
                        <Typography sx={{ ml: 1 }}>Tự đến</Typography>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}

export default BoxLyDoVaoVien;
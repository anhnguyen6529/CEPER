import React from "react";
import { Box, Grid, Typography, Divider } from "@mui/material";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import "../../styles/index.css";

const BoxChanDoanKhiRaVien = () => {
    const { chanDoanKhiRaVien } = useSelector(state => state.HSBA);

    return (
        <Box>
            <Typography>{!!chanDoanKhiRaVien.chanDoan ? chanDoanKhiRaVien.chanDoan : <i>(trống)</i>}</Typography>
        
            <Divider sx={{ my: 2 }}/>
            <Grid container>
                <Grid item xs={3}>
                    <Typography fontWeight="bold">Ngày ra viện</Typography>
                </Grid>
                <Grid item xs={9}>
                    <Typography>{!!chanDoanKhiRaVien.ngayRaVien ? format(new Date(chanDoanKhiRaVien.ngayRaVien), "dd/MM/yyyy") : <i>(trống)</i>}</Typography>
                </Grid>
            </Grid>
        </Box>
    )
}

export default BoxChanDoanKhiRaVien;
import { Box, Typography, TextField, Grid, Divider } from "@mui/material";
import React, { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../../styles/index.css";
import DateTimePicker from '@mui/lab/DateTimePicker';
import { HSBAActions } from "../../redux/slices/HSBA.slice";
import { Autorenew, Save } from "@mui/icons-material";
import { Button } from "../common";
import HSBAContext from "../../contexts/HSBAContext";

const FChanDoanKhiRaVien = () => {
    const { chanDoanKhiRaVien } = useSelector((state) => state.HSBA);
    const { role } = useSelector((state) => state.auth.user);
    const { tabTongKetBAState, setTabTongKetBAState } = useContext(HSBAContext);
    const dispatch = useDispatch();

    const [chanDoan, setChanDoan] = useState(chanDoanKhiRaVien.chanDoan);
    const [ngayRaVien, setNgayRaVien] = useState(chanDoanKhiRaVien.ngayRaVien);
    const [hasChanged, setHasChanged] = useState(false);
  
    const handleSave = () => {
        dispatch(HSBAActions.updateBacSiSection({
            section: 'chanDoanKhiRaVien',
            data: {
                chanDoan,
                ngayRaVien
            }
        }))
        setHasChanged(false);
        setTabTongKetBAState({
            ...tabTongKetBAState, 
            chanDoanKhiRaVien: { saved: true, date: new Date() }
        });
    }

    const handleReset = () => {
        setChanDoan(chanDoanKhiRaVien.chanDoan);
        setNgayRaVien(chanDoanKhiRaVien.ngayRaVien);
        setHasChanged(false);
    }

    const handleChange = () => {
        if (!hasChanged) {
            setHasChanged(true);
        }
    }

    return (
        <Box component="form" noValidate>
            <TextField 
                multiline
                fullWidth
                value={chanDoan}
                onChange={(event) => {
                    setChanDoan(event.target.value);
                    handleChange();
                }}
                disabled={role !== "BS"}
            />
            <Divider sx={{ my: 2 }}/>

            <Grid container sx={{ mt: 1 }} alignItems="center">
                <Grid item xs={1.5}>
                    <Typography fontWeight="bold">Ngày ra viện</Typography>
                </Grid>
                <Grid item xs={10.5}>
                    <DateTimePicker
                        value={!ngayRaVien ? null : ngayRaVien}
                        onChange={(newValue) => {
                            setNgayRaVien(new Date(newValue).toISOString());
                            handleChange();
                        }}
                        renderInput={(params) => <TextField {...params}/>}
                        inputFormat="DD/MM/yyyy HH:mm"
                        ampm={false}
                        leftArrowButtonText=""
                        rightArrowButtonText=""
                        disabled={role !== "BS"}
                    />
                </Grid>
            </Grid>

            {hasChanged &&
                <Box sx={{ width: '100%', textAlign: 'right', mt: 2 }}>
                    <Button variant="outlined" startIcon={<Autorenew />} sx={{ width: 150, mr: 2 }} onClick={handleReset}>
                        Đặt lại
                    </Button>

                    <Button variant="primary" startIcon={<Save />} sx={{ width: 150 }} onClick={handleSave}>
                        Lưu tạm thời
                    </Button>
                </Box>
            }
        </Box>
    )
}

export default FChanDoanKhiRaVien;

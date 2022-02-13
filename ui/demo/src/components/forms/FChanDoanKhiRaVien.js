import { Box, Typography, TextField, Grid, Divider } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import "../../styles/index.css";
import DateTimePicker from '@mui/lab/DateTimePicker';
// import { HSBAActions } from "../../redux/slices/HSBA.slice";
// import { Save } from "@mui/icons-material";

const FChanDoanKhiRaVien = () => {
    const { chanDoanKhiRaVien } = useSelector((state) => state.HSBA);
    // const dispatch = useDispatch();

    const [chanDoan, setChanDoan] = useState(chanDoanKhiRaVien.chanDoan);
    const [ngayRaVien, setNgayRaVien] = useState(chanDoanKhiRaVien.ngayRaVien);
  
    // const handleSave = () => {
    //     dispatch(HSBAActions.updateBacSiSection({
    //         section: 'chanDoanKhiRaVien',
    //         data: {
    //             chanDoan,
    //             ngayRaVien
    //         }
    //     }))
    //     setEdit(false);
    // }

    return (
        <Box component="form" noValidate>
            <TextField 
                multiline
                fullWidth
                value={chanDoan}
                onChange={(event) => setChanDoan(event.target.value)}
            />
            <Divider sx={{ my: 2 }}/>

            <Grid container sx={{ mt: 1 }} alignItems="center">
                <Grid item xs={1.5}>
                    <Typography fontWeight="bold">Ngày ra viện</Typography>
                </Grid>
                <Grid item xs={10.5}>
                    <DateTimePicker
                        value={!ngayRaVien ? null : ngayRaVien}
                        onChange={(newValue) => setNgayRaVien(newValue)}
                        renderInput={(params) => <TextField {...params}/>}
                        inputFormat="DD/MM/yyyy HH:ss"
                        ampm={false}
                        leftArrowButtonText=""
                        rightArrowButtonText=""
                    />
                </Grid>
            </Grid>

            {/* <Box sx={{ width: '100%', textAlign: 'right', mt: 3 }}>
                <Button 
                    sx={{ 
                        width: 150,
                        height: 36,
                        background: '#48B0F7', 
                        textTransform: 'none', 
                        fontWeight: 'bold',
                        color: 'white',
                        '&:hover': {
                            background: '#48B0F7', 
                        }
                    }} 
                    startIcon={<Save fontSize="small" />}
                    onClick={handleSave}
                >
                    Lưu
                </Button>
            </Box> */}
        </Box>
    )
}

export default FChanDoanKhiRaVien;

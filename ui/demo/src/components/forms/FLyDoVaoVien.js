import { Box, Typography, TextField, Grid, Divider, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import "../../styles/index.css";
import DateTimePicker from '@mui/lab/DateTimePicker';
// import { HSBAActions } from "../../redux/slices/HSBA.slice";
// import { Save } from "@mui/icons-material";

const FLyDoVaoVien = () => {
    const { lyDoVaoVien } = useSelector((state) => state.HSBA);
    // const dispatch = useDispatch();

    const [lyDo, setLyDo] = useState(lyDoVaoVien.lyDo);
    const [ngayVaoVien, setNgayVaoVien] = useState(lyDoVaoVien.ngayVaoVien);
    const [vaoNgayThu, setVaoNgayThu] = useState(lyDoVaoVien.vaoNgayThu);
    const [chanDoanNoiGioiThieu, setChanDoanNoiGioiThieu] = useState(lyDoVaoVien.chanDoanNoiGioiThieu);
    const [noiGioiThieu, setNoiGioiThieu] = useState(lyDoVaoVien.noiGioiThieu);
  
    // const handleSave = () => {
    //     dispatch(HSBAActions.updateBacSiSection({
    //         section: 'lyDoVaoVien',
    //         data: {
    //             lyDo,
    //             ngayVaoVien,
    //             vaoNgayThu,
    //             chanDoanNoiGioiThieu,
    //             noiGioiThieu
    //         }
    //     }))
    //     setEdit(false);
    // }

    // const weekdays = [...Array(7).keys()].map((i) => vi.localize.day(i !== 6 ? i + 1 : 0, { width: 'wide' }));
    // console.log(vi.localize.);

    return (
        <Box component="form" noValidate>
            <Grid container>
                <Grid item xs={9}>
                    <TextField 
                        multiline
                        fullWidth
                        value={lyDo}
                        onChange={(event) => setLyDo(event.target.value)}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Box className="df aic jcfe" sx={{ mr: 2 }}>
                        <Typography>Vào ngày thứ</Typography>
                        <TextField 
                            type="number"
                            sx={{ width: 60, mx: 1 }}
                            value={vaoNgayThu}
                            onChange={(event) => setVaoNgayThu(event.target.value)}
                        />
                        <Typography>của bệnh</Typography>
                    </Box>           
                </Grid>
            </Grid>
            <Divider sx={{ my: 2 }}/>

            <Grid container sx={{ mt: 1 }} alignItems="center">
                <Grid item xs={3}>
                    <Typography fontWeight="bold">Ngày vào viện</Typography>
                </Grid>
                <Grid item xs={9}>
                    <DateTimePicker
                        value={ngayVaoVien}
                        onChange={(newValue) => setNgayVaoVien(newValue)}
                        renderInput={(params) => <TextField {...params}/>}
                        inputFormat="DD/MM/yyyy HH:ss"
                        ampm={false}
                        leftArrowButtonText=""
                        rightArrowButtonText=""
                    />
                </Grid>
            </Grid>
            <Grid container sx={{ mt: 2 }}>
                <Grid item xs={3}>
                    <Typography fontWeight="bold" sx={{ mt: '12px' }}>Chẩn đoán của nơi giới thiệu</Typography>
                </Grid>
                <Grid item xs={7}>
                    <TextField 
                        multiline
                        fullWidth
                        sx={{ width: '90%' }}
                        value={chanDoanNoiGioiThieu}
                        onChange={(event) => setChanDoanNoiGioiThieu(event.target.value)}
                    />
                </Grid>
                <Grid item xs={2} >
                    <RadioGroup row value={noiGioiThieu} onChange={(event) => setNoiGioiThieu(event.target.value)}>
                        <FormControlLabel value="Y tế" control={<Radio />} label="Y tế" />
                        <FormControlLabel value="Tự đến" control={<Radio />} label="Tự đến" />
                    </RadioGroup>
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

export default FLyDoVaoVien;

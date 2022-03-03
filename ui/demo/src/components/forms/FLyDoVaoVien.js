import { Box, Typography, TextField, Grid, Divider, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import React, { useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../../styles/index.css";
import DateTimePicker from '@mui/lab/DateTimePicker';
import { Button } from "../common";
import { HSBAActions } from "../../redux/slices/HSBA.slice";
import HSBAContext from "../../contexts/HSBAContext";
import mdSections from "../../constants/md_sections.json";

const FLyDoVaoVien = () => {
    const { lyDoVaoVien } = useSelector((state) => state.HSBA);
    const { role } = useSelector((state) => state.auth.user);
    const { saveSec, setSaveSec } = useContext(HSBAContext);
    const dispatch = useDispatch();

    const [lyDo, setLyDo] = useState(lyDoVaoVien.lyDo);
    const [ngayVaoVien, setNgayVaoVien] = useState(lyDoVaoVien.ngayVaoVien);
    const [vaoNgayThu, setVaoNgayThu] = useState(lyDoVaoVien.vaoNgayThu);
    const [chanDoanNoiGioiThieu, setChanDoanNoiGioiThieu] = useState(lyDoVaoVien.chanDoanNoiGioiThieu);
    const [noiGioiThieu, setNoiGioiThieu] = useState(lyDoVaoVien.noiGioiThieu);
    const [hasChanged, setHasChanged] = useState(false);

    const benhAnId = mdSections["order"].indexOf("Bệnh án");
    const sectionId = mdSections["Bệnh án"].indexOf("Lý do vào viện");
  
    const handleSave = () => {
        dispatch(HSBAActions.updateBacSiSection({
            section: 'lyDoVaoVien',
            data: {
                lyDo,
                ngayVaoVien,
                vaoNgayThu,
                chanDoanNoiGioiThieu,
                noiGioiThieu
            }
        }));
        setHasChanged(false);
        let tSaveSec = [...saveSec];
        tSaveSec[benhAnId][sectionId] = new Date();
        setSaveSec(tSaveSec);
    }

    const handleReset = () => {
        setLyDo(lyDoVaoVien.lyDo);
        setNgayVaoVien(lyDoVaoVien.ngayVaoVien);
        setVaoNgayThu(lyDoVaoVien.vaoNgayThu);
        setChanDoanNoiGioiThieu(lyDoVaoVien.chanDoanNoiGioiThieu);
        setNoiGioiThieu(lyDoVaoVien.noiGioiThieu);
        setHasChanged(false);
    }

    const handleChange = () => {
        if (!hasChanged) {
            setHasChanged(true);
        }
    }

    return (
        <Box component="form" noValidate sx={{ '.MuiGrid-container': { alignItems: 'center' } }}>
            <Grid container>
                <Grid item xs={9}>
                    <TextField 
                        multiline
                        fullWidth
                        value={lyDo}
                        onChange={(event) => {
                            setLyDo(event.target.value);
                            handleChange();
                        }}
                        disabled={role !== "BS"}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Box className="df aic jcfe" sx={{ mr: 2 }}>
                        <Typography>Vào ngày thứ</Typography>
                        <TextField 
                            type="number"
                            sx={{ width: 60, mx: 1 }}
                            value={vaoNgayThu}
                            onChange={(event) => {
                                setVaoNgayThu(event.target.value);
                                handleChange();
                            }}
                            disabled={role !== "BS"}
                        />
                        <Typography>của bệnh</Typography>
                    </Box>           
                </Grid>
            </Grid>
            <Divider sx={{ my: 2 }}/>

            <Grid container sx={{ mt: 1 }}>
                <Grid item xs={3}>
                    <Typography fontWeight="bold">Ngày vào viện</Typography>
                </Grid>
                <Grid item xs={9}>
                    <DateTimePicker
                        value={ngayVaoVien}
                        onChange={(newValue) => {
                            setNgayVaoVien(newValue);
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
                        onChange={(event) => {
                            setChanDoanNoiGioiThieu(event.target.value);
                            handleChange();
                        }}
                        disabled={role !== "BS"}
                    />
                </Grid>
                <Grid item xs={2} >
                    <RadioGroup 
                        row 
                        value={noiGioiThieu}
                        onChange={(event) => {
                            setNoiGioiThieu(event.target.value); 
                            handleChange();
                        }}
                    >
                        <FormControlLabel disabled={role !== "BS"} value="Y tế" control={<Radio />} label="Y tế" />
                        <FormControlLabel disabled={role !== "BS"} value="Tự đến" control={<Radio />} label="Tự đến" />
                    </RadioGroup>
                </Grid>
            </Grid>

            {hasChanged &&
                <Box sx={{ width: '100%', textAlign: 'right', mt: 2 }}>
                    <Button variant="outlined" sx={{ mr: 2 }} onClick={handleReset}>
                        Hủy
                    </Button>

                    <Button variant="primary" onClick={handleSave}>
                        Lưu tạm thời
                    </Button>
                </Box>
            }
        </Box>
    )
}

export default FLyDoVaoVien;

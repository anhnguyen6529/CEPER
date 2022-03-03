import { Box, Typography, TextField, Grid } from "@mui/material";
import React, { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../../styles/index.css";
import { HSBAActions } from "../../redux/slices/HSBA.slice";
import { Button } from "../common";
import HSBAContext from "../../contexts/HSBAContext";
import mdSections from "../../constants/md_sections.json";

const FKhamBenh = () => {
    const { khamBenh } = useSelector((state) => state.HSBA);
    const { role } = useSelector((state) => state.auth.user);
    const { saveSec, setSaveSec } = useContext(HSBAContext);
    const dispatch = useDispatch();

    const [khamToanThan, setKhamToanThan] = useState(khamBenh.khamToanThan);
    const [tuanHoan, setTuanHoan] = useState(khamBenh.tuanHoan);
    const [hoHap, setHoHap] = useState(khamBenh.hoHap);
    const [tieuHoa, setTieuHoa] = useState(khamBenh.tieuHoa);
    const [than, setThan] = useState(khamBenh.than);
    const [thanKinh, setThanKinh] = useState(khamBenh.thanKinh);
    const [coXuongKhop, setCoXuongKhop] = useState(khamBenh.coXuongKhop);
    const [taiMuiHong, setTaiMuiHong] = useState(khamBenh.taiMuiHong);
    const [rangHamMat, setRangHamMat] = useState(khamBenh.rangHamMat);
    const [mat, setMat] = useState(khamBenh.mat);
    const [noiTiet, setNoiTiet] = useState(khamBenh.noiTiet);
    const [hasChanged, setHasChanged] = useState(false);

    const benhAnId = mdSections["order"].indexOf("Bệnh án");
    const sectionId = mdSections["Bệnh án"].indexOf("Khám bệnh");
  
    const handleSave = () => {
        dispatch(HSBAActions.updateBacSiSection({
            section: 'khamBenh',
            data: {
                khamToanThan, tuanHoan, hoHap, tieuHoa, than, thanKinh, coXuongKhop, taiMuiHong, rangHamMat, mat, noiTiet
            }
        }))
        setHasChanged(false);
        let tSaveSec = [...saveSec];
        tSaveSec[benhAnId][sectionId] = new Date();
        setSaveSec(tSaveSec);
    }

    const handleReset = () => {
        setKhamToanThan(khamBenh.khamToanThan);
        setTuanHoan(khamBenh.tuanHoan);
        setHoHap(khamBenh.hoHap);
        setTieuHoa(khamBenh.tieuHoa);
        setThan(khamBenh.than);
        setThanKinh(khamBenh.thanKinh);
        setCoXuongKhop(khamBenh.coXuongKhop);
        setTaiMuiHong(khamBenh.taiMuiHong);
        setRangHamMat(khamBenh.rangHamMat);
        setMat(khamBenh.mat);
        setNoiTiet(khamBenh.noiTiet);
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
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Khám toàn thân</Typography>
                </Grid>
                <Grid item xs={10}>
                    <TextField 
                        multiline
                        fullWidth
                        value={khamToanThan}
                        onChange={(event) => {
                            setKhamToanThan(event.target.value);
                            handleChange();
                        }}
                        disabled={role !== "BS"}
                    />
                </Grid>
            </Grid>
            <Grid container sx={{ mt: 2 }}>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Tuần hoàn</Typography>
                </Grid>
                <Grid item xs={10}>
                    <TextField 
                        multiline
                        fullWidth
                        value={tuanHoan}
                        onChange={(event) => {
                            setTuanHoan(event.target.value);
                            handleChange();
                        }}
                        disabled={role !== "BS"}
                    />
                </Grid>
            </Grid>
            <Grid container sx={{ mt: 2 }}>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Hô hấp</Typography>
                </Grid>
                <Grid item xs={10}>
                    <TextField 
                        multiline
                        fullWidth
                        value={hoHap}
                        onChange={(event) => {
                            setHoHap(event.target.value);
                            handleChange();
                        }}
                        disabled={role !== "BS"}
                    />
                </Grid>
            </Grid>
            <Grid container sx={{ mt: 2 }}>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Tiêu hóa</Typography>
                </Grid>
                <Grid item xs={10}>
                    <TextField 
                        multiline
                        fullWidth
                        value={tieuHoa}
                        onChange={(event) => {
                            setTieuHoa(event.target.value);
                            handleChange();
                        }}
                        disabled={role !== "BS"}
                    />
                </Grid>
            </Grid>
            <Grid container sx={{ mt: 2 }}>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Thận - Tiết niệu - Sinh dục</Typography>
                </Grid>
                <Grid item xs={10}>
                    <TextField 
                        multiline
                        fullWidth
                        value={than}
                        onChange={(event) => {
                            setThan(event.target.value);
                            handleChange();
                        }}
                        disabled={role !== "BS"}
                    />
                </Grid>
            </Grid>
            <Grid container sx={{ mt: 2 }}>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Thần kinh</Typography>
                </Grid>
                <Grid item xs={10}>
                    <TextField 
                        multiline
                        fullWidth
                        value={thanKinh}
                        onChange={(event) => {
                            setThanKinh(event.target.value);
                            handleChange();
                        }}
                        disabled={role !== "BS"}
                    />
                </Grid>
            </Grid>
            <Grid container sx={{ mt: 2 }}>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Cơ - Xương - Khớp</Typography>
                </Grid>
                <Grid item xs={10}>
                    <TextField 
                        multiline
                        fullWidth
                        value={coXuongKhop}
                        onChange={(event) => {
                            setCoXuongKhop(event.target.value);
                            handleChange();
                        }}
                        disabled={role !== "BS"}
                    />
                </Grid>
            </Grid>
            <Grid container sx={{ mt: 2 }}>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Tai - Mũi - Họng</Typography>
                </Grid>
                <Grid item xs={10}>
                    <TextField 
                        multiline
                        fullWidth
                        value={taiMuiHong}
                        onChange={(event) => {
                            setTaiMuiHong(event.target.value);
                            handleChange();
                        }}
                        disabled={role !== "BS"}
                    />
                </Grid>
            </Grid>
            <Grid container sx={{ mt: 2 }}>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Răng - Hàm - Mặt</Typography>
                </Grid>
                <Grid item xs={10}>
                    <TextField 
                        multiline
                        fullWidth
                        value={rangHamMat}
                        onChange={(event) => {
                            setRangHamMat(event.target.value);
                            handleChange();
                        }}
                        disabled={role !== "BS"}
                    />
                </Grid>
            </Grid>
            <Grid container sx={{ mt: 2 }}>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Mắt</Typography>
                </Grid>
                <Grid item xs={10}>
                    <TextField 
                        multiline
                        fullWidth
                        value={mat}
                        onChange={(event) => {
                            setMat(event.target.value);
                            handleChange();
                        }}
                        disabled={role !== "BS"}
                    />
                </Grid>
            </Grid>
            <Grid container sx={{ mt: 2 }}>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Nội tiết, dinh dưỡng và các bệnh lý khác</Typography>
                </Grid>
                <Grid item xs={10}>
                    <TextField 
                        multiline
                        fullWidth
                        value={noiTiet}
                        onChange={(event) => {
                            setNoiTiet(event.target.value);
                            handleChange();
                        }}
                        disabled={role !== "BS"}
                    />
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

export default FKhamBenh;

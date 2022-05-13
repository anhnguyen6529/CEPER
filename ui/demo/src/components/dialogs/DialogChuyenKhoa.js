import { 
    Box, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText,
    Grid, MenuItem, Select, TextField, Typography 
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../common";
import CDepartment from "../../constants/department.json";
import HSBAThunk from "../../redux/thunks/HSBA.thunk";
import UserContext from "../../contexts/UserContext";
import { useSnackbar } from "notistack";

const DialogChuyenKhoa = ({ open, setOpen }) => {
    const { HSBA } = useSelector((state) => state);
    const { accentColor } = useSelector((state) => state.auth.settings.appearance);
    const { setOpenBackdrop, handleLogout } = useContext(UserContext); 
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const [khoa, setKhoa] = useState('');
    const [phong, setPhong] = useState('');
    const [giuong, setGiuong] = useState('');
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const clearData = () => {
        setKhoa('');
        setPhong('');
        setGiuong('');
        setHasSubmitted(false);
    }

    const handleCancel = () => {
        clearData();
        setOpen(false);
    }

    const handleTransferFaculty = () => {
        if (!hasSubmitted) {
            setHasSubmitted(true);
        }
        if (!!khoa && !!phong && !!giuong) {
            dispatch(HSBAThunk.transferFaculty({ pid: HSBA.pid, khoa, phong, giuong })).then(() => {
                setOpenBackdrop(false);
                enqueueSnackbar("Chuyển khoa thành công", { variant: "success" });
            });
            clearData();
            setOpen(false);
        }
    }

    useEffect(() => {
        if (HSBA.transfering) {
            setOpenBackdrop(true);
        } else {
            if (HSBA.transferingError === "Token has expired") {
                setOpenBackdrop(false);
                handleLogout();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [HSBA.transfering, HSBA.transferingError]);

    return (
        <Dialog open={open} disableEnforceFocus fullWidth>
            <DialogTitle component="div">
                Nhập thông tin chuyển khoa
                <Typography variant="subtitle1">
                    Bệnh nhân{' '}
                    <Typography fontWeight="bold" component="span" color={`${accentColor}.main`}>{HSBA.hanhChinh.hoTen}</Typography> 
                    {' '}<b>(Mã BN: {HSBA.pid})</b>
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Grid container columnSpacing={3}>
                    <Grid item xs={6}>
                        <Typography fontWeight="bold">HIỆN TẠI</Typography>
                        <Box sx={{ mt: 1 }}>
                            <Typography fontWeight="bold">Khoa</Typography>
                            <TextField margin="dense" fullWidth value={HSBA.khoa} disabled multiline/>
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography fontWeight="bold">CHUYỂN ĐẾN</Typography>
                        <Box sx={{ mt: 1 }}>
                            <Typography fontWeight="bold">Khoa</Typography>
                            <FormControl sx={{ width: "100%" }}>
                                <Select
                                    sx={{ mt: 1, '.MuiSelect-outlined': { whiteSpace: 'normal' } }}
                                    value={khoa}
                                    onChange={({ target: { value } }) => {
                                        setKhoa(value);
                                    }}
                                    error={hasSubmitted && !khoa}
                                    displayEmpty
                                    renderValue={(select) => !select ? "-- Chọn --" : select}
                                >
                                    <MenuItem value="" disabled>-- Chọn --</MenuItem>
                                    {Object.keys(CDepartment).sort().map((dept, id) => (
                                        <MenuItem disabled={dept === HSBA.khoa} value={dept} key={id}>{dept}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText error>{hasSubmitted && !khoa ? "Vui lòng nhập Khoa" : ""}</FormHelperText>
                            </FormControl>
                        </Box>
                    </Grid>
                </Grid>
                <Grid container columnSpacing={3} sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                        <Typography fontWeight="bold">Phòng</Typography>
                        <TextField margin="dense" fullWidth value={HSBA.phong} disabled/>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography fontWeight="bold">Phòng</Typography>
                        <FormControl sx={{ width: "100%" }}>
                            <Select
                                sx={{ mt: 1, '.MuiSelect-outlined': { whiteSpace: 'normal' } }}
                                value={phong}
                                onChange={({ target: { value } }) => {
                                    setPhong(value);
                                }}
                                error={hasSubmitted && !phong}
                                displayEmpty
                                renderValue={(select) => !select ? "-- Chọn --" : select}
                            >
                                <MenuItem value="" disabled>-- Chọn --</MenuItem>
                                {!!khoa && Object.keys(CDepartment[khoa]).sort().map((phongOption, id) => (
                                    <MenuItem value={phongOption} key={id}>{phongOption}</MenuItem>
                                ))}
                            </Select>
                            <FormHelperText error>{hasSubmitted && !phong ? "Vui lòng nhập Phòng" : ""}</FormHelperText>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container columnSpacing={3} sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                        <Typography fontWeight="bold">Giường</Typography>
                        <TextField margin="dense" fullWidth value={HSBA.giuong} disabled/>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography fontWeight="bold">Giường</Typography>
                        <FormControl sx={{ width: "100%" }}>
                            <Select
                                sx={{ mt: 1, '.MuiSelect-outlined': { whiteSpace: 'normal' } }}
                                value={giuong}
                                onChange={({ target: { value } }) => {
                                    setGiuong(value);
                                }}
                                error={hasSubmitted && !giuong}
                                displayEmpty
                                renderValue={(select) => !select ? "-- Chọn --" : select}
                            >
                                <MenuItem value="" disabled>-- Chọn --</MenuItem>
                                {(!!khoa && !!phong) && CDepartment[khoa][phong].sort().map((giuongOption, id) => (
                                    <MenuItem value={giuongOption} key={id}>{giuongOption}</MenuItem>
                                ))}
                            </Select>
                            <FormHelperText error>{hasSubmitted && !giuong ? "Vui lòng nhập Giường" : ""}</FormHelperText>
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" sx={{ mr: 1 }} onClick={handleCancel}>
                    Hủy
                </Button>
                <Button onClick={handleTransferFaculty}>
                    Chuyển khoa
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DialogChuyenKhoa;
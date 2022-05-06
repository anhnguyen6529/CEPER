import React, { useContext, useEffect } from "react";
import { 
    Box, FormControl, FormHelperText, Grid, 
    MenuItem, Paper, Select, TextField, Typography 
} from "@mui/material";
import { DateTimePicker } from "@mui/lab";
import "../../../styles/index.css";
import CDepartment from "../../../constants/department.json";
import { useDispatch } from "react-redux";
import danhSachHSBAThunk from "../../../redux/thunks/danhSachHSBA.thunk";
import TaoHSBAContext from "../../../contexts/TaoHSBAContext";
import moment from "moment";
import UserContext from "../../../contexts/UserContext";

const FHoSo = () => {
    const { values, setValues, errors, setErrors, hasChangedNew, setHasChangedNew, submitted } = useContext(TaoHSBAContext);
    const { handleLogout } = useContext(UserContext);
    const dispatch = useDispatch();
    const now = new Date();

    useEffect(() => {
        dispatch(danhSachHSBAThunk.getNewPID()).unwrap().then((response) => {
            if (response.token) {
                localStorage.setItem('token', response.token);
            }
            setValues({ ...values, pid: response.newPID })
        }).catch((error) => {
            if (error === "Token has expired") {
                handleLogout();
            }
        });
        // eslint-disable-next-line
    }, []);
    
    return (
        <Paper sx={{ px: 3, pt: 1.5, pb: 2, mb: 2 }}>
            <Typography fontWeight="bold" color="primary" sx={{ mb: 2 }}>
                Thông tin hồ sơ{' '}
                <Typography component="span" color="error" fontWeight="bold">*</Typography>
            </Typography>
            <Grid container columnSpacing={3} rowSpacing={1}>
                <Grid item xs={6} lg={2.4}>
                    <Typography fontWeight="bold">Mã BN</Typography>
                    <TextField 
                        fullWidth
                        margin="dense"
                        value={values.pid}
                        disabled
                    />
                </Grid>
                <Grid item xs={6} lg={2.4}>
                    <Typography fontWeight="bold">Ngày vào viện</Typography>
                    <DateTimePicker
                        value={values.ngayVaoVien}
                        onChange={(newValue) => {
                            setValues({ ...values, ngayVaoVien: newValue });
                            if (!!newValue) {
                                if (!hasChangedNew) {
                                    setHasChangedNew(true);
                                }
                                setErrors({ ...errors, ngayVaoVien: "" });
                            } else {
                                setErrors({ ...errors, ngayVaoVien: "Vui lòng nhập Ngày vào viện" });
                            }
                        }}
                        renderInput={(params) => 
                            <TextField 
                                fullWidth 
                                {...params} 
                                margin="dense" 
                                error={submitted && !!errors.ngayVaoVien}
                                helperText={submitted ? errors.ngayVaoVien : ""} 
                            />
                        }
                        inputFormat="DD/MM/yyyy HH:mm"
                        ampm={false}
                        leftArrowButtonText=""
                        rightArrowButtonText=""
                        maxDateTime={moment(now)}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={2.4}>
                    <Typography fontWeight="bold">Khoa</Typography>
                    <FormControl sx={{ width: "100%" }}>
                        <Select
                            fullWidth
                            sx={{ mt: 1 }}
                            value={values.khoa}
                            onChange={({ target: { value } }) => {
                                setValues({ ...values, khoa: value, phong: "", giuong: "" });
                                if (!!value) {
                                    if (!hasChangedNew) {
                                        setHasChangedNew(true);
                                    }
                                    setErrors({ ...errors, khoa: "" });
                                } else {
                                    setErrors({ ...errors, khoa: "Vui lòng nhập Khoa" });
                                }
                            }}
                            error={submitted && !!errors.khoa}
                            displayEmpty
                            renderValue={(select) => !select ? "-- Chọn --" : select}
                        >
                            <MenuItem value="" disabled>-- Chọn --</MenuItem>
                            {Object.keys(CDepartment).sort().map((dept, id) => (
                                <MenuItem value={dept} key={id}>{dept}</MenuItem>
                            ))}
                        </Select>
                        <FormHelperText error>{submitted ? errors.khoa : ""}</FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6} lg={2.4}>
                    <Typography fontWeight="bold">Phòng</Typography>
                    <FormControl sx={{ width: "100%" }}>
                        <Select
                            fullWidth
                            sx={{ mt: 1 }}
                            value={values.phong}
                            onChange={({ target: { value } }) => {
                                setValues({ ...values, phong: value, giuong: "" });
                                if (!!value) {
                                    if (!hasChangedNew) {
                                        setHasChangedNew(true);
                                    }
                                    setErrors({ ...errors, phong: "" });
                                } else {
                                    setErrors({ ...errors, phong: "Vui lòng nhập Phòng" });
                                }
                            }}
                            error={submitted && !!errors.phong}
                            displayEmpty
                            renderValue={(select) => !select ? "-- Chọn --" : select}
                        >
                            <MenuItem value="" disabled>-- Chọn --</MenuItem>
                            {!!values.khoa && Object.keys(CDepartment[values.khoa]).sort().map((phongOption, id) => (
                                <MenuItem value={phongOption} key={id}>{phongOption}</MenuItem>
                            ))}
                        </Select>
                        <FormHelperText error>{submitted ? errors.phong : ""}</FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6} lg={2.4}>
                    <Typography fontWeight="bold">Giường</Typography>
                    <FormControl sx={{ width: "100%" }}>
                        <Select
                            fullWidth
                            sx={{ mt: 1 }}
                            value={values.giuong}
                            onChange={({ target: { value } }) => {
                                setValues({ ...values, giuong: value });
                                if (!!value) {
                                    if (!hasChangedNew) {
                                        setHasChangedNew(true);
                                    }
                                    setErrors({ ...errors, giuong: "" });
                                } else {
                                    setErrors({ ...errors, giuong: "Vui lòng nhập Giường" });
                                }
                            }}
                            error={submitted && !!errors.giuong}
                            displayEmpty
                            renderValue={(select) => !select ? "-- Chọn --" : select}
                        >
                            <MenuItem value="" disabled>-- Chọn --</MenuItem>
                            {(!!values.khoa && !!values.phong) && CDepartment[values.khoa][values.phong].sort().map((giuongOption, id) => (
                                <MenuItem value={giuongOption} key={id}>{giuongOption}</MenuItem>
                            ))}
                        </Select>
                        <FormHelperText error>{submitted ? errors.giuong : ""}</FormHelperText>
                    </FormControl>
                </Grid>

                <Grid item xs={6} lg={2.4}>
                    <Typography fontWeight="bold">
                        Mạch{' '}
                        <Typography component="span" fontWeight="bold">(<i>lần/phút</i>)</Typography>
                    </Typography>
                    <TextField 
                        type="number"
                        InputProps={{ inputProps: { min: 0 } }}
                        fullWidth
                        margin="dense"
                        value={values.mach}
                        onChange={({ target: { value } }) => {
                            setValues({ ...values, mach: !value ? 0 : parseInt(value) });
                            if (!!value && parseInt(value) > 0) {
                                if (!hasChangedNew) {
                                    setHasChangedNew(true);
                                }
                                setErrors({ ...errors, mach: "" });
                            } else {
                                setErrors({ ...errors, mach: "Vui lòng nhập Mạch" });
                            }
                        }}
                        error={submitted && !!errors.mach}
                        helperText={submitted ? errors.mach : ""} 
                    />
                </Grid>
                <Grid item xs={6} lg={2.4}>
                    <Typography fontWeight="bold">
                        Nhiệt độ{' '}
                        <Typography component="span" fontWeight="bold">(<i>°C</i>)</Typography>
                    </Typography>
                    <TextField 
                        type="number"
                        InputProps={{ inputProps: { min: 0 } }}
                        fullWidth
                        margin="dense"
                        value={values.nhietDo}
                        onChange={({ target: { value } }) => {
                            setValues({ ...values, nhietDo: !value ? 0 : parseFloat(value) });
                            if (!!value && parseFloat(value) > 0) {
                                if (!hasChangedNew) {
                                    setHasChangedNew(true);
                                }
                                setErrors({ ...errors, nhietDo: "" });
                            } else {
                                setErrors({ ...errors, nhietDo: "Vui lòng nhập Nhiệt độ" });
                            }
                        }}
                        error={submitted && !!errors.nhietDo}
                        helperText={submitted ? errors.nhietDo : ""} 
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={2.4}>
                    <Typography fontWeight="bold">
                        Huyết áp{' '}
                        <Typography component="span" fontWeight="bold">(<i>mmHg</i>)</Typography>
                    </Typography>
                    <FormControl sx={{ width: "100%" }}>
                        <Box className="df aic">
                            <TextField 
                                type="number"
                                InputProps={{ inputProps: { min: 0 } }}
                                fullWidth
                                margin="dense"
                                value={values.huyetAp[0]}
                                onChange={({ target: { value } }) => {
                                    setValues({ ...values, huyetAp: [!value ? 0 : parseInt(value), values.huyetAp[1]] });
                                    if (!!value && parseInt(value) > 0) {
                                        if (!hasChangedNew) {
                                            setHasChangedNew(true);
                                        } 
                                        if (values.huyetAp[1] > 0) {
                                            setErrors({ ...errors, huyetAp: "" });
                                        }
                                    } else {
                                        setErrors({ ...errors, huyetAp: "Vui lòng nhập Huyết áp" });
                                    }
                                }}
                                error={submitted && !!errors.huyetAp}
                            />
                            <Typography sx={{ mx: 1 }}>/</Typography>
                            <TextField 
                                type="number"
                                InputProps={{ inputProps: { min: 0 } }}
                                fullWidth
                                margin="dense"
                                value={values.huyetAp[1]}
                                onChange={({ target: { value } }) => {
                                    setValues({ ...values, huyetAp: [values.huyetAp[0], !value ? 0 : parseInt(value)] });
                                    if (!!value && parseInt(value) > 0) {
                                        if (!hasChangedNew) {
                                            setHasChangedNew(true);
                                        }
                                        if (values.huyetAp[0] > 0) {
                                            setErrors({ ...errors, huyetAp: "" });
                                        }
                                    } else {
                                        setErrors({ ...errors, huyetAp: "Vui lòng nhập Huyết áp" });
                                    }
                                }}
                                error={submitted && !!errors.huyetAp}
                            />
                        </Box>
                        <FormHelperText error>{submitted ? errors.huyetAp : ""}</FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={6} lg={2.4}>
                    <Typography fontWeight="bold">
                        Nhịp thở{' '}
                        <Typography component="span" fontWeight="bold">(<i>lần/phút</i>)</Typography>
                    </Typography>
                    <TextField 
                        type="number"
                        InputProps={{ inputProps: { min: 0 } }}
                        fullWidth
                        margin="dense"
                        value={values.nhipTho}
                        onChange={({ target: { value } }) => {
                            setValues({ ...values, nhipTho: !value ? 0 : parseInt(value) });
                            if (!!value && parseInt(value) > 0) {
                                if (!hasChangedNew) {
                                    setHasChangedNew(true);
                                }
                                setErrors({ ...errors, nhipTho: "" });
                            } else {
                                setErrors({ ...errors, nhipTho: "Vui lòng nhập Nhịp thở" });
                            }
                        }}
                        error={submitted && !!errors.nhipTho}
                        helperText={submitted ? errors.nhipTho : ""} 
                    />
                </Grid>
                <Grid item xs={6} lg={2.4}>
                    <Typography fontWeight="bold">
                        Cân nặng{' '}
                        <Typography component="span" fontWeight="bold">(<i>kg</i>)</Typography>
                    </Typography>
                    <TextField 
                        type="number"
                        InputProps={{ inputProps: { min: 0 } }}
                        fullWidth
                        margin="dense"
                        value={values.canNang}
                        onChange={({ target: { value } }) => {
                            setValues({ ...values, canNang: !value ? 0 : parseFloat(value) });
                            if (!!value && parseFloat(value) > 0) {
                                if (!hasChangedNew) {
                                    setHasChangedNew(true);
                                }
                                setErrors({ ...errors, canNang: "" });
                            } else {
                                setErrors({ ...errors, canNang: "Vui lòng nhập Cân nặng" });
                            }
                        }}
                        error={submitted && !!errors.canNang}
                        helperText={submitted ? errors.canNang : ""} 
                    />
                </Grid>
            </Grid>
        </Paper>
    )
}

export default FHoSo;
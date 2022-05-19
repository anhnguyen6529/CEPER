import { 
    Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText,
    Grid, MenuItem, Select, TextField, Typography 
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../common";
import CDepartment from "../../constants/department.json";
import HSBAThunk from "../../redux/thunks/HSBA.thunk";
import UserContext from "../../contexts/UserContext";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";

const DialogChuyenKhoa = ({ open, setOpen }) => {
    const { HSBA } = useSelector((state) => state);
    const { accentColor } = useSelector((state) => state.auth.settings.appearance);
    const { setOpenBackdrop, handleLogout } = useContext(UserContext); 
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [khoa, setKhoa] = useState('');
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const clearData = () => {
        setKhoa('');
        setHasSubmitted(false);
    }

    const handleCancel = () => {
        clearData();
        setOpen(false);
    }

    const handleConfirm = () => {
        if (!hasSubmitted) {
            setHasSubmitted(true);
        }
        if (!!khoa) {
            const danhSachYLenh = HSBA.danhSachYLenh.filter((dsyl) => dsyl.khoa === HSBA.khoa && dsyl.xacNhan !== "Thực hiện xong");
            const phieuChamSoc = { data: [] };
            var prevData = [...HSBA.phieuChamSoc.data].reverse(), rowsChanged = [];
            danhSachYLenh.forEach((dsyl) => {
                if (dsyl.xacNhan === "Đang thực hiện") {
                    var rowIndex = prevData.findIndex(element => element.thucHienYLenh.includes(dsyl.yLenh));
                    if (rowIndex !== -1) {
                        const index = prevData[rowIndex].thucHienYLenh.findIndex(thyl => thyl === dsyl.yLenh), tXacNhan = [...prevData[rowIndex].xacNhan];
                        tXacNhan[index] = "Thực hiện xong (chuyển khoa)";
                        prevData[rowIndex] = { ...prevData[rowIndex], xacNhan: tXacNhan };
                        if (!rowsChanged.includes(rowIndex)) {
                            rowsChanged.push(rowIndex);
                        }
                    }
                }
            });
            rowsChanged.forEach((rowChanged) => {
                phieuChamSoc.data.push(prevData[rowChanged]);
            });
            dispatch(HSBAThunk.transferFaculty({ 
                pid: HSBA.pid, 
                prevKhoa: HSBA.khoa, 
                khoa, phong: "", giuong: "", 
                danhSachYLenh, 
                phieuChamSoc 
            })).then(() => {
                setOpenBackdrop(false);
                enqueueSnackbar("Chuyển khoa thành công", { variant: "success" });
                navigate('/user/HSBA');
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
                        <Typography fontWeight="bold">Khoa hiện tại</Typography>
                        <TextField margin="dense" fullWidth value={HSBA.khoa} disabled multiline/>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography fontWeight="bold">Khoa chuyển đến</Typography>
                        <FormControl sx={{ width: "100%" }}>
                            <Select
                                sx={{ mt: 1, '.MuiSelect-outlined': { whiteSpace: 'pre-wrap' } }}
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
                            <FormHelperText error>{hasSubmitted && !khoa ? "Vui lòng chọn Khoa" : ""}</FormHelperText>
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" sx={{ mr: 1 }} onClick={handleCancel}>
                    Hủy
                </Button>
                <Button onClick={handleConfirm}>
                    Xác nhận
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DialogChuyenKhoa;
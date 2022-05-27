import { Edit } from "@mui/icons-material";
import { Avatar, Box, Chip, FormControl, Grid, IconButton, MenuItem, Paper, Select, Typography } from "@mui/material";
import { format } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserContext from "../../contexts/UserContext";
import CDepartment from "../../constants/department.json";
import { Button } from "../common";
import HSBAThunk from "../../redux/thunks/HSBA.thunk";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";

const colorTrangThai = { "Chờ khám": "warning", "Đang điều trị": "info", "Đã ra viện": "default" };

const BoxHoSo = () => {
    const { role } = useSelector(state => state.auth.user);
    const benhNhan = useSelector(state => state.HSBA);
    const { today, handleLogout } = useContext(UserContext); 
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const [editMode, setEditMode] = useState(false);
    const [newPhong, setNewPhong] = useState(benhNhan.phong);
    const [newGiuong, setNewGiuong] = useState(benhNhan.giuong);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const resetData = () => {
        setEditMode(false);
        setHasSubmitted(false);
        setNewPhong(benhNhan.phong);
        setNewGiuong(benhNhan.giuong);
    }

    const handleUpdate = () => {
        if (!hasSubmitted) {
            setHasSubmitted(true);  
        }
        if (!!newPhong && !!newGiuong) {
            if (newPhong !== benhNhan.phong || (newPhong === benhNhan.phong && newGiuong !== benhNhan.giuong)) {
                dispatch(HSBAThunk.updateSickRoomBed({ pid: benhNhan.pid, phong: newPhong, giuong: newGiuong }));
            }
        }
    }
    
    useEffect(() => {
        if (!benhNhan.updatingRoomBed && !benhNhan.updatingRoomBedError) {
            if (hasSubmitted) {
                enqueueSnackbar("Cập nhật thông tin bệnh án thành công", { variant: "success" });
            }
            resetData();
        } else {
            if (benhNhan.updatingRoomBedError === "Token has expired") {
                handleLogout();
            }
        }
        // eslint-disable-next-line 
    }, [benhNhan.updatingRoomBed, benhNhan.updatingRoomBedError]);

    return (
        <Paper sx={{ width: '100%', p: 3, pt: 2.5 }}>
            <Grid container spacing={3}>
                <Grid item xs={2}>
                    <Avatar src="/images/avatar_default.png" sx={{ width: 100, height: 100 }} />
                </Grid>
                <Grid item xs={10}>
                    <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mb: 0.5 }}>{benhNhan.hanhChinh.hoTen}</Typography>
                    <Grid container columnSpacing={3}>
                        <Grid item xs={3}>
                            <Typography fontWeight="bold">Mã BN</Typography>
                            <Typography>{benhNhan.pid}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography fontWeight="bold">Ngày vào viện</Typography>
                            <Typography>{benhNhan.lyDoVaoVien.ngayVaoVien ? format(new Date(benhNhan.lyDoVaoVien.ngayVaoVien), 'dd/MM/yyyy HH:mm') : benhNhan.lyDoVaoVien.ngayVaoVien}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography fontWeight="bold">Ngày điều trị thứ</Typography>
                            <Typography>{Math.ceil((today - new Date(String(benhNhan.lyDoVaoVien.ngayVaoVien))) / (1000 * 60 * 60 * 24))}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography fontWeight="bold">Trạng thái</Typography>
                            <Chip size="small" label={benhNhan.trangThai} color={colorTrangThai[benhNhan.trangThai]} />
                        </Grid>
                    </Grid>
                    <Grid container columnSpacing={3}>
                        <Grid item xs={3}>
                            <Typography fontWeight="bold">Khoa</Typography>
                            <Typography>{benhNhan.khoa}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography fontWeight="bold">
                                Phòng{' '}
                                {editMode ? <Typography component="span" color="error" fontWeight="bold">*</Typography> : null}
                            </Typography>
                            {!editMode ? <Typography>{benhNhan.phong}</Typography> : 
                                <FormControl sx={{ width: "100%" }}>
                                    <Select
                                        fullWidth
                                        sx={{ mt: 0.5 }}
                                        value={newPhong}
                                        onChange={({ target: { value } }) => {
                                            setNewPhong(value);
                                            setNewGiuong("");
                                        }}
                                        displayEmpty
                                        renderValue={(select) => !select ? "-- Chọn --" : select}
                                    >
                                        <MenuItem value="" disabled>-- Chọn --</MenuItem>
                                        {Object.keys(CDepartment[benhNhan.khoa]).sort().map((phongOption, id) => (
                                            <MenuItem value={phongOption} key={id} disabled={phongOption === newPhong}>{phongOption}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            }
                        </Grid>
                        <Grid item xs={3}>
                            <Typography fontWeight="bold">
                                Giường{' '}
                                {editMode ? <Typography component="span" color="error" fontWeight="bold">*</Typography> : null}
                            </Typography>
                            {!editMode ? <Typography>{benhNhan.giuong}</Typography> :
                                <FormControl sx={{ width: "100%" }}>
                                    <Select
                                        fullWidth
                                        sx={{ mt: 0.5 }}
                                        value={newGiuong}
                                        onChange={({ target: { value } }) => {
                                            setNewGiuong(value);
                                        }}
                                        displayEmpty
                                        renderValue={(select) => !select ? "-- Chọn --" : select}
                                    >
                                        <MenuItem value="" disabled>-- Chọn --</MenuItem>
                                        {!!newPhong && CDepartment[benhNhan.khoa][newPhong].sort().map((giuongOption, id) => (
                                            <MenuItem value={giuongOption} key={id} disabled={giuongOption === newGiuong}>{giuongOption}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            }
                        </Grid>
                        <Grid item xs={3}>
                            <Typography fontWeight="bold">Ngày ra viện</Typography>
                            <Typography>
                                {benhNhan.chanDoanKhiRaVien.ngayRaVien 
                                    ? format(new Date(benhNhan.chanDoanKhiRaVien.ngayRaVien), 'dd/MM/yyyy HH:mm') 
                                    : <Typography component="span">(<i>trống</i>)</Typography>
                                }
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container columnSpacing={3}>
                        <Grid item xs={12}>
                            <Box className="df">
                                <Box sx={{ flex: "1 0 auto"}}>
                                    <Typography fontWeight="bold">Bệnh điều trị</Typography>
                                    <Typography>
                                        {!!benhNhan.toDieuTri.data.length > 0 
                                            ? benhNhan.toDieuTri.data[benhNhan.toDieuTri.data.length - 1].chanDoan
                                            : <Typography component="span">(<i>trống</i>)</Typography>
                                        }
                                    </Typography>
                                </Box>
                                {role === "DD" ? 
                                    <Box className="df aife">
                                        {!editMode ?
                                            <IconButton
                                                sx={{
                                                    bgcolor: (theme) => theme.palette.primary.dark,
                                                    color: "white",
                                                    '&:hover': {
                                                        bgcolor: (theme) => theme.palette.primary.dark,
                                                        color: "white",
                                                    }
                                                }}
                                                onClick={() => setEditMode(true)}
                                            >
                                                <Edit fontSize="small" />
                                            </IconButton>
                                        : ( 
                                            <Box className="df">
                                                <Button 
                                                    variant="outlined-dark" 
                                                    sx={{ minWidth: 80, mr: 1 }} 
                                                    onClick={() => resetData()}
                                                >
                                                    Hủy
                                                </Button>
                                                {!benhNhan.updatingRoomBed ?
                                                    <Button 
                                                        variant="primary-dark" 
                                                        sx={{ minWidth: 100 }}
                                                        onClick={handleUpdate}
                                                        disabled={!newPhong || !newGiuong || (newPhong === benhNhan.phong && newGiuong === benhNhan.giuong)}
                                                    >
                                                        Cập nhật
                                                    </Button>
                                                : <LoadingButton loading variant="contained">Cập nhật</LoadingButton>
                                                }
                                            </Box>
                                        )}
                                    </Box>
                                : null}
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    )
}

export default BoxHoSo;
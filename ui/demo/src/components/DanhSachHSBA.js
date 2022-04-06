import React, { useContext, useEffect, useState } from "react";
import { Box, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, Typography, CircularProgress, Snackbar, Alert } from "@mui/material";
import "../styles/index.css";
import { useDispatch, useSelector } from "react-redux";
import { TDanhSachHienTai, TDanhSachRaVien } from "./tables";
import { Button, TabPanel, Tabs } from "./common";
import UserContext from "../contexts/UserContext";
import { ArrowBack } from "@mui/icons-material";
import { FBacSiPhuTrach, FHanhChinh, FHoSo } from "./forms/creating";
import { danhSachHSBAActions } from "../redux/slices/danhSachHSBA.slice";
import { initialValues, initialErrors, TaoHSBAProvider } from "../contexts/TaoHSBAContext";
import danhSachHSBAThunk from "../redux/thunks/danhSachHSBA.thunk";

const DanhSachHSBA = () => {
    const { role, name, id } = useSelector(state => state.auth.user);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(danhSachHSBAThunk.getDanhSachHSBA({ role: role, doctorID: role === "BS" ? id : "" }))
        // eslint-disable-next-line 
    }, []);

    const { danhSachHSBATab, setDanhSachHSBATab } = useContext(UserContext);
    const { hienTai, raVien, creatingMode, loading } = useSelector(state => state.danhSachHSBA);
    
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState(initialErrors);
    const [hasChangedNew, setHasChangedNew] = useState(false);
    const [openDialogNew, setOpenDialogNew] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    if (loading) {
        return (
            <div className="df fdc aic jcc">
                <CircularProgress sx={{ mt: 3, mb: 1 }} />
                <Typography color="primary">Đang tải...</Typography>
            </div>
        )
    }

    const handleChangeTab = (_, newValue) => {
        setDanhSachHSBATab({
            ...danhSachHSBATab,
            value: newValue
        });
    }

    const handleCreate = () => {
        if (Object.keys(errors).every(key => (key !== "nguoiNha" && !errors[key]) || (key === "nguoiNha" && Object.values(errors.nguoiNha).every(val => !val)))) {
            dispatch(danhSachHSBAThunk.createNewHSBA({
                pid: values.pid, avatar: values.avatar, trangThai: "Chờ khám",
                khoa: values.khoa, phong: values.phong, giuong: values.giuong,
                hanhChinh: {
                    hoTen: values.hoTen, ngaySinh: new Date(values.ngaySinh).toISOString(), gioiTinh: values.gioiTinh, ngheNghiep: values.ngheNghiep,
                    noiLamViec: values.noiLamViec, quocTich: values.quocTich, danToc: values.danToc, soCCCD: values.soCCCD,
                    doiTuong: values.doiTuong, dienThoai: values.dienThoai, soNha: values.soNha, thonPho: values.thonPho,
                    phuongXa: values.phuongXa, quanHuyen: values.quanHuyen, tinhTP: values.tinhTP, 
                    soTheBHYT: values.soTheBHYT.replace(" ", ""), 
                    noiDangKyKCBBanDau: values.noiDangKyKCBBanDau, giaTriTu: !!values.giaTriTu ? new Date(values.giaTriTu).toISOString() : "", 
                    giaTriDen: !!values.giaTriDen ? new Date(values.giaTriDen).toISOString() : "", nguoiNha: values.nguoiNha
                },
                lyDoVaoVien: {
                    lyDo: "", vaoNgayThu: "", chanDoanNoiGioiThieu: "", noiGioiThieu: "",
                    ngayVaoVien: new Date(values.ngayVaoVien).toISOString()
                },
                benhAn: { thoiGian: "", bacSiLamBenhAn: values.bacSiPhuTrach },
                phieuTDChucNangSong: {
                    data: [{ 
                        ngayGio: new Date(values.ngayVaoVien).toISOString(), mach: values.mach, nhietDo: values.nhietDo, 
                        huyetAp: String(values.huyetAp[0]).concat('/').concat(String(values.huyetAp[1])), 
                        nhipTho: values.nhipTho, canNang: values.canNang, dieuDuongGhi: name 
                    }]
                }
            }));
            setSubmitted(false);
            setHasChangedNew(false);
            setOpenDialogNew(false);
            setValues(initialValues);
            setErrors(initialErrors);
            setOpenSnackbar(true);
        } else {
            setSubmitted(true);
        }
    }

    return (
        <TaoHSBAProvider value={{ values, setValues, errors, setErrors, hasChangedNew, setHasChangedNew, submitted, setSubmitted }}>
            <Container sx={{ mt: 3 }} maxWidth={false}>
                <Slide direction="right" appear={false} in={!creatingMode} mountOnEnter unmountOnExit>
                    <Box sx={{ bgcolor: 'white' }}>
                        <Tabs 
                            value={danhSachHSBATab.value}
                            onChange={handleChangeTab}
                            sx={{ '.Mui-selected': { cursor: 'default' }}}
                            tabs={[
                                { label: "Hiện tại", showIcon: false, icon: null },
                                { label: "Ra viện", showIcon: false, icon: null }
                            ]}
                        />
                        <TabPanel value={danhSachHSBATab.value} index={0}>
                            <TDanhSachHienTai data={hienTai} />
                        </TabPanel>
                        <TabPanel value={danhSachHSBATab.value} index={1}>
                            <TDanhSachRaVien data={raVien} />
                        </TabPanel>
                    </Box>
                </Slide>

                <Slide direction="left" in={creatingMode} mountOnEnter unmountOnExit>
                    <Box>
                        <ArrowBack 
                            sx={{ cursor: 'pointer', color: 'rgba(0, 0, 0, 0.54)', mb: 2 }}
                            onClick={() => {
                                if (!hasChangedNew) {
                                    setSubmitted(false);
                                    dispatch(danhSachHSBAActions.setCreatingMode(false));
                                } else {
                                    setOpenDialogNew(true);
                                }
                            }}
                        />

                        <FHoSo />
                        <FHanhChinh />
                        <FBacSiPhuTrach />
                        
                        <Box className="df aic" sx={{ mt: 3 }}>
                            <Button variant="primary-dark" onClick={handleCreate} disabled={!hasChangedNew}>Tạo</Button>
                            <Typography color="error" fontWeight="bold" sx={{ ml: 2 }}>
                                {submitted && Object.keys(errors).some(key => (key !== "nguoiNha" && !!errors[key]) 
                                || (key === "nguoiNha" && Object.values(errors.nguoiNha).some(val => !!val)))
                                    ? "*Vui lòng nhập thông tin đầy đủ và hợp lệ!" : ""}
                            </Typography>
                        </Box>

                        <Dialog open={openDialogNew}>
                            <DialogTitle>Xác nhận thoát tạo bệnh án</DialogTitle>
                            <DialogContent>
                                <DialogContentText>Toàn bộ nội dung đã nhập của bệnh án mới sẽ không được lưu.</DialogContentText>
                                <DialogContentText>Bạn có chắc chắn muốn thoát?</DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button 
                                    variant="outlined" 
                                    sx={{ mr: 1 }} 
                                    onClick={() => {
                                        setSubmitted(false);
                                        setHasChangedNew(false);
                                        setOpenDialogNew(false);
                                        setValues(initialValues);
                                        setErrors(initialErrors);
                                        dispatch(danhSachHSBAActions.setCreatingMode(false));
                                    }}
                                >
                                    Thoát
                                </Button>
                                <Button onClick={() => setOpenDialogNew(false)}>
                                    Tiếp tục tạo
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                </Slide>

                <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={() => setOpenSnackbar(false)}>
                    <Alert elevation={6} variant="filled" severity="success">
                        Tạo bệnh án thành công
                    </Alert>
                </Snackbar>
            </Container>
        </TaoHSBAProvider>
    )
}

export default DanhSachHSBA;
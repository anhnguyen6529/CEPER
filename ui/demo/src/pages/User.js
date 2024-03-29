import React, { useEffect, useState } from "react";
import { Box, CssBaseline, Typography, Divider, Breadcrumbs, Link, Container, Grid } from "@mui/material";
import { Add, MoveDown, NavigateNext } from "@mui/icons-material";
import "../styles/index.css";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router";
import { Drawer, ToolBar, Main, DrawerHeader, ScrollToTop, Button, DialogConfirm } from "../components/common";
import { UserProvider } from "../contexts/UserContext";
import { DanhSachHSBA, HSBA, Settings } from "../components";
import mdSections from "../constants/md_sections.json";
import { danhSachHSBAActions } from "../redux/slices/danhSachHSBA.slice";
import { sectionState, SpellingErrorActions } from "../redux/slices/spellingError.slice";
import { HSBAActions } from "../redux/slices/HSBA.slice";
import HSBAThunk from "../redux/thunks/HSBA.thunk";
import { useSnackbar } from "notistack";
import useToken from "../hooks/useToken";
import authApi from "../apis/auth";
import store from "../redux/store";
import DialogChuyenKhoa from "../components/dialogs/DialogChuyenKhoa";

const User = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { pid } = useParams();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const { user } = useSelector(state => state.auth);
    const selectedHSBA = useSelector(state => state.HSBA);
    const { creatingMode } = useSelector(state => state.danhSachHSBA);
    const { spellingError } = useSelector(state => state);
    const { token, removeToken } = useToken();
    
    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else if (user.role === 'BN' && location.pathname.includes('HSBA')) {
            navigate(`/user/HSBA/${user.id}`);
        }
        // eslint-disable-next-line
    }, []);

    const [open, setOpen] = useState(true);
    const [appearSec, setAppearSec] = useState(mdSections["appearFirst"][user.role].map((sec) => mdSections["sortOrder"][user.role].indexOf(sec)));
    const [appearTime, setAppearTime] = useState(mdSections["sortOrder"][user.role].reduce((prev, key) => ({ ...prev, [key]: null }), {}));
    const [openSec, setOpenSec] = useState(new Array(mdSections["sortOrder"][user.role].length).fill(true));  
    const [today, setToday] = useState(new Date());
    const [danhSachHSBATab, setDanhSachHSBATab] = useState({
        value: 0,
        hienTaiCols: [], hienTaiColsChecked: [],
        raVienCols: [], raVienColsChecked: []
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [openDialogChuyenKhoa, setOpenDialogChuyenKhoa] = useState(false);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const getUserContent = (role) => {
        if (location.pathname.includes('settings')) {
            return <Settings />
        }
        switch (role) {
            case "BN":
                return <HSBA />;
            case "BS":
                return typeof(pid) === 'undefined' ? <DanhSachHSBA /> : <HSBA />;
            case "DD": 
                return typeof(pid) === 'undefined' ? <DanhSachHSBA /> : <HSBA />;
            default: 
                return <></>;
        }
    }

    useEffect(() => {
        const timer = setInterval(() => { 
            setToday(new Date());
        }, 1000);
        return () => {
            clearInterval(timer);
        }
    }, []);

    const handleUpdate = () => {
        if (Object.keys(sectionState).filter(key => mdSections["clinical"].includes(key)).some(key => 
        ((["Lý do vào viện", "Hỏi bệnh", "Khám bệnh", "Chẩn đoán khi ra viện"].includes(key) && mdSections[key].some(subKey => 
        spellingError[key][subKey].changed))) || (key === "Phiếu công khai thuốc" && spellingError[key].changed &&
        Object.keys(spellingError[key]).filter(subKey => !["loading", "changed"].includes(subKey)).length > 0) 
        || (!["Lý do vào viện", "Hỏi bệnh", "Khám bệnh", "Chẩn đoán khi ra viện", "Phiếu công khai thuốc"].includes(key) 
        && spellingError[key].changed))) {
            dispatch(HSBAActions.update());
        } else {
            dispatch(HSBAActions.confirmUpdate());
            setOpenBackdrop(true);
        }
    }

    const handleConfirmUpdate = () => {
        const checkBenhAn = mdSections["Bệnh án"].some(key => spellingError[key].changed);
        const checkTongKetBA = mdSections["Tổng kết bệnh án"].some(key => spellingError[key].changed);
        dispatch(HSBAThunk.updateHSBA({
            pid: selectedHSBA.pid, 
            trangThai: checkBenhAn ? "Đang điều trị" : (checkTongKetBA ? "Đã ra viện" : selectedHSBA.trangThai),
            ...(checkBenhAn && { 
                benhAn: { ...selectedHSBA.benhAn, thoiGian: new Date().toISOString() },
                lyDoVaoVien: selectedHSBA.lyDoVaoVien, hoiBenh: selectedHSBA.hoiBenh, khamBenh: selectedHSBA.khamBenh, tomTatBenhAn: selectedHSBA.tomTatBenhAn, chanDoanBanDau: selectedHSBA.chanDoanBanDau,
            }),
            ...(checkTongKetBA && {
                tongKetBenhAn: { thoiGian: new Date().toISOString(), bacSiDieuTri: { id: user.id, name: user.name } },
                phuongPhapDieuTri: selectedHSBA.phuongPhapDieuTri, chanDoanKhiRaVien: selectedHSBA.chanDoanKhiRaVien, tinhTrangRaVien: selectedHSBA.tinhTrangRaVien, huongDieuTri: selectedHSBA.huongDieuTri,
            }),            
            danhSachYLenh: selectedHSBA.danhSachYLenh, toDieuTri: selectedHSBA.toDieuTri, phieuTDDiUngThuoc: selectedHSBA.phieuTDDiUngThuoc, 
            phieuChamSoc: selectedHSBA.phieuChamSoc, phieuTDTruyenDich: selectedHSBA.phieuTDTruyenDich, phieuTDChucNangSong: selectedHSBA.phieuTDChucNangSong, phieuCongKhaiThuoc: selectedHSBA.phieuCongKhaiThuoc
        }));    
    }

    useEffect(() => {
        if (selectedHSBA.confirmUpdate && selectedHSBA.attachedSecUpdated) {
            handleConfirmUpdate();
        }
        // eslint-disable-next-line
    }, [selectedHSBA.attachedSecUpdated, selectedHSBA.confirmUpdate]);

    useEffect(() => {
        if (selectedHSBA.confirmUpdate && !selectedHSBA.setting) {
            setOpenBackdrop(false);
            if (!selectedHSBA.settingError) {
                dispatch(SpellingErrorActions.resetState());
                localStorage.setItem('status', 'UPDATED');
                navigate(0);
            } else {
                if (selectedHSBA.settingError === "Token has expired") {
                    handleLogout();
                }
            }  
        }
        // eslint-disable-next-line
    }, [selectedHSBA.setting, selectedHSBA.settingError]);

    window.onload = function() {
        if (localStorage.getItem('status')) {
            enqueueSnackbar("Cập nhật thông tin bệnh án thành công", { variant: "success" });
            localStorage.removeItem('status');
        }
    };

    const handleLogout = async (reLogin=true) => {
		try {
			await authApi.logout();
            
            removeToken();
            navigate(reLogin ? '/login' : '/');
            store.dispatch({ type: 'LOG_OUT'});
		} catch (error) {
            if (error.response) {
                console.log('Response:', error.response);
            } else if (error.request) {
                console.log('Request:', error.request);
            } else if (error.message) {
                console.log('Message:', error.message);
            }
		}
	}
    
    return (
        <UserProvider value={{
            open, 
            appearSec,
            setAppearSec,
            appearTime,
            setAppearTime,
            openSec, 
            setOpenSec,
            today,
            danhSachHSBATab,
            setDanhSachHSBATab,
            handleUpdate,
            setOpenDialog,
            openBackdrop,
            setOpenBackdrop,
            handleLogout
        }}>
            <Box sx={{ display: 'flex'}}>
                <CssBaseline />

                <ToolBar open={open} toggleDrawer={toggleDrawer}/>

                <Drawer 
                    open={open} 
                    toggleDrawer={toggleDrawer} 
                    content={{ name: user.name, role: user.role }} 
                />

                <Main open={open}>
                    <ScrollToTop />
                    <DrawerHeader />
                
                    {location.pathname.includes('HSBA') && user.role !== "BN" ?
                        <>
                            <Divider sx={{ mt: 3, bgcolor: (theme) => theme.palette.primary.dark }} />
                            <Container maxWidth={false}>
                                <Grid container alignItems="center">
                                    <Grid item xs={9}>
                                        <Breadcrumbs sx={{ my: 1.5, color: (theme) => theme.palette.primary.dark }} separator={<NavigateNext fontSize="small" />}>
                                            <Link underline="none" key="1" color="inherit" href="/user/HSBA">
                                                Danh sách bệnh án
                                            </Link>
                                            {typeof(pid) !== 'undefined' && 
                                                <Typography key="2">
                                                    Bệnh nhân {selectedHSBA.hanhChinh.hoTen} (Mã BN: {selectedHSBA.pid})
                                                </Typography>
                                            }
                                            {creatingMode && <Typography key="2">Tạo bệnh án mới</Typography>}
                                        </Breadcrumbs>
                                    </Grid>
                                    <Grid item xs={3} align="right">
                                            {typeof(pid) === 'undefined' && user.role === "DD" && !creatingMode ? 
                                                <Button 
                                                    variant="primary-dark"
                                                    startIcon={<Add />}
                                                    onClick={() => dispatch(danhSachHSBAActions.setCreatingMode(true))}
                                                >
                                                    Tạo bệnh án mới
                                                </Button>
                                            : null}
                                            {typeof(pid) !== 'undefined' && user.role === "BS" && selectedHSBA.trangThai !== "Đã ra viện" ? 
                                                <Button
                                                    variant="primary-dark"
                                                    startIcon={<MoveDown />}
                                                    onClick={() => setOpenDialogChuyenKhoa(true)}
                                                >
                                                    Chuyển khoa
                                                </Button>
                                            : null}
                                    </Grid>
                                </Grid>
                            </Container>
                            <Divider sx={{ bgcolor: (theme) => theme.palette.primary.dark }} />
                        </>
                    : null}
                        
                    {getUserContent(user.role)}

                    {location.pathname.includes('HSBA') && user.role !== "BN" ? 
                        <Container maxWidth={false}>
                            {(typeof(pid) !== 'undefined' || creatingMode) ?
                                <Breadcrumbs sx={{ mt: 3, color: (theme) => theme.palette.primary.dark }} separator={<NavigateNext fontSize="small" />}>
                                    <Link underline="none" key="1" color="inherit" href="/user/HSBA">
                                        Danh sách bệnh án
                                    </Link>
                                    {typeof(pid) !== 'undefined' && 
                                        <Typography key="2">
                                            Bệnh nhân {selectedHSBA.hanhChinh.hoTen} (Mã BN: {selectedHSBA.pid})
                                        </Typography>
                                    }
                                    {creatingMode && <Typography key="2">Tạo bệnh án mới</Typography>}
                                </Breadcrumbs>
                            : null}
                        </Container>
                    : null}
                </Main>

                <DialogChuyenKhoa open={openDialogChuyenKhoa} setOpen={setOpenDialogChuyenKhoa} />

                <DialogConfirm
                    open={openDialog}
                    title="Xác nhận cập nhật bệnh án"
                    contentText={"Nội dung đã thay đổi phải được cập nhật trước khi ẩn mục.\nBạn có muốn cập nhật bệnh án?"}
                    cancelText="Cập nhật"
                    handleCancel={() => {
                        handleUpdate();
                        setOpenDialog(false);
                    }}
                    okText="Tiếp tục chỉnh sửa"
                    handleOk={() => setOpenDialog(false)}
                />
            </Box>
        </UserProvider>
    )
}

export default User;
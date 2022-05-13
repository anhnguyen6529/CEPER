import React, { useContext, useEffect } from "react";
import { Typography, Avatar, Grid, Container, Paper, CircularProgress, Collapse, Box, Backdrop, Chip } from "@mui/material";
import mdSections from "../constants/md_sections.json";
import '../styles/index.css';
import { format } from "date-fns";
import UserContext from "../contexts/UserContext";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import HSBAThunk from "../redux/thunks/HSBA.thunk";
import { Button } from "./common";
import { FToDieuTri, FPhieuTDDiUngThuoc, FPhieuChamSoc, FPhieuTDChucNangSong, FPhieuTDTruyenDich, FPhieuCongKhaiThuoc } from "./forms";
import ToolBarSection from "./ToolBarSection";
import { GroupBenhAn, GroupTongKetBA } from "./groupSections";
import { BoxHanhChinh } from "./boxes";
import { sectionState } from "../redux/slices/spellingError.slice";
import { useSnackbar } from "notistack";
import { HSBAActions } from "../redux/slices/HSBA.slice";

const colorTrangThai = { "Chờ khám": "warning", "Đang điều trị": "primary", "Đã ra viện": "default" };

const HSBA = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pid } = useParams();
    const { open, today, appearSec, appearTime, setAppearTime, openSec, handleUpdate, 
        openBackdrop, setOpenBackdrop, handleLogout } = useContext(UserContext); 
    const { role, id } = useSelector(state => state.auth.user);
    const { autoUpdateWithProcessResult } = useSelector(state => state.auth.settings.functionality);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if ((id === pid && role === "BN") || role !== "BN") {
            dispatch(HSBAThunk.getOneHSBAByPID(pid));
            const appearFirstTime = new Date().toISOString();
            setAppearTime({ ...appearTime, ...mdSections["appearFirst"][role].reduce((prev, key) => ({ ...prev, [key]: appearFirstTime }), {}) });
        } else {
            navigate(`/user/HSBA/${id}`);
            dispatch(HSBAThunk.getOneHSBAByPID(id));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { spellingError } = useSelector((state) => state);
    const { accentColor } = useSelector((state) => state.auth.settings.appearance);
    const benhNhan = useSelector(state => state.HSBA);
    const { loading, loadingError, updating, confirmUpdate, transfering } = benhNhan;

    useEffect(() => {
        if (loadingError === "Token has expired") {
            handleLogout();
        }
        // eslint-disable-next-line 
    }, [loadingError]);

    useEffect(() => {
        if (updating && Object.keys(sectionState).some(key => spellingError[key].changed)) {
            if (!spellingError.loading && !spellingError.loadingError) {
                if (autoUpdateWithProcessResult) {
                    setTimeout(() => {
                        dispatch(HSBAActions.confirmUpdate());
                        setOpenBackdrop(true);
                    }, 2000);
                } else {
                    setOpenBackdrop(false);
                    enqueueSnackbar("Thông tin bệnh án đã được xử lý!\n Xem kết quả ở \"Danh sách mục - Xử lý lỗi\".", { 
                        variant: "success",
                        style: { whiteSpace: "pre-line" }
                    });
                    const firstKey = Object.keys(sectionState).find(key => !!spellingError[key].changed);
                    document.getElementById(firstKey).scrollIntoView({ behavior: "smooth" });
                }
            } else {
                if (spellingError.loading) {
                    setOpenBackdrop(true);
                } else {
                    if (spellingError.loadingError === "Token has expired") {
                        setOpenBackdrop(false);
                        handleLogout();
                    }
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updating, spellingError.loading, spellingError.loadingError]);

    var dauHieuSinhTon = [...benhNhan.phieuTDChucNangSong.data];
    dauHieuSinhTon.sort(function(a, b) {
        var ngayGioA = new Date(a.ngayGio);
        var ngayGioB = new Date(b.ngayGio);
        if (ngayGioA < ngayGioB) return -1;
        if (ngayGioA > ngayGioB) return 1;
        return 0;
    });
    const { mach, nhietDo, huyetAp, nhipTho, canNang } = dauHieuSinhTon.length > 0 
        ? dauHieuSinhTon[dauHieuSinhTon.length - 1]
        : { mach: '', nhietDo: '', huyetAp: '', nhipTho: '', canNang: '' };
        
    const renderSwitch = (sectionId) => {
        switch (mdSections["sortOrder"][role][sectionId]) {
            case "Hành chính": 
                return <BoxHanhChinh />
            case "Bệnh án": 
                return <GroupBenhAn />
            case "Tổng kết bệnh án": 
                return <GroupTongKetBA />
            case "Tờ điều trị":
                return <FToDieuTri />
            case "Phiếu chăm sóc":
                return <FPhieuChamSoc />
            case "Phiếu TD truyền dịch": 
                return <FPhieuTDTruyenDich />
            case "Phiếu TD chức năng sống": 
                return <FPhieuTDChucNangSong />
            case "Phiếu TD dị ứng thuốc": 
                return <FPhieuTDDiUngThuoc />
            case "Phiếu công khai thuốc": 
                return <FPhieuCongKhaiThuoc />
            default: 
                return <></>
        }
    }

    return (
        <Container sx={{ mt: 3 }} maxWidth={false}>
            {!loading && !loadingError ? 
                <>
                    <Grid container spacing={5} sx={{ mb: 3 }}>
                        <Grid item xs={9}>
                            <Paper sx={{ width: '100%', p: 3, pt: 2.5 }}>
                                <Grid container spacing={3}>
                                    <Grid item xs={2}>
                                        <Avatar src="/images/avatar_default.png" sx={{ width: 100, height: 100 }} />
                                    </Grid>
                                    <Grid item xs={10}>
                                        <Typography variant="h5" color={`${accentColor}.main`} fontWeight="bold" sx={{ mb: 0.5 }}>{benhNhan.hanhChinh.hoTen}</Typography>
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
                                                <Typography fontWeight="bold">Phòng</Typography>
                                                <Typography>{benhNhan.phong}</Typography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Typography fontWeight="bold">Giường</Typography>
                                                <Typography>{benhNhan.giuong}</Typography>
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
                                                <Typography fontWeight="bold">Bệnh điều trị</Typography>
                                                <Typography>
                                                    {!!benhNhan.toDieuTri.data.length > 0 
                                                        ? benhNhan.toDieuTri.data[benhNhan.toDieuTri.data.length - 1].chanDoan
                                                        : <Typography component="span">(<i>trống</i>)</Typography>
                                                    }
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item xs={3}>
                            <Paper sx={{ height: '100%', width: '100%', px: 3, py: 2 }}>
                                <Grid container direction="column" sx={{ height: '100%' }}>
                                    <Grid container item xs={2.4} alignItems="center" sx={{ borderBottom: (theme) => `2px solid ${theme.palette[accentColor].light}` }}>
                                        <Grid item xs={6}>
                                            <Typography fontWeight="bold">Mạch</Typography>
                                        </Grid>
                                        <Grid item xs={6} align="right">
                                            <Typography variant="h6" color={`${accentColor}.main`}>
                                                {mach}{' '}
                                                <Typography color="#000" component="span">lần/phút</Typography>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container item xs={2.4} alignItems="center" sx={{ borderBottom: (theme) => `2px solid ${theme.palette[accentColor].light}` }}>
                                        <Grid item xs={6}>
                                            <Typography fontWeight="bold">Nhiệt độ</Typography>
                                        </Grid>
                                        <Grid item xs={6} align="right">
                                            <Typography variant="h6" color={`${accentColor}.main`}>
                                                {nhietDo}{' '}
                                                <Typography color="#000" component="span">°C</Typography>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container item xs={2.4} alignItems="center" sx={{ borderBottom: (theme) => `2px solid ${theme.palette[accentColor].light}` }}>
                                        <Grid item xs={6}>
                                            <Typography fontWeight="bold">Huyết áp</Typography>
                                        </Grid>
                                        <Grid item xs={6} align="right">
                                            <Typography variant="h6" color={`${accentColor}.main`}>
                                                {huyetAp}{' '}
                                                <Typography color="#000" component="span">mmHg</Typography>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container item xs={2.4} alignItems="center" sx={{ borderBottom: (theme) => `2px solid ${theme.palette[accentColor].light}` }}>
                                        <Grid item xs={6}>
                                            <Typography fontWeight="bold">Nhịp thở</Typography>
                                        </Grid>
                                        <Grid item xs={6} align="right">
                                            <Typography variant="h6" color={`${accentColor}.main`}>
                                                {nhipTho}{' '}
                                                <Typography color="#000" component="span">lần/phút</Typography>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container item xs={2.4} alignItems="center">
                                        <Grid item xs={6}>
                                            <Typography fontWeight="bold">Cân nặng</Typography>
                                        </Grid>
                                        <Grid item xs={6} align="right">
                                            <Typography variant="h6" color={`${accentColor}.main`}>
                                                {canNang}{' '}
                                                <Typography color="#000" component="span">kg</Typography>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>

                    {appearSec.map((sectionId, id) => (
                        <Paper 
                            key={mdSections["sortOrder"][role][sectionId]}
                            sx={{ width: '100%', mt: 2, px: 3, pt: 1.5, pb: 1 }} 
                        >  
                            <Grid container>
                                <Grid item xs={9}> 
                                    <Typography fontWeight="bold" color={openSec[sectionId] ? `${accentColor}.main` : "inherit"} >
                                        {mdSections["sortOrder"][role][sectionId]}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3} align="right">
                                    <ToolBarSection id={id} sectionId={sectionId} sectionName={mdSections["sortOrder"][role][sectionId]} />
                                </Grid>
                            </Grid>
                        
                            <Collapse in={openSec[sectionId]} timeout="auto" unmountOnExit sx={{ py: 2 }}>
                                {renderSwitch(sectionId)}
                            </Collapse>
                        </Paper>
                    ))} 

                    {Object.keys(sectionState).some(key => spellingError[key].changed) ?
                        !updating && !confirmUpdate ? 
                            <Box 
                                className="df aic" 
                                sx={{ 
                                    bgcolor: "white", 
                                    width: "100%", 
                                    position: "fixed", 
                                    left: open ? 240 : 0, 
                                    bottom: 0, 
                                    px: 3, 
                                    py: 1.5, 
                                    borderTop: (theme) => `1px solid ${theme.palette.divider}`, 
                                    zIndex: (theme) => theme.zIndex.drawer + 1
                                }}
                            >
                                <Button variant="primary-dark" onClick={handleUpdate}>
                                    Cập nhật
                                </Button>
                            </Box>
                        : null
                    : null} 

                    <Backdrop open={openBackdrop} sx={{ color: "white", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                        <div className="df fdc aic jcc">
                            <CircularProgress color="inherit" sx={{ mt: 3, mb: 1 }}/>
                            <Typography color="inherit">
                                {confirmUpdate && "Đang cập nhật bệnh án..."}
                                {transfering && "Đang chuyển khoa..."}
                                {updating && "Đang xử lý thông tin bệnh án..."}
                            </Typography>
                        </div>
                    </Backdrop>
                </>
            : (
                <div className="df fdc aic jcc">
                    <CircularProgress sx={{ mt: 3, mb: 1, color: (theme) => theme.palette[accentColor].main }} />
                    <Typography color={`${accentColor}.main`}>Đang tải...</Typography>
                </div>
            )}
        </Container>
    )
}

export default HSBA;
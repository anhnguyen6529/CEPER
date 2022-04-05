import React, { useContext, useEffect, useState } from "react";
import { 
    Typography, Avatar, Grid, Container, Paper, CircularProgress, Collapse, Box, Snackbar, Alert, AlertTitle, Backdrop, Chip
} from "@mui/material";
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
import { HSBAActions } from "../redux/slices/HSBA.slice";
import { sectionState, SpellingErrorActions } from "../redux/slices/spellingError.slice";

const colorTrangThai = { "Chờ khám": "warning", "Đang điều trị": "primary", "Đã ra viện": "default" };

const HSBA = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pid } = useParams();
    const { open, today, appearSec, appearTime, setAppearTime, openSec } = useContext(UserContext); 
    const { role, id } = useSelector(state => state.auth.user);

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
    const benhNhan = useSelector(state => state.HSBA);
    const { loading, updating, confirmUpdate } = benhNhan;
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(false);

    useEffect(() => {
        if (updating && Object.keys(sectionState).some(key => spellingError[key].changed)) {
            if (!spellingError.loading) {
                setTimeout(() => {
                    setOpenBackdrop(false);
                    setOpenSnackbar(true);
                    const firstKey = Object.keys(sectionState).find(key => !!spellingError[key].changed);
                    document.getElementById(firstKey).scrollIntoView({ behavior: "smooth" });
                }, 2000);
            } else {
                setOpenBackdrop(true);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updating, spellingError.loading]);

    if (loading) {
        return (
            <div className="df fdc aic jcc">
                <CircularProgress sx={{ mt: 3, mb: 1 }} />
                <Typography color="primary">Đang tải...</Typography>
            </div>
        )
    }

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

    const handleUpdate = () => {
        if (Object.keys(sectionState).filter(key => !mdSections["attached"].includes(key)).some(key => ((["Lý do vào viện", "Hỏi bệnh", "Khám bệnh", "Chẩn đoán khi ra viện"].includes(key) 
            && mdSections[key].some(subKey => spellingError[key][subKey].changed))) || (!["Lý do vào viện", "Hỏi bệnh", "Khám bệnh", "Chẩn đoán khi ra viện"].includes(key) && spellingError[key].changed))) {
            dispatch(HSBAActions.update());
        } else {
            dispatch(HSBAActions.confirmUpdate());
            setOpenSnackbar(true);
            dispatch(SpellingErrorActions.resetState());
        }
    }

    return (
        <Container sx={{ mt: 3 }} maxWidth={false}>
            <Grid container spacing={5} sx={{ mb: 3 }}>
                <Grid item xs={9}>
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
                                        <Typography>{benhNhan.lyDoVaoVien.ngayVaoVien ? format(new Date(benhNhan.lyDoVaoVien.ngayVaoVien), 'dd/MM/yyyy') : benhNhan.lyDoVaoVien.ngayVaoVien}</Typography>
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
                                                ? format(new Date(benhNhan.chanDoanKhiRaVien.ngayRaVien), 'dd/MM/yyyy') 
                                                : <Typography component="span">(<i>trống</i>)</Typography>
                                            }
                                        </Typography>
                                    </Grid>
                                    
                                </Grid>
                                <Grid container columnSpacing={3}>
                                    <Grid item xs={6}>
                                        <Typography fontWeight="bold">Bệnh điều trị</Typography>
                                        <Typography>{benhNhan.chanDoanBanDau}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography fontWeight="bold">Tình trạng hiện tại</Typography>
                                        <Typography>{benhNhan.toDieuTri.data[benhNhan.toDieuTri.data.length - 1].dienBienBenh}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={3}>
                    <Paper sx={{ height: '100%', width: '100%', px: 3, py: 2 }}>
                        <Grid container direction="column" sx={{ height: '100%' }}>
                            <Grid container item xs={2.4} alignItems="center" sx={{ borderBottom: '2px solid #D9EFFE' }}>
                                <Grid item xs={6}>
                                    <Typography fontWeight="bold">Mạch</Typography>
                                </Grid>
                                <Grid item xs={6} align="right">
                                    <Typography variant="h6" color="primary">
                                        {mach}{' '}
                                        <Typography color="#000" component="span">lần/phút</Typography>
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container item xs={2.4} alignItems="center" sx={{ borderBottom: '2px solid #D9EFFE' }}>
                                <Grid item xs={6}>
                                    <Typography fontWeight="bold">Nhiệt độ</Typography>
                                </Grid>
                                <Grid item xs={6} align="right">
                                    <Typography variant="h6" color="primary">
                                        {nhietDo}{' '}
                                        <Typography color="#000" component="span">°C</Typography>
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container item xs={2.4} alignItems="center" sx={{ borderBottom: '2px solid #D9EFFE' }}>
                                <Grid item xs={6}>
                                    <Typography fontWeight="bold">Huyết áp</Typography>
                                </Grid>
                                <Grid item xs={6} align="right">
                                    <Typography variant="h6" color="primary">
                                        {huyetAp}{' '}
                                        <Typography color="#000" component="span">mmHg</Typography>
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container item xs={2.4} alignItems="center" sx={{ borderBottom: '2px solid #D9EFFE' }}>
                                <Grid item xs={6}>
                                    <Typography fontWeight="bold">Nhịp thở</Typography>
                                </Grid>
                                <Grid item xs={6} align="right">
                                    <Typography variant="h6" color="primary">
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
                                    <Typography variant="h6" color="primary">
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
                            <Typography fontWeight="bold" color={openSec[sectionId] ? "primary" : "inherit"} >
                                {mdSections["sortOrder"][role][sectionId]}
                            </Typography>
                        </Grid>
                        <Grid item xs={3} align="right">
                            <ToolBarSection id={id} sectionId={sectionId} />
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

            <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={() => setOpenSnackbar(false)}>
                <Alert elevation={6} variant="filled" severity="success">
                    {updating ? 
                        <>
                            <AlertTitle>Thông tin bệnh án đã được xử lý!</AlertTitle>
                            Vui lòng di chuyển đến các mục trong "<i>Danh sách mục - Xử lý lỗi</i>" để xem kết quả.
                        </> 
                    : (confirmUpdate ? "Cập nhật thông tin bệnh án thành công" : "")}
                </Alert>
            </Snackbar>

            <Backdrop open={openBackdrop} sx={{ color: "white", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </Container>
    )
}

export default HSBA;
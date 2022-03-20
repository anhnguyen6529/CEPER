import React, { useContext, useEffect, useState } from "react";
import { 
    Typography, Divider, Avatar, Grid, Container, Paper, CircularProgress, Collapse, Box, Snackbar, Alert, AlertTitle, Backdrop
} from "@mui/material";
import mdSections from "../constants/md_sections.json";
import '../styles/index.css';
import { format } from "date-fns";
import UserContext from "../contexts/UserContext";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import HSBAThunk from "../redux/thunks/HSBA.thunk";
import { Button } from "./common";
import { FToDieuTri, FPhieuTDDiUngThuoc, FPhieuChamSoc, FPhieuTDChucNangSong, FPhieuTDTruyenDich, FPhieuCongKhaiThuoc } from "./forms";
import ToolBarSection from "./ToolBarSection";
import { GroupBenhAn, GroupTongKetBA } from "./groupSections";
import { BoxHanhChinh } from "./boxes";
import { HSBAActions } from "../redux/slices/HSBA.slice";

const HSBA = () => {
    const dispatch = useDispatch();
    const { pid } = useParams();
    useEffect(() => {
        dispatch(HSBAThunk.getOneHSBAByPID(pid));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { today, appearSec, openSec, hasChanged } = useContext(UserContext); 
    const { spellingError } = useSelector((state) => state);
    const benhNhan = useSelector(state => state.HSBA);
    const { loading, updating } = benhNhan;
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(false);

    useEffect(() => {
        if (updating && Object.keys(mdSections["clinicalText"]).some(key => !!spellingError[key].changed)) {
            if (!spellingError.loading) {
                setTimeout(() => {
                    setOpenBackdrop(false);
                    setOpenSnackbar(true);
                    const firstKey = Object.keys(mdSections["clinicalText"]).find(key => !!spellingError[key].changed);
                    document.getElementById(firstKey).scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
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
        switch (mdSections["order"][sectionId]) {
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
        dispatch(HSBAActions.update());
    }

    return (
        <Container sx={{ mt: 3 }} maxWidth={false}>
            <Grid container spacing={5} sx={{ mb: 3 }}>
                <Grid item xs={9}>
                    <Paper sx={{ width: '100%', p: 3, pt: 2.5, height: 220 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={2}>
                                <Avatar src="/images/avatar_default.png" sx={{ width: 100, height: 100 }} />
                            </Grid>
                            <Grid item xs={10}>
                                <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mb: 0.5 }}>{benhNhan.hanhChinh.hoTen}</Typography>
                                <Grid container>
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
                                        <Typography fontWeight="bold">Ngày ra viện</Typography>
                                        <Typography>{benhNhan.chanDoanKhiRaVien.ngayRaVien ? format(new Date(benhNhan.chanDoanKhiRaVien.ngayRaVien), 'dd/MM/yyyy') : benhNhan.chanDoanKhiRaVien.ngayRaVien}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid container>
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
                                        <Typography fontWeight="bold">Bệnh điều trị</Typography>
                                        <Typography>Sốt siêu vi</Typography>
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item xs={6}>
                                        <Typography fontWeight="bold">Tình trạng hiện tại</Typography>
                                        <Typography>Giảm đau đầu, hạ sốt</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={3}>
                    <Paper sx={{ height: 220, width: '100%', p: 3, pt: 2.5 }}>
                        <Grid container >
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
                        <Divider color="#D9EFFE" sx={{ borderBottomWidth: 2, mb: 0.5 }}/>
                        <Grid container >
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
                        <Divider color="#D9EFFE" sx={{ borderBottomWidth: 2, mb: 0.5 }}/>
                        <Grid container >
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
                        <Divider color="#D9EFFE" sx={{ borderBottomWidth: 2, mb: 0.5 }}/>
                        <Grid container >
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
                        <Divider color="#D9EFFE" sx={{ borderBottomWidth: 2, mb: 0.5 }}/>
                        <Grid container >
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
                    </Paper>
                </Grid>
            </Grid>

            {appearSec.map((sectionId, id) => (
                <Paper 
                    key={id}
                    id={`section-${appearSec[id]}`}
                    sx={{ width: '100%', mt: 2, px: 3, pt: 1.5, pb: 1 }} 
                >  
                    <Grid container>
                        <Grid item xs={9}> 
                            <Typography fontWeight="bold" color={openSec[sectionId] ? "primary" : "inherit"} >
                                {mdSections["order"][sectionId]}
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

            {Object.values(hasChanged).some(value => value) ?
                <>  
                    <Box className="df aic jcfe" sx={{ mt: 3 }}>
                        {!updating ? 
                            <Button sx={{ width: 150 }} variant="primary-dark" onClick={handleUpdate}>
                                Cập nhật
                            </Button>
                        : null}
                    </Box>

                    <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={() => setOpenSnackbar(false)}>
                        <Alert elevation={6} variant="filled" severity="success">
                            <AlertTitle>Thông tin bệnh án đã được xử lý!</AlertTitle>
                            Vui lòng di chuyển đến các mục trong "<i>Danh sách mục - Xác nhận</i>" và xác nhận kết quả xử lý.
                        </Alert>
                    </Snackbar>

                    <Backdrop open={openBackdrop} sx={{ color: "white", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                        <CircularProgress color="inherit" />
                    </Backdrop>
                </>
            : null} 
        </Container>
    )
}

export default HSBA;
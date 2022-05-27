import React, { useContext, useEffect, useState } from "react";
import { Typography, Grid, Container, Paper, CircularProgress, Collapse, Box, Backdrop } from "@mui/material";
import mdSections from "../constants/md_sections.json";
import '../styles/index.css';
import UserContext from "../contexts/UserContext";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import HSBAThunk from "../redux/thunks/HSBA.thunk";
import { Button } from "./common";
import { FToDieuTri, FPhieuTDDiUngThuoc, FPhieuChamSoc, FPhieuTDChucNangSong, FPhieuTDTruyenDich, FPhieuCongKhaiThuoc } from "./forms";
import ToolBarSection from "./ToolBarSection";
import { GroupBenhAn, GroupTongKetBA } from "./groupSections";
import { BoxHanhChinh, BoxHoSo } from "./boxes";
import { sectionState } from "../redux/slices/spellingError.slice";
import { useSnackbar } from "notistack";
import { HSBAActions } from "../redux/slices/HSBA.slice";
import { HSBAProvider, initialErrors } from "../contexts/HSBAContext";

const checkErrors = (errors, section) => {
    return Object.keys(errors).filter(key => mdSections[section].includes(key)).every(key => 
        (typeof (errors[key]) !== "boolean" && Object.values(errors[key]).every(value => !value)) 
        || (typeof (errors[key]) === "boolean" && !errors[key]));
}

const findCheckErrors = (errors, key, section) => {
    return mdSections[section].includes(key) && ((typeof (errors[key]) !== "boolean" && Object.values(errors[key]).some(value => value)) 
    || (typeof (errors[key]) === "boolean" && errors[key]));
}

const HSBA = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pid } = useParams();
    const { open, appearSec, appearTime, setAppearTime, openSec, handleUpdate, 
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
    const benhNhan = useSelector(state => state.HSBA);
    const { loading, loadingError, updating, confirmUpdate, transfering } = benhNhan;
    const [errors, setErrors] = useState(initialErrors);
    const [hasClickedUpdate, setHasClickedUpdate] = useState(false);
    const benhAnChanged = mdSections["Bệnh án"].some(key => spellingError[key].changed);
    const tongKetBAChanged = mdSections["Tổng kết bệnh án"].some(key => spellingError[key].changed);

    useEffect(() => {
        if (loadingError === "Token has expired") {
            handleLogout();
        }
        // eslint-disable-next-line 
    }, [loadingError]);

    useEffect(() => {
        if (updating && Object.keys(sectionState).some(key => spellingError[key].changed)) {
            if (!spellingError.loading && !spellingError.loadingError) {
                if (autoUpdateWithProcessResult || Object.keys(sectionState).filter(key => mdSections["clinical"].includes(key)).filter((key) =>
                ((["Lý do vào viện", "Hỏi bệnh", "Khám bệnh", "Chẩn đoán khi ra viện"].includes(key) 
                && mdSections[key].some(subKey => spellingError[key][subKey].changed && spellingError[key][subKey].correction.length > 0))) 
                || (key === "Tờ điều trị" && Object.keys(spellingError[key]).some(subKey => !["changed", "loading"].includes(subKey) 
                && (spellingError[key][subKey]["Chẩn đoán"].correction.length > 0 || spellingError[key][subKey]["Diễn biến bệnh"].correction.length > 0))) 
                || (key === "Phiếu TD dị ứng thuốc" && Object.keys(spellingError[key]).some(subKey => !["changed", "loading"].includes(subKey) 
                && (spellingError[key][subKey]["Biểu hiện lâm sàng"].correction.length > 0 || spellingError[key][subKey]["Ghi chú"].correction.length > 0))) 
                || (key === "Phiếu chăm sóc" && Object.keys(spellingError[key]).some(subKey =>
                !["changed", "loading"].includes(subKey) && spellingError[key][subKey].some(subKeyValue => subKeyValue.correction.length > 0))) 
                || (key === "Phiếu công khai thuốc" && Object.keys(spellingError[key]).some(subKey => !["changed", "loading"].includes(subKey) 
                && spellingError[key][subKey].correction.length > 0)) 
                || (!["Lý do vào viện", "Hỏi bệnh", "Khám bệnh", "Chẩn đoán khi ra viện", "Tờ điều trị", "Phiếu chăm sóc", "Phiếu TD dị ứng thuốc", "Phiếu công khai thuốc"].includes(key) 
                && spellingError[key].changed && spellingError[key].correction.length > 0)).length === 0) {
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
                    var firstKey = Object.keys(sectionState).find(key => !!spellingError[key].changed);
                    if (mdSections["attached"].includes(firstKey)) {
                        firstKey = firstKey.concat("/SE");
                    }
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

    useEffect(() => {
        if (!loading && !loadingError) {
            if (role === "BS") {
                dispatch(HSBAActions.openClinicalAttachedSection({ section: "toDieuTri" }));
            } else if (role === "DD") {
                dispatch(HSBAActions.openClinicalAttachedSection({ section: "phieuChamSoc" }));
            }
        }
        // eslint-disable-next-line
    }, [loading, loadingError]);

    return (
        <HSBAProvider value={{ errors, setErrors, hasClickedUpdate, benhAnChanged, tongKetBAChanged }}>
            <Container sx={{ mt: 3 }} maxWidth={false}>
                {!loading && !loadingError ? 
                    <>
                        <Grid container spacing={5} sx={{ mb: 3 }}>
                            <Grid item xs={9}>
                                <BoxHoSo />
                            </Grid>
                            <Grid item xs={3}>
                                <Paper sx={{ height: '100%', width: '100%', px: 3, py: 2 }}>
                                    <Grid container direction="column" sx={{ height: '100%' }}>
                                        <Grid container item xs={2.4} alignItems="center" sx={{ borderBottom: (theme) => `2px solid ${theme.palette.primary.light}` }}>
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
                                        <Grid container item xs={2.4} alignItems="center" sx={{ borderBottom: (theme) => `2px solid ${theme.palette.primary.light}` }}>
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
                                        <Grid container item xs={2.4} alignItems="center" sx={{ borderBottom: (theme) => `2px solid ${theme.palette.primary.light}` }}>
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
                                        <Grid container item xs={2.4} alignItems="center" sx={{ borderBottom: (theme) => `2px solid ${theme.palette.primary.light}` }}>
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
                                id={mdSections["sortOrder"][role][sectionId]}
                                key={mdSections["sortOrder"][role][sectionId]}
                                sx={{ width: '100%', mt: 2, px: 3, pt: 1.5, pb: 1, scrollMarginTop: 72 }} 
                            >  
                                <Grid container>
                                    <Grid item xs={9}> 
                                        <Typography fontWeight="bold" color={openSec[sectionId] ? "primary" : "inherit"} >
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
                                    <Button 
                                        variant="primary-dark" 
                                        onClick={() => {
                                            setHasClickedUpdate(true);
                                            if ((!benhAnChanged || (benhAnChanged && checkErrors(errors, "Bệnh án")))
                                            && (!tongKetBAChanged || (tongKetBAChanged && checkErrors(errors, "Tổng kết bệnh án")))) {
                                                handleUpdate();
                                                setHasClickedUpdate(false);
                                            } else {
                                                enqueueSnackbar("Vui lòng nhập đầy đủ thông tin để cập nhật!", { variant: "error" });
                                                const firstKey = Object.keys(errors).find(key => (benhAnChanged && findCheckErrors(errors, key, "Bệnh án")) 
                                                || (tongKetBAChanged && findCheckErrors(errors, key, "Tổng kết bệnh án")));
                                                const sectionEle = document.getElementById(firstKey);
                                                if (sectionEle !== null) {
                                                    sectionEle.scrollIntoView({ behavior: "smooth" });
                                                }
                                            }
                                        }}
                                    >
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
                        <CircularProgress sx={{ mt: 3, mb: 1, color: (theme) => theme.palette.primary.main }} />
                        <Typography color="primary">Đang tải...</Typography>
                    </div>
                )}
            </Container>
        </HSBAProvider>
    )
}

export default HSBA;
import React, { useContext, useEffect, useState } from "react";
import { 
    Typography, Divider, Avatar, Grid, Container, Paper, CircularProgress, Box
} from "@mui/material";
import '../styles/index.css';
import { format } from "date-fns";
import UserContext from "../contexts/UserContext";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import HSBAThunk from "../redux/thunks/HSBA.thunk";
import { Tabs, TabPanel, Button } from "./common";
import FHanhChinh from "./forms/FHanhChinh";
import { TabBenhAn, TabTongKetBA } from "./tabs";
import { FToDieuTri, FPhieuTDDiUngThuoc, FPhieuChamSoc, FPhieuTDChucNangSong, FPhieuTDTruyenDich, FPhieuCongKhaiThuoc } from "./forms";
import { HSBAProvider } from "../contexts/HSBAContext";

const HSBA = () => {
    const dispatch = useDispatch();
    const { pid } = useParams();
    useEffect(() => {
        dispatch(HSBAThunk.getOneHSBAByPID(pid));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { today, tabs, selectedTab, setSelectedTab } = useContext(UserContext); 
    const benhNhan = useSelector(state => state.HSBA);
    const { loading } = benhNhan;
    const [tabHanhChinhState, setTabHanhChinhState] = useState({ saved: false, date: null });
    const [tabBenhAnState, setTabBenhAnState] = useState({
        lyDoVaoVien: { saved: false, date: null },
        hoiBenh: { saved: false, date: null },
        khamBenh: { saved: false, date: null },
        tomTatBenhAn: { saved: false, date: null },
        chanDoanBanDau: { saved: false, date: null }
    });
    const [tabTongKetBAState, setTabTongKetBAState] = useState({
        phuongPhapDieuTri: { saved: false, date: null },
        chanDoanKhiRaVien: { saved: false, date: null },
        tinhTrangRaVien: { saved: false, date: null },
        huongDieuTri: { saved: false, date: null }
    })
    const [tabsDinhKemState, setTabsDinhKemState] = useState({
        toDieuTri: { saved: false, date: null },
        phieuChamSoc: { saved: false, date: null },
        phieuTDTruyenDich: { saved: false, date: null },
        phieuTDChucNangSong: { saved: false, date: null },
        phieuTDDiUngThuoc: { saved: false, date: null },
        phieuCongKhaiThuoc: { saved: false, date: null }
    })

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
    
    const switchTab = (label) => {
        switch (label) {
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
        <HSBAProvider
            value={{
                tabHanhChinhState,
                setTabHanhChinhState,
                tabBenhAnState,
                setTabBenhAnState,
                tabTongKetBAState,
                setTabTongKetBAState,
                tabsDinhKemState,
                setTabsDinhKemState
            }}
        >
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

                <Tabs 
                    value={selectedTab}
                    setValue={setSelectedTab}
                    tabs={tabs}
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                    sx={{
                        '.MuiTabs-indicator': {
                            background: 'none'
                        }, 
                        '.MuiTab-root': {
                            minHeight: 36,
                            pb: 1,
                            bgcolor: '#E0E0E0',
                            mr: 0.5,
                            borderRadius: '4px 4px 0px 0px',
                            boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)"
                        },
                        '.Mui-selected': {
                            bgcolor: 'white',
                            cursor: 'default',  
                        },
                        minHeight: 36
                    }}
                />
                <TabPanel value={selectedTab} index={0} className="TabPanel">
                    <FHanhChinh />
                </TabPanel>
                <TabPanel value={selectedTab} index={1} className="TabPanel">
                    <TabBenhAn />
                </TabPanel>
                <TabPanel value={selectedTab} index={2} className="TabPanel">
                    <TabTongKetBA />
                </TabPanel>
                {tabs.slice(3).map((tab, id) => (
                    <TabPanel key={id} value={selectedTab} index={id + 3} className="TabPanel">
                        {switchTab(tab.label)}
                    </TabPanel>
                ))}
                
                {(Object.values(tabBenhAnState).some(section => !!section.saved) 
                    || Object.values(tabTongKetBAState).some(section => !!section.saved)
                    || Object.values(tabsDinhKemState).some(section => !!section.saved)
                    || !!tabHanhChinhState.saved
                ) &&
                    <Box sx={{ width: '100%', textAlign: 'right', mt: 3, pr: 3 }}>
                        <Button sx={{ width: 150 }} variant="primary-dark">
                            CẬP NHẬT
                        </Button>
                    </Box>
                }
            </Container>
        </HSBAProvider>
    )
}

export default HSBA;
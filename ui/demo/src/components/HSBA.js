import React, { useContext, useEffect } from "react";
import { 
    Typography, 
    Divider, 
    Avatar, 
    Grid, 
    Container,
    Paper,
    CircularProgress
} from "@mui/material";
// import { 
//     CloseFullscreen, 
//     OpenInFull, 
//     ArrowUpward, 
//     ArrowDownward, 
//     VisibilityOff
// } from "@mui/icons-material";
// import mdSections from "../constants/md_sections.json";
import '../styles/index.css';
// import { 
//     CLHanhChinh,
//     CLPhieuTDDiUngThuoc,
//     CLLyDoVaoVien,
//     CLHoiBenh,
//     CLKhamBenh,
//     CLChanDoanBanDau,
//     CLPhuongPhapDieuTri, 
//     CLChanDoanKhiRaVien,
//     CLTomTatBenhAn,
//     CLPhieuTDChucNangSong,
//     CLToDieuTri,
//     CLPhieuChamSoc
// } from "./collapse";
import { format } from "date-fns";
import UserContext from "../contexts/UserContext";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import HSBAThunk from "../redux/thunks/HSBA.thunk";
import Tabs from "./common/Tabs";
import TabPanel from "./common/TabPanel";
import FHanhChinh from "./forms/FHanhChinh";
import { TabBenhAn, TabTongKetBA } from "./tabs";
import { FToDieuTri, FPhieuTDDiUngThuoc, FPhieuChamSoc, FPhieuTDChucNangSong } from "./forms";

const HSBA = () => {
    const dispatch = useDispatch();
    const { pid } = useParams();
    useEffect(() => {
        dispatch(HSBAThunk.getOneHSBAByPID(pid));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { today, tabs, selectedTab, setSelectedTab } = useContext(UserContext); //appearSec, setAppearSec, openSec, setOpenSec
    const benhNhan = useSelector(state => state.HSBA);
    const { loading } = benhNhan;

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
    
    // function renderSwitch(param) {
    //     switch (mdSections["order"][param]) {
    //         case 'Hành chính':
    //             return <CLHanhChinh open={openSec[param]} id={param}/>;
    //         case 'Phiếu TD dị ứng thuốc':
    //             return <CLPhieuTDDiUngThuoc open={openSec[param]} id={param}/>;
    //         case 'Lý do vào viện': 
    //             return <CLLyDoVaoVien open={openSec[param]} id={param} />;
    //         case 'Hỏi bệnh': 
    //             return <CLHoiBenh open={openSec[param]} id={param} />;
    //         case 'Khám bệnh': 
    //             return <CLKhamBenh open={openSec[param]} id={param} />;
    //         case 'Chẩn đoán ban đầu': 
    //             return <CLChanDoanBanDau open={openSec[param]} id={param} />;
    //         case 'Phương pháp điều trị':
    //             return <CLPhuongPhapDieuTri open={openSec[param]} id={param} />;
    //         case 'Chẩn đoán khi ra viện': 
    //             return <CLChanDoanKhiRaVien open={openSec[param]} id={param} />;
    //         case 'Tóm tắt bệnh án': 
    //             return <CLTomTatBenhAn open={openSec[param]} id={param} />;
    //         case 'Phiếu TD chức năng sống':
    //             return <CLPhieuTDChucNangSong open={openSec[param]} id={param} />;
    //         case 'Tờ điều trị':
    //             return <CLToDieuTri open={openSec[param]} id={param} />;
    //         case 'Phiếu chăm sóc':
    //             return <CLPhieuChamSoc open={openSec[param]} id={param} />;
    //         default:
    //             return <></>;
    //     }
    // }

    const switchTab = (label) => {
        switch (label) {
            case "Tờ điều trị":
                return <FToDieuTri />
            case "Phiếu chăm sóc":
                return <FPhieuChamSoc />
            case "Phiếu TD truyền dịch": 
                return <></>
            case "Phiếu TD chức năng sống": 
                return <FPhieuTDChucNangSong />
            case "Phiếu TD dị ứng thuốc": 
                return <FPhieuTDDiUngThuoc />
            case "Phiếu công khai thuốc": 
                return <></>
            default: 
                return <></>
        }
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

            <Tabs 
                value={selectedTab}
                setValue={setSelectedTab}
                tabs={tabs}
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
            
            {/* {appearSec.map((sectionId, id) => (
                <Paper 
                    key={id}
                    id={`section-${appearSec[id]}`}
                    sx={{ width: '100%', mt: 2, px: 3, pt: 1.5, pb: 1 }} 
                >  
                    <Grid container>
                        <Grid item xs={9}> 
                            <Typography fontWeight="bold" color={openSec[sectionId] ? "primary" : "inherit"} >{mdSections["order"][sectionId]}</Typography>
                        </Grid>
                        <Grid item xs={3} align="right">
                            <Tooltip title="Di chuyển lên trên" placement="top">
                                <span>
                                    <ArrowUpward 
                                        color={id === 0 ? 'disabled' : 'secondary'}
                                        sx={{ cursor: 'pointer', mx: 0.75 }}
                                        fontSize="small"
                                        onClick={() => {
                                            var temp = [...appearSec];
                                            [temp[id], temp[id - 1]] = [temp[id - 1], temp[id]];
                                            setAppearSec(temp);
                                        }}
                                    />
                                </span>
                            </Tooltip>
                            <Tooltip title="Di chuyển xuống dưới" placement="top">
                                <span>
                                    <ArrowDownward 
                                        color={id === appearSec.length - 1 ? 'disabled' : 'secondary'}
                                        sx={{ cursor: 'pointer', mx: 0.75 }}
                                        fontSize="small"
                                        onClick={() => {
                                            var temp = [...appearSec];
                                            [temp[id], temp[id + 1]] = [temp[id + 1], temp[id]];
                                            setAppearSec(temp);
                                        }}
                                    />
                                </span>
                            </Tooltip>
                            <Tooltip title="Ẩn mục" placement="top">
                                <span>
                                    <VisibilityOff 
                                        color='secondary'
                                        sx={{ cursor: 'pointer', mx: 0.75 }}
                                        fontSize="small"
                                        onClick={() => {
                                            var temp = [...appearSec];
                                            temp.splice(id, 1);
                                            setAppearSec(temp);
                                        }}
                                    />
                                </span>
                            </Tooltip>
                            <Tooltip title="Thu gọn mục" placement="top">
                                <span>
                                    <CloseFullscreen 
                                        color={!openSec[sectionId] ? 'disabled' : 'secondary'}
                                        sx={{ cursor: 'pointer', mx: 0.75 }}
                                        fontSize="small"
                                        onClick={() => {
                                            var temp = [...openSec];
                                            temp[sectionId] = false;
                                            setOpenSec(temp);
                                        }}
                                    />
                                </span>
                            </Tooltip>
                            <Tooltip title="Mở rộng mục" placement="top">
                                <span>
                                    <OpenInFull 
                                        color={openSec[sectionId] ? 'disabled' : 'secondary'}
                                        fontSize="small"
                                        sx={{ cursor: 'pointer', mx: 0.75 }}
                                        onClick={() => {
                                            var temp = [...openSec];
                                            temp[sectionId] = true;
                                            setOpenSec(temp);
                                        }}
                                    />
                                </span>
                            </Tooltip>
                        </Grid>
                    </Grid>
                
                    {renderSwitch(sectionId)}
                </Paper>
            ))}   */}

            {/* <Grid item xs={11.5}>
                <Container>
                { mdSections.canEdit[user.role].some((element) => appearSec.indexOf(element) !== -1) &&
                    <Box sx={{ width: '100%', textAlign: 'right' }}>
                        <Button 
                            sx={{ 
                                width: 120,
                                height: 36,
                                background: '#009ABB', 
                                textTransform: 'none', 
                                fontWeight: 'bold',
                                color: 'white',
                                '&:hover': {
                                    background: '#009ABB', 
                                },
                                mt: 4,
                            
                            }} 
                            onClick={() => {}}
                        >
                            Cập nhật
                        </Button>
                    </Box>
                }
                </Container>
            </Grid> */}                              
        </Container>
    )
}

export default HSBA;
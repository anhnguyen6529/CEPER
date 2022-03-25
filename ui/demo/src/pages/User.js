import React, { useEffect, useState } from "react";
import { Box, CssBaseline, Typography, Divider, Breadcrumbs, Link, Container } from "@mui/material";
import { NavigateNext } from "@mui/icons-material";
import '../styles/index.css';
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { Drawer, ToolBar, Main, DrawerHeader, ScrollToTop } from "../components/common";
import { UserProvider } from "../contexts/UserContext";
import { DanhSachHSBA, HSBA } from "../components";
import mdSections from "../constants/md_sections.json";

const User = () => {
    const navigate = useNavigate();
    const { pid } = useParams();
    useEffect(() => {
        if (!localStorage.getItem('user')) {
            navigate('/login');
        }
    });

    const { user } = useSelector(state => state.auth);
    const selectedHSBA = useSelector(state => state.HSBA);

    const [open, setOpen] = useState(true);
    const [appearSec, setAppearSec] = useState(mdSections["appearFirst"][user.role].map((sec) => mdSections["order"].indexOf(sec)));
    const [appearTime, setAppearTime] = useState(mdSections["order"].reduce((prev, key) => ({ ...prev, [key]: null }), {}));
    const [openSec, setOpenSec] = useState(new Array(mdSections["order"].length).fill(true));  
    const [today, setToday] = useState(new Date());
    const [danhSachHSBATab, setDanhSachHSBATab] = useState({
        value: 0,
        hienTaiCols: [], hienTaiColsChecked: [],
        raVienCols: [], raVienColsChecked: []
    });

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const getUserContent = (role) => {
        switch (role) {
            case "BN":
                return <HSBA />;
            // eslint-disable-next-line
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
    
    return (
        <UserProvider value={{
            appearSec,
            setAppearSec,
            appearTime,
            setAppearTime,
            openSec, 
            setOpenSec,
            today,
            danhSachHSBATab,
            setDanhSachHSBATab
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
                    <Divider color="#007C92" sx={{ mt: 3.5 }} />

                    <Container maxWidth={false}>
                        {user.role === "BN"
                        ? 
                            <Breadcrumbs sx={{ my: 1, color: "#007C92" }} separator={<NavigateNext fontSize="small" />}>
                                    <Link underline="none" key="1" color="inherit" href="#">
                                        Bệnh nhân {selectedHSBA.hanhChinh.hoTen} (Mã: {selectedHSBA.pid})
                                    </Link>
                                    <Typography key="2">
                                        Hồ sơ bệnh án
                                    </Typography>
                            </Breadcrumbs>
                        :
                            <Breadcrumbs sx={{ my: 1.5, color: "#007C92" }} separator={<NavigateNext fontSize="small" />}>
                                <Link underline="none" key="1" color="inherit" href="/user/HSBA">
                                    Danh sách bệnh án
                                </Link>
                                {typeof(pid) !== 'undefined' && 
                                    <Typography key="2">
                                        Bệnh nhân {selectedHSBA.hanhChinh.hoTen} (Mã: {selectedHSBA.pid})
                                    </Typography>
                                }
                            </Breadcrumbs>
                        }
                    </Container>
                    <Divider color="#007C92"/>

                    {getUserContent(user.role)}

                    <Container maxWidth={false}>
                        {user.role === "BN"
                        ? 
                            <Breadcrumbs sx={{ mt: 3, mb: 3, color: "#007C92" }} separator={<NavigateNext fontSize="small" />}>
                                    <Link underline="none" key="1" color="inherit" href="#">
                                        Bệnh nhân {selectedHSBA.hanhChinh.hoTen} (Mã: {selectedHSBA.pid})
                                    </Link>
                                    <Typography key="2">
                                        Hồ sơ bệnh án
                                    </Typography>
                            </Breadcrumbs>
                        :
                            <Breadcrumbs sx={{ mt: 3, mb: 3, color: "#007C92" }} separator={<NavigateNext fontSize="small" />}>
                                <Link underline="none" key="1" color="inherit" href="/user/HSBA">
                                    Danh sách bệnh án
                                </Link>
                                {typeof(pid) !== 'undefined' && 
                                    <Typography key="2">
                                        Bệnh nhân {selectedHSBA.hanhChinh.hoTen} (Mã: {selectedHSBA.pid})
                                    </Typography>
                                }
                            </Breadcrumbs>
                        }
                    </Container>
                </Main>
            </Box>
        </UserProvider>
    )
}

export default User;
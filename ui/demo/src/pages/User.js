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
    const { user } = useSelector(state => state.auth);
    const selectedHSBA = useSelector(state => state.HSBA);
    
    useEffect(() => {
        if (!localStorage.getItem('user')) {
            navigate('/login');
        } else if (user.role === 'BN' && typeof(pid) === 'undefined') {
            navigate(`/user/HSBA/${user.id}`);
        }
        // eslint-disable-next-line
    }, []);

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
            open, 
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
                
                    {user.role !== "BN" ?
                        <>
                            <Divider color="#007C92" sx={{ mt: 3 }} />
                            <Container maxWidth={false}>
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
                            </Container>
                            <Divider color="#007C92" />
                        </>
                    : null}
                        
                    {getUserContent(user.role)}

                    {user.role !== "BN" ? 
                        <Container maxWidth={false}>
                            {(typeof(pid) !== 'undefined') ?
                                <Breadcrumbs sx={{ mt: 3, color: "#007C92" }} separator={<NavigateNext fontSize="small" />}>
                                    <Link underline="none" key="1" color="inherit" href="/user/HSBA">
                                        Danh sách bệnh án
                                    </Link>
                                    {typeof(pid) !== 'undefined' && 
                                        <Typography key="2">
                                            Bệnh nhân {selectedHSBA.hanhChinh.hoTen} (Mã: {selectedHSBA.pid})
                                        </Typography>
                                    }
                                </Breadcrumbs>
                            : null}
                        </Container>
                    : null}
                </Main>
            </Box>
        </UserProvider>
    )
}

export default User;
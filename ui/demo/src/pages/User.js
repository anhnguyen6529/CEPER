import React, { useEffect, useState } from "react";
import { Box, CssBaseline, Toolbar, Typography, Divider, Breadcrumbs, Link, Container } from "@mui/material";
import { NavigateNext } from "@mui/icons-material";
import '../styles/index.css';
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import Drawer from "../components/common/Drawer";
import ToolBar from "../components/common/ToolBar";
import Main from "../components/common/Main";
import { UserProvider } from "../contexts/UserContext";
import { DanhSachHSBA, HSBA } from "../components";

const User = () => {
    const navigate = useNavigate();
    const { pid } = useParams();
    useEffect(() => {
        if (!localStorage.getItem('user')) {
            navigate('/login');
        }
    });

    const [open, setOpen] = useState(true);
    const [appearSec, setAppearSec] = useState([]);
    const [openSec, setOpenSec] = useState([false, false, false, false, false, false, false, false, false, false, false, false]);
    const [today, setToday] = useState(new Date());

    const { user } = useSelector(state => state.auth);
    const selectedHSBA = useSelector(state => state.HSBA);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const getUserContent = (role) => {
        switch (role) {
            case "BN":
                return <HSBA />;
            case "BS":
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
            openSec, 
            setOpenSec,
            today
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
                    <Toolbar />
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
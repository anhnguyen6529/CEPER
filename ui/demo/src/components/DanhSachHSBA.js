import React, { useContext } from "react";
import { Box, Container } from "@mui/material";
import '../styles/index.css';
import { useSelector } from "react-redux";
import { TDanhSachHienTai, TDanhSachRaVien } from "./tables";
import { TabPanel, Tabs } from "./common";
import UserContext from "../contexts/UserContext";

const DanhSachHSBA = () => {

    const { danhSachHSBATab, setDanhSachHSBATab } = useContext(UserContext);
    const { hienTai, raVien }= useSelector(state => state.danhSachHSBA);

    const handleChange = (event, newValue) => {
        setDanhSachHSBATab({
            ...danhSachHSBATab,
            value: newValue
        });
    }

    return (
        <Container sx={{ mt: 4 }} maxWidth={false}>
            <Box sx={{ bgcolor: 'white', mt: 2, mb: 5 }}>
                <Tabs 
                    value={danhSachHSBATab.value}
                    onChange={handleChange}
                    sx={{ '.Mui-selected': { cursor: 'default' }}}
                    tabs={[
                        { label: "Hiện tại", showIcon: false, icon: null },
                        { label: "Ra viện", showIcon: false, icon: null }
                    ]}
                />
                <TabPanel value={danhSachHSBATab.value} index={0}>
                    <TDanhSachHienTai data={hienTai} />
                </TabPanel>
                <TabPanel value={danhSachHSBATab.value} index={1}>
                    <TDanhSachRaVien data={raVien} />
                </TabPanel>
            </Box>
        </Container>
    )
}

export default DanhSachHSBA;
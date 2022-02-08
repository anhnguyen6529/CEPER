import React, { useState } from "react";
import { Box, Container } from "@mui/material";
import '../styles/index.css';
import { useSelector } from "react-redux";
import TDanhSachHienTai from "./tables/TDanhSachHienTai";
import TDanhSachRaVien from "./tables/TDanhSachRaVien";
import { TabPanel, Tabs } from "./common";

const DanhSachHSBA = () => {

    const [tabValue, setTabValue] = useState(0);
    const { hienTai, raVien }= useSelector(state => state.danhSachHSBA);

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    }

    return (
        <Container sx={{ mt: 4 }} maxWidth={false}>
            <Box sx={{ bgcolor: 'white', mt: 2, mb: 5 }}>
                <Tabs 
                    value={tabValue}
                    onChange={handleChange}
                    sx={{ '.Mui-selected': { cursor: 'default' }}}
                    tabs={[
                        { label: "Hiện tại", showIcon: false, icon: null },
                        { label: "Ra viện", showIcon: false, icon: null }
                    ]}
                />
                <TabPanel value={tabValue} index={0}>
                    <TDanhSachHienTai data={hienTai} />
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <TDanhSachRaVien data={raVien} />
                </TabPanel>
            </Box>
        </Container>
    )
}

export default DanhSachHSBA;
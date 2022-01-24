import React, { useState } from "react";
import { Box, Tabs, Tab, Container } from "@mui/material";
import '../styles/index.css';
import { makeStyles } from '@mui/styles';
import { useSelector } from "react-redux";
import TDanhSachHienTai from "./tables/TDanhSachHienTai";
import TDanhSachRaVien from "./tables/TDanhSachRaVien";

const useStyles = makeStyles(() => ({
    tab: {
        textTransform: 'none',
        color: 'black'
    },
    card: {
        boxShadow: 'none',
        border: '1px solid #999',
        padding: 4
    }
}))

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
}

const DanhSachHSBA = () => {
    const classes = useStyles();

    const [tabValue, setTabValue] = useState(0);
    const { hienTai, raVien }= useSelector(state => state.danhSachHSBA);

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    }

    return (
        <Container sx={{ mt: 4 }} maxWidth={false}>
            <Box sx={{ bgcolor: 'white', mt: 2, mb: 5 }}>
                <Tabs value={tabValue} onChange={handleChange} sx={{ '.Mui-selected': { cursor: 'default' } }}>
                    <Tab label="Hiện tại" className={classes.tab}/>
                    <Tab label="Ra viện" className={classes.tab}/>
                </Tabs>
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
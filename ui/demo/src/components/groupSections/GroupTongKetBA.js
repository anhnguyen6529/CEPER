import { Box, Divider, Grid, Typography } from "@mui/material";
import { format } from "date-fns";
import React, { useContext } from "react";
import HSBAContext from "../../contexts/HSBAContext";
import "../../styles/index.css";
import Accordion, { AccordionDetails, AccordionSummary } from "../common/Accordion";
import { FChanDoanKhiRaVien, FHuongDieuTri, FPhuongPhapDieuTri, FTinhTrangRaVien } from "../forms";
import mdSections from "../../constants/md_sections.json";

const GroupTongKetBA = () => {
    const { saveSec } = useContext(HSBAContext);
    const tongKetBAId = mdSections["order"].indexOf("Tổng kết bệnh án");

    const renderSwitch = (sectionId) => {
        switch (mdSections["Tổng kết bệnh án"][sectionId]) {
            case "Phương pháp điều trị": 
                return <FPhuongPhapDieuTri />
            case "Chẩn đoán khi ra viện":
                return <FChanDoanKhiRaVien />
            case "Tình trạng người bệnh ra viện":
                return <FTinhTrangRaVien />
            case "Hướng điều trị và các chế độ tiếp theo":
                return <FHuongDieuTri />
            default: 
                return <></>
        }
    }

    return (
        <>
            {mdSections["Tổng kết bệnh án"].map((section, id) => (
                <Accordion key={`accordionSec${id}`}>
                    <AccordionSummary>
                        <Grid container>
                            <Grid item xs={9}>
                                <Typography>{section}</Typography>
                            </Grid>
                            <Grid item xs={3} align="right">
                                {!!saveSec[tongKetBAId][id] && 
                                    <Typography color="primary">
                                        <i>Đã chỉnh sửa: {format(new Date(saveSec[tongKetBAId][id]), 'dd/MM/yyyy HH:mm:ss')}</i>
                                    </Typography>
                                }
                            </Grid>
                        </Grid>
                    </AccordionSummary>
                    <AccordionDetails>
                        {renderSwitch(id)}
                    </AccordionDetails>
                </Accordion>
            ))}
            
            <Divider sx={{ my: 2}}/>
            <Box>
                <Typography>Ngày 11 tháng 06 năm 2021</Typography>
                <Typography fontWeight="bold">
                    Bác sĩ điều trị:{' '}
                    <Typography component="span">Trần Quốc A</Typography>
                </Typography>
            </Box>
        </>
    )
}

export default GroupTongKetBA;
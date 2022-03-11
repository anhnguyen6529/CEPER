import { Box, Divider, Grid, Typography } from "@mui/material";
import { format } from "date-fns";
import React, { useContext } from "react";
import HSBAContext from "../../contexts/HSBAContext";
import "../../styles/index.css";
import Accordion, { AccordionDetails, AccordionSummary } from "../common/Accordion";
import { FChanDoanKhiRaVien, FHuongDieuTri, FPhuongPhapDieuTri, FTinhTrangRaVien } from "../forms";
import mdSections from "../../constants/md_sections.json";
import { useSelector } from "react-redux";
import { BoxChanDoanKhiRaVien } from "../boxes";

const GroupTongKetBA = () => {
    const { tongKetBenhAn, phuongPhapDieuTri, tinhTrangRaVien, huongDieuTri } = useSelector(state => state.HSBA);
    const { role } = useSelector(state => state.auth.user);
    const { saveSec } = useContext(HSBAContext);
    const tongKetBAId = mdSections["order"].indexOf("Tổng kết bệnh án");

    const renderSwitch = (sectionId) => {
        switch (mdSections["Tổng kết bệnh án"][sectionId]) {
            case "Phương pháp điều trị": 
                return !tongKetBenhAn.thoiGian && role !== "BN" ? <FPhuongPhapDieuTri /> : <Typography>{!!phuongPhapDieuTri ? phuongPhapDieuTri : <i>(trống)</i>}</Typography>
            case "Chẩn đoán khi ra viện":
                return !tongKetBenhAn.thoiGian && role !== "BN" ? <FChanDoanKhiRaVien /> : <BoxChanDoanKhiRaVien />
            case "Tình trạng người bệnh ra viện":
                return !tongKetBenhAn.thoiGian && role !== "BN" ? <FTinhTrangRaVien /> : <Typography>{!!tinhTrangRaVien ? tinhTrangRaVien : <i>(trống)</i>}</Typography>
            case "Hướng điều trị và các chế độ tiếp theo":
                return !tongKetBenhAn.thoiGian && role !== "BN" ? <FHuongDieuTri /> : <Typography>{!!huongDieuTri ? huongDieuTri : <i>(trống)</i>}</Typography>
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
            
            {!!tongKetBenhAn.thoiGian ? 
                <>
                    <Divider sx={{ my: 2 }} />
                    <Box>
                        <Typography fontWeight="bold">
                            Thời gian tổng kết bệnh án:{' '}
                            <Typography component="span">{format(new Date(tongKetBenhAn.thoiGian), "dd/MM/yyyy HH:mm")}</Typography>
                        </Typography>
                        <Typography fontWeight="bold">
                            Bác sĩ điều trị:{' '}
                            <Typography component="span">{tongKetBenhAn.bacSiDieuTri}</Typography>
                        </Typography>
                    </Box>
                </>
            : null}
        </>
    )
}

export default GroupTongKetBA;
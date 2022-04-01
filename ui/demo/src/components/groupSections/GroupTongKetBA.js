import React from "react";
import { Box, Divider, Typography } from "@mui/material";
import { format } from "date-fns";
import "../../styles/index.css";
import Accordion, { AccordionDetails, AccordionSummary } from "../common/Accordion";
import { FChanDoanKhiRaVien, FHuongDieuTri, FPhuongPhapDieuTri, FTinhTrangRaVien } from "../forms";
import mdSections from "../../constants/md_sections.json";
import { useSelector } from "react-redux";
import { BoxChanDoanKhiRaVien } from "../boxes";

const GroupTongKetBA = () => {
    const { tongKetBenhAn, phuongPhapDieuTri, tinhTrangRaVien, huongDieuTri } = useSelector(state => state.HSBA);
    const { role, position } = useSelector(state => state.auth.user);

    const renderSwitch = (sectionId) => {
        switch (mdSections["Tổng kết bệnh án"][sectionId]) {
            case "Phương pháp điều trị": 
                return !tongKetBenhAn.thoiGian && role === "BS" && position === "Bác sĩ điều trị" 
                    ? <FPhuongPhapDieuTri />
                    : <Typography>{!!phuongPhapDieuTri ? phuongPhapDieuTri : <i>(trống)</i>}</Typography>
            case "Chẩn đoán khi ra viện":
                return !tongKetBenhAn.thoiGian && role === "BS" && position === "Bác sĩ điều trị" ? <FChanDoanKhiRaVien /> : <BoxChanDoanKhiRaVien />
            case "Tình trạng người bệnh ra viện":
                return !tongKetBenhAn.thoiGian && role === "BS" && position === "Bác sĩ điều trị" 
                    ? <FTinhTrangRaVien /> 
                    : <Typography>{!!tinhTrangRaVien ? tinhTrangRaVien : <i>(trống)</i>}</Typography>
            case "Hướng điều trị và các chế độ tiếp theo":
                return !tongKetBenhAn.thoiGian && role === "BS" && position === "Bác sĩ điều trị" 
                    ? <FHuongDieuTri /> 
                    : <Typography>{!!huongDieuTri ? huongDieuTri : <i>(trống)</i>}</Typography>
            default: 
                return <></>
        }
    }

    return (
        <>
            {mdSections["Tổng kết bệnh án"].map((section, id) => (
                <Accordion key={`accordionSec${id}`} id={section} sx={{ scrollMarginTop: 72 }}>
                    <AccordionSummary>
                        <Typography>{section}</Typography>
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
                            <Typography component="span">
                                {`${tongKetBenhAn.bacSiDieuTri.id} - ${tongKetBenhAn.bacSiDieuTri.name}`}
                            </Typography>
                        </Typography>
                    </Box>
                </>
            : null}
        </>
    )
}

export default GroupTongKetBA;
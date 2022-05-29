import React, { useContext } from "react";
import { Box, Divider, Grid, Typography } from "@mui/material";
import { format } from "date-fns";
import "../../styles/index.css";
import Accordion, { AccordionDetails, AccordionSummary } from "../common/Accordion";
import { FChanDoanKhiRaVien, FHuongDieuTri, FPhuongPhapDieuTri, FTinhTrangRaVien } from "../forms";
import mdSections from "../../constants/md_sections.json";
import { useSelector } from "react-redux";
import { BoxChanDoanKhiRaVien } from "../boxes";
import HSBAContext from "../../contexts/HSBAContext";

const GroupTongKetBA = () => {
    const { tongKetBenhAn, phuongPhapDieuTri, tinhTrangRaVien, huongDieuTri, trangThai } = useSelector(state => state.HSBA);
    const { role } = useSelector(state => state.auth.user);
    const { errors, hasClickedUpdate, tongKetBAChanged } = useContext(HSBAContext);

    const renderSwitch = (sectionId) => {
        switch (mdSections["Tổng kết bệnh án"][sectionId]) {
            case "Phương pháp điều trị": 
                return !tongKetBenhAn.thoiGian && role === "BS" && trangThai === "Đang điều trị"
                    ? <FPhuongPhapDieuTri />
                    : <Typography>{!!phuongPhapDieuTri ? phuongPhapDieuTri : <i>(trống)</i>}</Typography>
            case "Chẩn đoán khi ra viện":
                return !tongKetBenhAn.thoiGian && role === "BS" && trangThai === "Đang điều trị" ? <FChanDoanKhiRaVien /> : <BoxChanDoanKhiRaVien />
            case "Tình trạng người bệnh ra viện":
                return !tongKetBenhAn.thoiGian && role === "BS" && trangThai === "Đang điều trị" 
                    ? <FTinhTrangRaVien /> 
                    : <Typography>{!!tinhTrangRaVien ? tinhTrangRaVien : <i>(trống)</i>}</Typography>
            case "Hướng điều trị và các chế độ tiếp theo":
                return !tongKetBenhAn.thoiGian && role === "BS" && trangThai === "Đang điều trị"
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
                        <Grid container>
                            <Grid item xs={9}>
                                <Typography>{section}</Typography>
                            </Grid>
                            <Grid item xs={3} align="right">
                                {role === "BS" ?
                                    <Typography color="error" fontStyle="italic" fontWeight="bold">
                                        {hasClickedUpdate && tongKetBAChanged
                                        && ((section === "Chẩn đoán khi ra viện" && Object.values(errors[section]).some(value => value)) 
                                        || ((section === "Phương pháp điều trị" || section === "Tình trạng người bệnh ra viện") && errors[section]))
                                            ? "Vui lòng nhập đầy đủ thông tin!" : ""
                                        }
                                    </Typography>
                                : null}
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
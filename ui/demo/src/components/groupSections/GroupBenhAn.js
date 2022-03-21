import React from "react";
import { useSelector } from "react-redux";
import { Box, Divider, Typography } from "@mui/material";
import { format } from "date-fns";
import "../../styles/index.css";
import Accordion, { AccordionDetails, AccordionSummary } from "../common/Accordion";
import { FChanDoanBanDau, FHoiBenh, FKhamBenh, FLyDoVaoVien, FTomTatBenhAn } from "../forms";
import mdSections from "../../constants/md_sections.json";
import { BoxLyDoVaoVien, BoxHoiBenh, BoxKhamBenh } from "../boxes";

const GroupBenhAn = () => {
    const { benhAn, tomTatBenhAn, chanDoanBanDau } = useSelector(state => state.HSBA);
    const { role } = useSelector(state => state.auth.user);

    const renderSwitch = (sectionId) => {
        switch (mdSections["Bệnh án"][sectionId]) {
            case "Lý do vào viện": 
                return !benhAn.thoiGian && role === "BS" ? <FLyDoVaoVien /> : <BoxLyDoVaoVien />
            case "Hỏi bệnh":
                return !benhAn.thoiGian && role === "BS" ? <FHoiBenh /> : <BoxHoiBenh />
            case "Khám bệnh":
                return !benhAn.thoiGian && role === "BS" ? <FKhamBenh /> : <BoxKhamBenh />
            case "Tóm tắt bệnh án":
                return !benhAn.thoiGian && role === "BS" ? <FTomTatBenhAn /> : <Typography>{!!tomTatBenhAn ? tomTatBenhAn : <i>(trống)</i>}</Typography>
            case "Chẩn đoán ban đầu":
                return !benhAn.thoiGian && role === "BS" ? <FChanDoanBanDau /> : <Typography>{!!chanDoanBanDau ? chanDoanBanDau : <i>(trống)</i>}</Typography>
            default: 
                return <></>
        }
    }

    return (
        <>
            {mdSections["Bệnh án"].map((section, id) => (
                <Accordion key={`accordionSec${id}`} id={section} sx={{ scrollMarginTop: 72 }}>
                    <AccordionSummary>
                        <Typography>{section}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {renderSwitch(id)}
                    </AccordionDetails>
                </Accordion>
            ))}
            
            {!!benhAn.thoiGian ? 
                <>
                    <Divider sx={{ my: 2 }} />
                    <Box>
                        <Typography fontWeight="bold">
                            Thời gian làm bệnh án:{' '}
                            <Typography component="span">{format(new Date(benhAn.thoiGian), "dd/MM/yyyy HH:mm")}</Typography>
                        </Typography>
                        <Typography fontWeight="bold">
                            Bác sĩ làm bệnh án:{' '}
                            <Typography component="span">{benhAn.bacSiLamBenhAn}</Typography>
                        </Typography>
                    </Box>
                </>
            : null}
        </>
    )
}

export default GroupBenhAn;
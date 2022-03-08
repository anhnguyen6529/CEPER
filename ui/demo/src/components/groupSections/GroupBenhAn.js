import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { Box, Divider, Grid, Typography } from "@mui/material";
import { format } from "date-fns";
import HSBAContext from "../../contexts/HSBAContext";
import "../../styles/index.css";
import Accordion, { AccordionDetails, AccordionSummary } from "../common/Accordion";
import { FChanDoanBanDau, FHoiBenh, FKhamBenh, FLyDoVaoVien, FTomTatBenhAn } from "../forms";
import mdSections from "../../constants/md_sections.json";
import { BoxLyDoVaoVien, BoxHoiBenh, BoxKhamBenh } from "../boxes";

const GroupBenhAn = () => {
    const { benhAn, tomTatBenhAn, chanDoanBanDau } = useSelector(state => state.HSBA);
    const { saveSec } = useContext(HSBAContext);
    const benhAnId = mdSections["order"].indexOf("Bệnh án");

    const renderSwitch = (sectionId) => {
        switch (mdSections["Bệnh án"][sectionId]) {
            case "Lý do vào viện": 
                return !benhAn.thoiGian ? <FLyDoVaoVien /> : <BoxLyDoVaoVien />
            case "Hỏi bệnh":
                return !benhAn.thoiGian ? <FHoiBenh /> : <BoxHoiBenh />
            case "Khám bệnh":
                return !benhAn.thoiGian ? <FKhamBenh /> : <BoxKhamBenh />
            case "Tóm tắt bệnh án":
                return !benhAn.thoiGian ? <FTomTatBenhAn /> : <Typography>{!!tomTatBenhAn ? tomTatBenhAn : <i>(trống)</i>}</Typography>
            case "Chẩn đoán ban đầu":
                return !benhAn.thoiGian ? <FChanDoanBanDau /> : <Typography>{!!chanDoanBanDau ? chanDoanBanDau : <i>(trống)</i>}</Typography>
            default: 
                return <></>
        }
    }

    return (
        <>
            {mdSections["Bệnh án"].map((section, id) => (
                <Accordion key={`accordionSec${id}`}>
                    <AccordionSummary>
                        <Grid container>
                            <Grid item xs={9}>
                                <Typography>{section}</Typography>
                            </Grid>
                            <Grid item xs={3} align="right">
                                {!!saveSec[benhAnId][id] && 
                                    <Typography color="primary">
                                        <i>Đã chỉnh sửa: {format(new Date(saveSec[benhAnId][id]), 'dd/MM/yyyy HH:mm:ss')}</i>
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
                            <Typography component="span">Trần Quốc A</Typography>
                        </Typography>
                    </Box>
                </>
            : null}
        </>
    )
}

export default GroupBenhAn;
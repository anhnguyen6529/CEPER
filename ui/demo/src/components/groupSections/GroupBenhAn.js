import { Box, Divider, Grid, Typography } from "@mui/material";
import { format } from "date-fns";
import React, { useContext } from "react";
import HSBAContext from "../../contexts/HSBAContext";
import "../../styles/index.css";
import Accordion, { AccordionDetails, AccordionSummary } from "../common/Accordion";
import { FChanDoanBanDau, FHoiBenh, FKhamBenh, FLyDoVaoVien, FTomTatBenhAn } from "../forms";
import mdSections from "../../constants/md_sections.json";

const GroupBenhAn = () => {
    const { saveSec } = useContext(HSBAContext);
    const benhAnId = mdSections["order"].indexOf("Bệnh án");

    const renderSwitch = (sectionId) => {
        switch (mdSections["Bệnh án"][sectionId]) {
            case "Lý do vào viện": 
                return <FLyDoVaoVien />
            case "Hỏi bệnh":
                return <FHoiBenh />
            case "Khám bệnh":
                return <FKhamBenh />
            case "Tóm tắt bệnh án":
                return <FTomTatBenhAn />
            case "Chẩn đoán ban đầu":
                return <FChanDoanBanDau />
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
                
                {/* <Accordion>
                    <AccordionSummary>
                        <Grid container>
                            <Grid item xs={9}>
                                <Typography>Hỏi bệnh</Typography>
                            </Grid>
                            <Grid item xs={3} align="right">
                                {tabBenhAnState.hoiBenh.saved && 
                                    <Typography color="primary">
                                        <i>Đã chỉnh sửa: {format(new Date(tabBenhAnState.hoiBenh.date), 'dd/MM/yyyy HH:mm:ss')}</i>
                                    </Typography>
                                }
                            </Grid>
                        </Grid>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FHoiBenh />
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary>
                        <Grid container>
                            <Grid item xs={9}>
                                <Typography>Khám bệnh</Typography>
                            </Grid>
                            <Grid item xs={3} align="right">
                                {tabBenhAnState.khamBenh.saved && 
                                    <Typography color="primary">
                                        <i>Đã chỉnh sửa: {format(new Date(tabBenhAnState.khamBenh.date), 'dd/MM/yyyy HH:mm:ss')}</i>
                                    </Typography>
                                }
                            </Grid>
                        </Grid>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FKhamBenh />
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary>
                        <Grid container>
                            <Grid item xs={9}>
                                <Typography>Tóm tắt bệnh án</Typography>
                            </Grid>
                            <Grid item xs={3} align="right">
                                {tabBenhAnState.tomTatBenhAn.saved && 
                                    <Typography color="primary">
                                        <i>Đã chỉnh sửa: {format(new Date(tabBenhAnState.tomTatBenhAn.date), 'dd/MM/yyyy HH:mm:ss')}</i>
                                    </Typography>
                                }
                            </Grid>
                        </Grid>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FTomTatBenhAn />
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary>
                        <Grid container>
                            <Grid item xs={9}>
                                <Typography>Chẩn đoán ban đầu</Typography>
                            </Grid>
                            <Grid item xs={3} align="right">
                                {tabBenhAnState.chanDoanBanDau.saved && 
                                    <Typography color="primary">
                                        <i>Đã chỉnh sửa: {format(new Date(tabBenhAnState.chanDoanBanDau.date), 'dd/MM/yyyy HH:mm:ss')}</i>
                                    </Typography>
                                }
                            </Grid>
                        </Grid>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FChanDoanBanDau />
                    </AccordionDetails>
                </Accordion> */}
            
            <Divider sx={{ my: 2}}/>
            <Box>
                <Typography>Ngày 08 tháng 06 năm 2021</Typography>
                <Typography fontWeight="bold">
                    Bác sĩ làm bệnh án:{' '}
                    <Typography component="span">Trần Quốc A</Typography>
                </Typography>
            </Box>
        </>
    )
}

export default GroupBenhAn;
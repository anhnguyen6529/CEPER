import { Box, Divider, Grid, Typography } from "@mui/material";
import { format } from "date-fns";
import React, { useContext } from "react";
import HSBAContext from "../../contexts/HSBAContext";
import "../../styles/index.css";
import Accordion, { AccordionDetails, AccordionSummary } from "../common/Accordion";
import { FChanDoanBanDau, FHoiBenh, FKhamBenh, FLyDoVaoVien, FTomTatBenhAn } from "../forms";

const TabBenhAn = () => {
    const { tabBenhAnState } = useContext(HSBAContext);

    return (
        <>
            <div>
                <Accordion>
                    <AccordionSummary>
                        <Grid container>
                            <Grid item xs={9}>
                                <Typography>Lý do vào viện</Typography>
                            </Grid>
                            <Grid item xs={3} align="right">
                                {tabBenhAnState.lyDoVaoVien.saved && 
                                    <Typography color="primary">
                                        <i>Đã chỉnh sửa: {format(new Date(tabBenhAnState.lyDoVaoVien.date), 'dd/MM/yyyy HH:mm:ss')}</i>
                                    </Typography>
                                }
                            </Grid>
                        </Grid>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FLyDoVaoVien />
                    </AccordionDetails>
                </Accordion>
                <Accordion>
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
                </Accordion>
            </div>
            
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

export default TabBenhAn;
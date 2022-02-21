import { Typography, Grid, Divider, Box } from "@mui/material";
import React, { useContext } from "react";
import HSBAContext from "../../contexts/HSBAContext";
import "../../styles/index.css";
import Accordion, { AccordionDetails, AccordionSummary } from "../common/Accordion";
import { FChanDoanKhiRaVien, FHuongDieuTri, FPhuongPhapDieuTri, FTinhTrangRaVien } from "../forms";
import { format } from "date-fns";

const TabTongKetBA = () => {
    const { tabTongKetBAState } = useContext(HSBAContext);

    return (
        <>
            <div>
                <Accordion>
                    <AccordionSummary>
                        <Grid container>
                            <Grid item xs={9}>
                                <Typography>Phương pháp điều trị</Typography>
                            </Grid>
                            <Grid item xs={3} align="right">
                                {tabTongKetBAState.phuongPhapDieuTri.saved && 
                                    <Typography color="primary">
                                        <i>Đã chỉnh sửa: {format(new Date(tabTongKetBAState.phuongPhapDieuTri.date), 'dd/MM/yyyy HH:mm:ss')}</i>
                                    </Typography>
                                }
                            </Grid>
                        </Grid>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FPhuongPhapDieuTri />
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary>
                        <Grid container>
                            <Grid item xs={9}>
                                <Typography>Chẩn đoán khi ra viện</Typography>
                            </Grid>
                            <Grid item xs={3} align="right">
                                {tabTongKetBAState.chanDoanKhiRaVien.saved && 
                                    <Typography color="primary">
                                        <i>Đã chỉnh sửa: {format(new Date(tabTongKetBAState.chanDoanKhiRaVien.date), 'dd/MM/yyyy HH:mm:ss')}</i>
                                    </Typography>
                                }
                            </Grid>
                        </Grid>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FChanDoanKhiRaVien />
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary>
                        <Grid container>
                            <Grid item xs={9}>
                                <Typography>Tình trạng người bệnh ra viện</Typography>
                            </Grid>
                            <Grid item xs={3} align="right">
                                {tabTongKetBAState.tinhTrangRaVien.saved && 
                                    <Typography color="primary">
                                        <i>Đã chỉnh sửa: {format(new Date(tabTongKetBAState.tinhTrangRaVien.date), 'dd/MM/yyyy HH:mm:ss')}</i>
                                    </Typography>
                                }
                            </Grid>
                        </Grid>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FTinhTrangRaVien />
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary>
                        <Grid container>
                            <Grid item xs={9}>
                                <Typography>Hướng điều trị và các chế độ tiếp theo</Typography>
                            </Grid>
                            <Grid item xs={3} align="right">
                                {tabTongKetBAState.huongDieuTri.saved && 
                                    <Typography color="primary">
                                        <i>Đã chỉnh sửa: {format(new Date(tabTongKetBAState.huongDieuTri.date), 'dd/MM/yyyy HH:mm:ss')}</i>
                                    </Typography>
                                }
                            </Grid>
                        </Grid>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FHuongDieuTri />
                    </AccordionDetails>
                </Accordion>
            </div>

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

export default TabTongKetBA;
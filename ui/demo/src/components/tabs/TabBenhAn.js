import { Typography } from "@mui/material";
import React from "react";
import "../../styles/index.css";
import Accordion, { AccordionDetails, AccordionSummary } from "../common/Accordion";
import { FChanDoanBanDau, FHoiBenh, FKhamBenh, FLyDoVaoVien, FTomTatBenhAn } from "../forms";

const TabBenhAn = () => {
    return (
        <div>
            <Accordion>
                <AccordionSummary>
                    <Typography>Lý do vào viện</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FLyDoVaoVien />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary>
                    <Typography>Hỏi bệnh</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FHoiBenh />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary>
                    <Typography>Khám bệnh</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FKhamBenh />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary>
                    <Typography>Tóm tắt bệnh án</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FTomTatBenhAn />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary>
                    <Typography>Chẩn đoán ban đầu</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FChanDoanBanDau />
                </AccordionDetails>
            </Accordion>
        </div>
    )
}

export default TabBenhAn;
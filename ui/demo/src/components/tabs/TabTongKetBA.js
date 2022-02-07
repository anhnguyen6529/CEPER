import { Typography } from "@mui/material";
import React from "react";
import "../../styles/index.css";
import Accordion, { AccordionDetails, AccordionSummary } from "../common/Accordion";
import { FChanDoanKhiRaVien, FHuongDieuTri, FPhuongPhapDieuTri, FTinhTrangRaVien } from "../forms";

const TabTongKetBA = () => {
    return (
        <div>
            <Accordion>
                <AccordionSummary>
                    <Typography>Phương pháp điều trị</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FPhuongPhapDieuTri />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary>
                    <Typography>Chẩn đoán khi ra viện</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FChanDoanKhiRaVien />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary>
                    <Typography>Tình trạng người bệnh ra viện</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FTinhTrangRaVien />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary>
                    <Typography>Hướng điều trị và các chế độ tiếp theo</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FHuongDieuTri />
                </AccordionDetails>
            </Accordion>
        </div>
    )
}

export default TabTongKetBA;
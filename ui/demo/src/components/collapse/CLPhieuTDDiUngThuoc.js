import { Collapse, Typography, Box, Button } from "@mui/material";
import { Edit } from "@mui/icons-material";
import React, { useState } from "react";
import { FPhieuTDDiUngThuoc } from "../forms";
import { useSelector } from "react-redux";
import mdSections from "../../constants/md_sections.json";

const CLPhieuTDDiUngThuoc = ({ open, id }) => {
    const [edit, setEdit] = useState(false);
    const content = useSelector((state) => state.HSBA.phieuTDDiUngThuoc);
    const { role } = useSelector(state => state.auth.user);

    return (
        <Collapse in={open} timeout="auto" unmountOnExit sx={{ mb: 3 }}>
            {!edit ? 
            <>
                <Typography fontWeight="bold" sx={{ mt: 2 }}>Dị ứng với các thuốc và các dị nguyên khác</Typography>
                <Typography>{!content.thuocDiUng ? <i>(trống)</i> : content.thuocDiUng}</Typography>
                
                <Typography fontWeight="bold" sx={{ mt: 1 }}>Kiểu dị ứng</Typography>
                <Typography>{!content.kieuDiUng ? <i>(trống)</i> : content.kieuDiUng}</Typography>

                <Typography fontWeight="bold" sx={{ mt: 1 }}>Bệnh kèm theo</Typography>
                <Typography>{!content.benhKemTheo ? <i>(trống)</i> : content.benhKemTheo}</Typography>

                { mdSections.canEdit[role].includes(id) && 
                <Box sx={{ width: '100%', textAlign: 'right', mt: 3 }}>
                    <Button 
                        sx={{ 
                            width: 150,
                            height: 36,
                            background: '#48B0F7', 
                            textTransform: 'none', 
                            fontWeight: 'bold',
                            color: 'white',
                            '&:hover': {
                                background: '#48B0F7', 
                            }
                        }} 
                        startIcon={<Edit fontSize="small"/>}
                        onClick={() => setEdit(!edit)}
                    >
                        Chỉnh sửa
                    </Button>
                </Box>
                }
            </>
            : <FPhieuTDDiUngThuoc setEdit={setEdit} />
            }
        </Collapse>
    )
}

export default CLPhieuTDDiUngThuoc;
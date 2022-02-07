import { Box, Typography, TextField } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
// import { Save } from "@mui/icons-material";
// import { HSBAActions } from "../../redux/slices/HSBA.slice";

const FPhieuTDDiUngThuoc = () => {
    const { phieuTDDiUngThuoc } = useSelector((state) => state.HSBA);
    // const dispatch = useDispatch();
    const [thuocDiUng, setThuocDiUng] = useState(phieuTDDiUngThuoc.thuocDiUng);
    const [kieuDiUng, setKieuDiUng] = useState(phieuTDDiUngThuoc.kieuDiUng);
    const [benhKemTheo, setBenhKemTheo] = useState(phieuTDDiUngThuoc.benhKemTheo);
    
    // const handleSave = () => {
    //     dispatch(HSBAActions.updateBacSiSection({
    //         section: 'phieuTDDiUngThuoc',
    //         data: {
    //             thuocDiUng,
    //             kieuDiUng,
    //             benhKemTheo
    //         }
    //     }))
    //     setEdit(false);
    // }

    return (
        <Box component="form" noValidate>
            <Typography fontWeight="bold">Dị ứng với các thuốc và các dị nguyên khác</Typography>
            <TextField 
                margin="normal"
                multiline
                fullWidth
                value={thuocDiUng}
                onChange={(event) => setThuocDiUng(event.target.value)}
            />
            
            <Typography fontWeight="bold" sx={{ mt: 1 }}>Kiểu dị ứng</Typography>
            <TextField 
                margin="normal"
                multiline
                fullWidth
                value={kieuDiUng}
                onChange={(event) => setKieuDiUng(event.target.value)}
            />

            <Typography fontWeight="bold" sx={{ mt: 1 }}>Bệnh kèm theo</Typography>
            <TextField 
                margin="normal"
                multiline
                fullWidth
                value={benhKemTheo}
                onChange={(event) => setBenhKemTheo(event.target.value)}
            />


            {/* <Box sx={{ width: '100%', textAlign: 'right', mt: 3 }}>
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
                    startIcon={<Save fontSize="small" />}
                    onClick={handleSave}
                >
                    Lưu
                </Button>
            </Box> */}
        </Box>
    )
}

export default FPhieuTDDiUngThuoc;

import { Box, Typography, TextField, Divider } from "@mui/material";
import React, { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Autorenew, Save } from "@mui/icons-material";
import { HSBAActions } from "../../redux/slices/HSBA.slice";
import { Button } from "../common";
import HSBAContext from "../../contexts/HSBAContext";
import { format } from "date-fns";

const FPhieuTDDiUngThuoc = () => {
    const { phieuTDDiUngThuoc } = useSelector((state) => state.HSBA);
    const { role } = useSelector((state) => state.auth.user);
    const { tabsDinhKemState, setTabsDinhKemState } = useContext(HSBAContext);
    const dispatch = useDispatch();

    const [thuocDiUng, setThuocDiUng] = useState(phieuTDDiUngThuoc.thuocDiUng);
    const [kieuDiUng, setKieuDiUng] = useState(phieuTDDiUngThuoc.kieuDiUng);
    const [benhKemTheo, setBenhKemTheo] = useState(phieuTDDiUngThuoc.benhKemTheo);
    const [hasChanged, setHasChanged] = useState(false);
    
    const handleSave = () => {
        dispatch(HSBAActions.updateBacSiSection({
            section: 'phieuTDDiUngThuoc',
            data: {
                thuocDiUng,
                kieuDiUng,
                benhKemTheo
            }
        }))
        setHasChanged(false);
        setTabsDinhKemState({
            ...tabsDinhKemState, 
            phieuTDDiUngThuoc: { saved: true, date: new Date() }
        });
    }

    const handleReset = () => {
        setThuocDiUng(phieuTDDiUngThuoc.thuocDiUng);
        setKieuDiUng(phieuTDDiUngThuoc.kieuDiUng);
        setBenhKemTheo(phieuTDDiUngThuoc.benhKemTheo);
        setHasChanged(false);
    }

    const handleChange = () => {
        if (!hasChanged) {
            setHasChanged(true);
        }
    }

    return (
        <Box component="form" noValidate>
            {tabsDinhKemState.phieuTDDiUngThuoc.saved && 
                <Box sx={{ width: '100%', textAlign: 'right' }}>
                    <Typography color="primary">
                        <i>Đã chỉnh sửa: {format(new Date(tabsDinhKemState.phieuTDDiUngThuoc.date), 'dd/MM/yyyy HH:mm:ss')}</i>
                    </Typography>
                </Box>
            }

            <Typography fontWeight="bold">Dị ứng với các thuốc và các dị nguyên khác</Typography>
            <TextField 
                margin="normal"
                multiline
                fullWidth
                value={thuocDiUng}
                onChange={(event) => {
                    setThuocDiUng(event.target.value);
                    handleChange();
                }}
                disabled={role !== "BS"}
            />
            
            <Typography fontWeight="bold" sx={{ mt: 1 }}>Kiểu dị ứng</Typography>
            <TextField 
                margin="normal"
                multiline
                fullWidth
                value={kieuDiUng}
                onChange={(event) => {
                    setKieuDiUng(event.target.value);
                    handleChange();
                }}
                disabled={role !== "BS"}
            />

            <Typography fontWeight="bold" sx={{ mt: 1 }}>Bệnh kèm theo</Typography>
            <TextField 
                margin="normal"
                multiline
                fullWidth
                value={benhKemTheo}
                onChange={(event) => {
                    setBenhKemTheo(event.target.value);
                    handleChange();
                }}
                disabled={role !== "BS"}
            />

            {hasChanged &&
                <Box sx={{ width: '100%', textAlign: 'right', mt: 2 }}>
                    <Button variant="outlined" startIcon={<Autorenew />} sx={{ width: 150, mr: 2 }} onClick={handleReset}>
                        Đặt lại
                    </Button>

                    <Button variant="primary" startIcon={<Save />} sx={{ width: 150 }} onClick={handleSave}>
                        Lưu tạm thời
                    </Button>
                </Box>
            }      

            <Divider sx={{ my: 2}}/>
            <Box>
                <Typography>Cấp ngày ... tháng ... năm ...</Typography>
                <Typography fontWeight="bold">
                    Bác sĩ:{' '}
                    <Typography component="span"></Typography>
                </Typography>
            </Box> 
        </Box>
    )
}

export default FPhieuTDDiUngThuoc;

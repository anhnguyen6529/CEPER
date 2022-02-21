import { Box, TextField } from "@mui/material";
import React, { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../../styles/index.css";
import { HSBAActions } from "../../redux/slices/HSBA.slice";
import { Autorenew, Save } from "@mui/icons-material";
import { Button } from "../common";
import HSBAContext from "../../contexts/HSBAContext";

const FHuongDieuTri = () => {
    const HSBA = useSelector((state) => state.HSBA);
    const { role } = useSelector((state) => state.auth.user);
    const { tabTongKetBAState, setTabTongKetBAState } = useContext(HSBAContext);
    const dispatch = useDispatch();

    const [huongDieuTri, setHuongDieuTri] = useState(HSBA.huongDieuTri);
    const [hasChanged, setHasChanged] = useState(false);
  
    const handleSave = () => {
        dispatch(HSBAActions.updateBacSiSection({
            section: 'huongDieuTri',
            data: huongDieuTri
        }))
        setHasChanged(false);
        setTabTongKetBAState({
            ...tabTongKetBAState, 
            huongDieuTri: { saved: true, date: new Date() }
        });
    }

    const handleReset = () => {
        setHuongDieuTri(HSBA.huongDieuTri);
        setHasChanged(false);
    }

    const handleChange = () => {
        if (!hasChanged) {
            setHasChanged(true);
        }
    }

    return (
        <Box component="form" noValidate>       
            <TextField 
                multiline
                fullWidth
                value={huongDieuTri}
                onChange={(event) => {
                    setHuongDieuTri(event.target.value);
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
        </Box>
    )
}

export default FHuongDieuTri;

import { Box, TextField } from "@mui/material";
import React, { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../../styles/index.css";
import { HSBAActions } from "../../redux/slices/HSBA.slice";
import { Button } from "../common";
import HSBAContext from "../../contexts/HSBAContext";
import mdSections from "../../constants/md_sections.json";

const FHuongDieuTri = () => {
    const HSBA = useSelector((state) => state.HSBA);
    const { role } = useSelector((state) => state.auth.user);
    const { saveSec, setSaveSec } = useContext(HSBAContext);
    const dispatch = useDispatch();

    const [huongDieuTri, setHuongDieuTri] = useState(HSBA.huongDieuTri);
    const [hasChanged, setHasChanged] = useState(false);

    const tongKetBAId = mdSections["order"].indexOf("Tổng kết bệnh án");
    const sectionId = mdSections["Tổng kết bệnh án"].indexOf("Hướng điều trị và các chế độ tiếp theo");
  
    const handleSave = () => {
        dispatch(HSBAActions.updateBacSiSection({
            section: 'huongDieuTri',
            data: huongDieuTri
        }))
        setHasChanged(false);
        let tSaveSec = [...saveSec];
        tSaveSec[tongKetBAId][sectionId] = new Date();
        setSaveSec(tSaveSec);
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
                    <Button variant="outlined" sx={{ mr: 2 }} onClick={handleReset}>
                        Hủy
                    </Button>

                    <Button variant="primary" onClick={handleSave}>
                        Lưu tạm thời
                    </Button>
                </Box>
            }
        </Box>
    )
}

export default FHuongDieuTri;

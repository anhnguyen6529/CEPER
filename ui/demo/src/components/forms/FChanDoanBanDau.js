import { Box, TextField } from "@mui/material";
import React, { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../../styles/index.css";
import { HSBAActions } from "../../redux/slices/HSBA.slice";
import { Button } from "../common";
import HSBAContext from "../../contexts/HSBAContext";
import mdSections from "../../constants/md_sections.json";

const FChanDoanBanDau = () => {
    const HSBA = useSelector((state) => state.HSBA);
    const { role } = useSelector((state) => state.auth.user);
    const { saveSec, setSaveSec } = useContext(HSBAContext);
    const dispatch = useDispatch();

    const [chanDoanBanDau, setChanDoanBanDau] = useState(HSBA.chanDoanBanDau);
    const [hasChanged, setHasChanged] = useState(false);

    const benhAnId = mdSections["order"].indexOf("Bệnh án");
    const sectionId = mdSections["Bệnh án"].indexOf("Chẩn đoán ban đầu");
  
    const handleSave = () => {
        dispatch(HSBAActions.updateBacSiSection({
            section: 'chanDoanBanDau',
            data: chanDoanBanDau
        }))
        setHasChanged(false);
        let tSaveSec = [...saveSec];
        tSaveSec[benhAnId][sectionId] = new Date();
        setSaveSec(tSaveSec);
    }

    const handleReset = () => {
        setChanDoanBanDau(HSBA.chanDoanBanDau);
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
                value={chanDoanBanDau}
                onChange={(event) => {
                    setChanDoanBanDau(event.target.value);
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

export default FChanDoanBanDau;

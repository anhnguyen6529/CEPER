import { Box, TextField } from "@mui/material";
import React, { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../../styles/index.css";
import { HSBAActions } from "../../redux/slices/HSBA.slice";
import { Button } from "../common";
import HSBAContext from "../../contexts/HSBAContext";
import mdSections from "../../constants/md_sections.json";

const FTomTatBenhAn = () => {
    const HSBA = useSelector((state) => state.HSBA);
    const { role } = useSelector((state) => state.auth.user);
    const { saveSec, setSaveSec } = useContext(HSBAContext);
    const dispatch = useDispatch();

    const [tomTatBenhAn, setTomTatBenhAn] = useState(HSBA.tomTatBenhAn);
    const [hasChanged, setHasChanged] = useState(false);
  
    const benhAnId = mdSections["order"].indexOf("Bệnh án");
    const sectionId = mdSections["Bệnh án"].indexOf("Tóm tắt bệnh án");

    const handleSave = () => {
        dispatch(HSBAActions.updateBacSiSection({
            section: 'tomTatBenhAn',
            data: tomTatBenhAn
        }))
        setHasChanged(false);
        let tSaveSec = [...saveSec];
        tSaveSec[benhAnId][sectionId] = new Date();
        setSaveSec(tSaveSec);
    }

    const handleReset = () => {
        setTomTatBenhAn(HSBA.tomTatBenhAn);
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
                value={tomTatBenhAn}
                onChange={(event) => {
                    setTomTatBenhAn(event.target.value);
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

export default FTomTatBenhAn;

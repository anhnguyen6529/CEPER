import { Box, TextField } from "@mui/material";
import React, { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../../styles/index.css";
import { HSBAActions } from "../../redux/slices/HSBA.slice";
import { Autorenew, Save } from "@mui/icons-material";
import { Button } from "../common";
import HSBAContext from "../../contexts/HSBAContext";

const FTomTatBenhAn = () => {
    const HSBA = useSelector((state) => state.HSBA);
    const { role } = useSelector((state) => state.auth.user);
    const { tabBenhAnState, setTabBenhAnState } = useContext(HSBAContext);
    const dispatch = useDispatch();

    const [tomTatBenhAn, setTomTatBenhAn] = useState(HSBA.tomTatBenhAn);
    const [hasChanged, setHasChanged] = useState(false);
  
    const handleSave = () => {
        dispatch(HSBAActions.updateBacSiSection({
            section: 'tomTatBenhAn',
            data: tomTatBenhAn
        }))
        setHasChanged(false);
        setTabBenhAnState({
            ...tabBenhAnState, 
            tomTatBenhAn: { saved: true, date: new Date() }
        });
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

export default FTomTatBenhAn;

import { CancelOutlined } from "@mui/icons-material";
import { Box, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { HSBAActions } from "../../redux/slices/HSBA.slice";
import { SpellingErrorActions } from "../../redux/slices/spellingError.slice";
import "../../styles/index.css";
import { Button } from "../common";

const SECTION_NAME = "Tóm tắt bệnh án";
const SECTION_FIELD = "tomTatBenhAn";

const FTomTatBenhAn = () => {
    const { updating, confirmUpdate, tomTatBenhAn } = useSelector((state) => state.HSBA);
    const spellingError = useSelector((state) => state.spellingError[SECTION_NAME]);
    const dispatch = useDispatch();

    const [newTomTatBenhAn, setNewTomTatBenhAn] = useState(tomTatBenhAn);

    useEffect(() => {
        if (updating || confirmUpdate) {
            dispatch(HSBAActions.updateSection({ section: SECTION_FIELD, data: newTomTatBenhAn }));
        }
        // eslint-disable-next-line
    }, [updating, confirmUpdate]);

    const handleReset = () => {
        setNewTomTatBenhAn(tomTatBenhAn);
        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: false }));
    }

    return (
        <Box component="form" noValidate>     
            <TextField 
                multiline
                fullWidth
                value={newTomTatBenhAn}
                onChange={({ target: { value } }) => {
                    setNewTomTatBenhAn(value);
                    if (value === tomTatBenhAn) {
                        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: false }));
                    } else {
                        if (!spellingError.changed) {
                            dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: true }));
                        }
                    }
                }}
                disabled={updating}
                inputProps={{ 'aria-label': 'tom tat benh an' }}
            />

            <Box sx={{ width: '100%', textAlign: 'right' }}>
                {(spellingError.changed && !updating) ?
                    <Button startIcon={<CancelOutlined />} variant="outlined" sx={{ mt: 2 }} onClick={handleReset}>Hủy</Button> 
                : null}
            </Box>
        </Box>
    )
}

export default FTomTatBenhAn;

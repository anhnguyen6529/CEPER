import React, { useContext } from "react";
import { Autocomplete, Box, Paper, TextField, Typography } from "@mui/material";
import "../../../styles/index.css";
import TaoHSBAContext from "../../../contexts/TaoHSBAContext";
import doctorList from "../../../constants/doctor_list.json";
import { useSelector } from "react-redux";

const FHoSo = () => {
    const { values, setValues, errors, setErrors, hasChangedNew, setHasChangedNew, submitted } = useContext(TaoHSBAContext);
    const { department } = useSelector((state) => state.auth.user);
    
    return (
        <Paper sx={{ px: 3, py: 2 }}>
            <Box className="df aic">
                <Typography fontWeight="bold" sx={{ minWidth: 150 }}>
                    Bác sĩ phụ trách
                    <Typography component="span" color="error" fontWeight="bold">{' '}*</Typography>
                </Typography>
                <Autocomplete 
                    fullWidth
                    value={values.bacSiPhuTrach}
                    onChange={(_, value) => {
                        setValues({ ...values, bacSiPhuTrach: value });
                        if (!hasChangedNew) {
                            setHasChangedNew(true);
                        }
                        setErrors({ ...errors, bacSiPhuTrach: "" });
                    }}
                    renderInput={(params) => 
                        <TextField
                            {...params} 
                            placeholder="Bác sĩ"
                            error={submitted && !!errors.bacSiPhuTrach}
                            helperText={submitted ? errors.bacSiPhuTrach : ""}
                        />
                    }
                    options={[{ id: "", name: "" }, ...doctorList.filter(doctor => doctor.khoa_cong_tac === department).map(doctor => ({ id: doctor.id, name: doctor.ho_ten }))]}
                    getOptionLabel={(option) => !option.id ? "-- Chọn --" : option.id + " - " + option.name} 
                    disableClearable
                    getOptionDisabled={(option) => !option.id || values.bacSiPhuTrach.id === option.id}
                    isOptionEqualToValue={(option, value) => option.id === value.id && option.name === value.name}
                />
            </Box>
        </Paper>
    )
}

export default FHoSo;
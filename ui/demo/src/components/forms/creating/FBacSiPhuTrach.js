import React, { useContext } from "react";
import { Autocomplete, Grid, Paper, TextField, Typography } from "@mui/material";
import "../../../styles/index.css";
import TaoHSBAContext from "../../../contexts/TaoHSBAContext";
import doctorList from "../../../constants/doctor_list.json";

const FHoSo = () => {
    const { values, setValues, hasChangedNew, setHasChangedNew, submitted } = useContext(TaoHSBAContext);
    
    return (
        <Paper sx={{ px: 3, py: 2 }}>
            <Grid container columnSpacing={3}>
                <Grid item xs={1.5}>
                    <Typography fontWeight="bold" sx={{ mt: '16px' }}>Bác sĩ phụ trách*</Typography>
                </Grid>
                <Grid item xs={4.5}>
                    <Autocomplete 
                        value={values.bacSiPhuTrach}
                        onChange={(_, value) => {
                            setValues({ ...values, bacSiPhuTrach: value });
                            if (!hasChangedNew) {
                                setHasChangedNew(true);
                            }
                        }}
                        renderInput={(params) => 
                            <TextField
                                {...params} 
                                placeholder="Bác sĩ"
                                error={submitted && !values.bacSiPhuTrach.id}
                                helperText={submitted && !values.bacSiPhuTrach.id ? "Vui lòng nhập bác sĩ phụ trách" : ""}
                            />
                        }
                        options={[{ id: "", name: "" }, ...doctorList.map(doctor => ({ id: doctor.id, name: doctor.ho_ten }))]}
                        getOptionLabel={(option) => !option.id ? "-- Chọn --" : option.id + " - " + option.name} 
                        disableClearable
                        getOptionDisabled={(option) => !option.id || values.bacSiPhuTrach.id === option.id}
                        isOptionEqualToValue={(option, value) => option.id === value.id && option.name === value.name}
                    />
                </Grid>
            </Grid>
        </Paper>
    )
}

export default FHoSo;
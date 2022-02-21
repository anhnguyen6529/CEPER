import { Box, Typography, TextField, Grid } from "@mui/material";
import React, { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../../styles/index.css";
import { HSBAActions } from "../../redux/slices/HSBA.slice";
import { Autorenew, Save } from "@mui/icons-material";
import { Button } from "../common";
import HSBAContext from "../../contexts/HSBAContext";

const FHoiBenh = () => {
    const { hoiBenh } = useSelector((state) => state.HSBA);
    const { role } = useSelector((state) => state.auth.user);
    const { tabBenhAnState, setTabBenhAnState } = useContext(HSBAContext);
    const dispatch = useDispatch();

    const [tienSu, setTienSu] = useState(hoiBenh.tienSu);
    const [benhSu, setBenhSu] = useState(hoiBenh.benhSu);
    const [hasChanged, setHasChanged] = useState(false);
  
    const handleSave = () => {
        dispatch(HSBAActions.updateBacSiSection({
            section: 'hoiBenh',
            data: {
                tienSu, 
                benhSu
            }
        }))
        setHasChanged(false);
        setTabBenhAnState({
            ...tabBenhAnState, 
            hoiBenh: { saved: true, date: new Date() }
        });
    }

    const handleReset = () => {
        setTienSu(hoiBenh.tienSu);
        setBenhSu(hoiBenh.benhSu);
        setHasChanged(false);
    }

    const handleChange = () => {
        if (!hasChanged) {
            setHasChanged(true);
        }
    }

    return (
        <Box component="form" noValidate sx={{ '.MuiTypography-root': { mt: '12px' } }}>
            <Grid container>
                <Grid item xs={1}>
                    <Typography fontWeight="bold">Bệnh sử</Typography>
                </Grid>
                <Grid item xs={11}>
                    <TextField 
                        multiline
                        fullWidth
                        value={benhSu}
                        onChange={(event) => {
                            setBenhSu(event.target.value);
                            handleChange();
                        }}
                        disabled={role !== "BS"}
                    />
                </Grid>
            </Grid>
            <Grid container sx={{ mt: 2 }}>
                <Grid item xs={1}>
                    <Typography fontWeight="bold">Tiền sử</Typography>
                </Grid>
                <Grid item xs={11}>
                    <TextField 
                        multiline
                        fullWidth
                        value={tienSu}
                        onChange={(event) => {
                            setTienSu(event.target.value);
                            handleChange();
                        }}
                        disabled={role !== "BS"}
                    />
                </Grid>
            </Grid>

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

export default FHoiBenh;

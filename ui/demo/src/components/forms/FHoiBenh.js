import { Box, Typography, Button, TextField, Grid } from "@mui/material";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../../styles/index.css";
import { HSBAActions } from "../../redux/slices/HSBA.slice";
import { Save } from "@mui/icons-material";

const FHoiBenh = ({ setEdit }) => {
    const { hoiBenh } = useSelector((state) => state.HSBA);
    const dispatch = useDispatch();

    const [tienSu, setTienSu] = useState(hoiBenh.tienSu);
    const [benhSu, setBenhSu] = useState(hoiBenh.benhSu);
  
    const handleSave = () => {
        dispatch(HSBAActions.updateBacSiSection({
            section: 'hoiBenh',
            data: {
                tienSu, 
                benhSu
            }
        }))
        setEdit(false);
    }

    return (
        <Box component="form" noValidate>
            <Grid container sx={{ mt: 2 }}>
                <Grid item xs={1}>
                    <Typography fontWeight="bold">Bệnh sử</Typography>
                </Grid>
                <Grid item xs={11}>
                    <TextField 
                        multiline
                        fullWidth
                        value={benhSu}
                        onChange={(event) => setBenhSu(event.target.value)}
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
                        onChange={(event) => setTienSu(event.target.value)}
                    />
                </Grid>
            </Grid>

            <Box sx={{ width: '100%', textAlign: 'right', mt: 3 }}>
                <Button 
                    sx={{ 
                        width: 150,
                        height: 36,
                        background: '#48B0F7', 
                        textTransform: 'none', 
                        fontWeight: 'bold',
                        color: 'white',
                        '&:hover': {
                            background: '#48B0F7', 
                        }
                    }} 
                    startIcon={<Save fontSize="small" />}
                    onClick={handleSave}
                >
                    Lưu
                </Button>
            </Box>
        </Box>
    )
}

export default FHoiBenh;

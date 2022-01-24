import { Box, Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../../styles/index.css";
import { HSBAActions } from "../../redux/slices/HSBA.slice";
import { Save } from "@mui/icons-material";

const FChanDoanBanDau = ({ setEdit }) => {
    const HSBA = useSelector((state) => state.HSBA);
    const dispatch = useDispatch();

    const [chanDoanBanDau, setChanDoanBanDau] = useState(HSBA.chanDoanBanDau);
  
    const handleSave = () => {
        dispatch(HSBAActions.updateBacSiSection({
            section: 'chanDoanBanDau',
            data: chanDoanBanDau
        }))
        setEdit(false);
    }

    return (
        <Box component="form" noValidate>       
            <TextField 
                multiline
                fullWidth
                value={chanDoanBanDau}
                onChange={(event) => setChanDoanBanDau(event.target.value)}
                sx={{ mt: 2 }}
            />

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

export default FChanDoanBanDau;

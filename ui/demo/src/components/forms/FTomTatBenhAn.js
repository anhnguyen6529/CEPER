import { Box, TextField } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import "../../styles/index.css";
// import { HSBAActions } from "../../redux/slices/HSBA.slice";
// import { Save } from "@mui/icons-material";

const FTomTatBenhAn = () => {
    const HSBA = useSelector((state) => state.HSBA);
    // const dispatch = useDispatch();

    const [tomTatBenhAn, setTomTatBenhAn] = useState(HSBA.tomTatBenhAn);
  
    // const handleSave = () => {
    //     dispatch(HSBAActions.updateBacSiSection({
    //         section: 'tomTatBenhAn',
    //         data: tomTatBenhAn
    //     }))
    //     setEdit(false);
    // }

    return (
        <Box component="form" noValidate>       
            <TextField 
                multiline
                fullWidth
                value={tomTatBenhAn}
                onChange={(event) => setTomTatBenhAn(event.target.value)}
            />

            {/* <Box sx={{ width: '100%', textAlign: 'right', mt: 3 }}>
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
            </Box> */}
        </Box>
    )
}

export default FTomTatBenhAn;

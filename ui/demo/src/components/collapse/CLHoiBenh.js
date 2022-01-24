import { Collapse, Typography, Box, Button, Grid } from "@mui/material";
import { Edit } from "@mui/icons-material";
import React, { useState } from "react";
import mdSections from "../../constants/md_sections.json";
import { useSelector } from "react-redux";
import { FHoiBenh } from "../forms";

const CLHoiBenh = ({ open, id }) => {
    const [edit, setEdit] = useState(false);
    const content = useSelector((state) => state.HSBA.hoiBenh);
    const { role } = useSelector(state => state.auth.user);

    return (
        <Collapse in={open} timeout="auto" unmountOnExit sx={{ mb: 3 }}>
            {!edit ? 
            <>
                <Grid container sx={{ mt: 2 }}>
                    <Grid item xs={1}>
                        <Typography fontWeight="bold">Bệnh sử</Typography>
                    </Grid>
                    <Grid item xs={11}>
                        <Typography>{!content.benhSu ? <i>(trống)</i> : content.benhSu}</Typography>
                    </Grid>
                </Grid>
                <Grid container sx={{ mt: 2 }}>
                    <Grid item xs={1}>
                        <Typography fontWeight="bold">Tiền sử</Typography>
                    </Grid>
                    <Grid item xs={11}>
                        <Typography>{!content.tienSu ? <i>(trống)</i> : content.tienSu}</Typography>
                    </Grid>
                </Grid>
            
                { mdSections.canEdit[role].includes(id) && 
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
                        startIcon={<Edit fontSize="small"/>}
                        onClick={() => setEdit(!edit)}
                    >
                        Chỉnh sửa
                    </Button>
                </Box>
                }
            </>
            : <FHoiBenh setEdit={setEdit} />
            }
        </Collapse>
    )
}

export default CLHoiBenh;
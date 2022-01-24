import { Collapse, Typography, Box, Button, Divider, Grid } from "@mui/material";
import { Edit } from "@mui/icons-material";
import React, { useState } from "react";
import { format } from "date-fns";
import mdSections from "../../constants/md_sections.json";
import { useSelector } from "react-redux";

const CLChanDoanKhiRaVien = ({ open, id }) => {
    const [edit, setEdit] = useState(false);
    const content = useSelector((state) => state.HSBA.chanDoanKhiRaVien);
    const { role } = useSelector(state => state.auth.user);

    return (
        <Collapse in={open} timeout="auto" unmountOnExit sx={{ mb: 3 }}>
            {!edit ? 
            <>
                <Typography sx={{ mt: 2 }}>{!content.chanDoan ? <i>(trống)</i> : content.chanDoan}</Typography>
                <Divider sx={{ my: 2 }}/>
                
                <Grid container sx={{ mt: 1 }}>
                    <Grid item xs={2}>
                        <Typography fontWeight="bold">Ngày ra viện</Typography>
                    </Grid>
                    <Grid item xs={10}>
                        {!content.ngayRaVien 
                        ? <Typography color="gray">(chưa ra viện)</Typography>
                        : <Typography>{format(new Date(content.chanDoan, 'dd/MM/yyyy'))}</Typography>
                        }
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
            : <></>
            // : <FormHC setEdit={setEdit}/>
            }
        </Collapse>
    )
}

export default CLChanDoanKhiRaVien;
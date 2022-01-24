import { Collapse, Typography, Box, Button, Divider, Grid } from "@mui/material";
import { Edit, RadioButtonChecked, RadioButtonUnchecked } from "@mui/icons-material";
import React, { useState } from "react";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import mdSections from "../../constants/md_sections.json";
import { FLyDoVaoVien } from "../forms";

const CLLyDoVaoVien = ({ open, id }) => {
    const [edit, setEdit] = useState(false);
    const content = useSelector((state) => state.HSBA.lyDoVaoVien);
    const { role } = useSelector(state => state.auth.user);

    return (
        <Collapse in={open} timeout="auto" unmountOnExit sx={{ mb: 3 }}>
            {!edit ? 
            <>
                <Grid container sx={{ mt: 2 }}>
                    <Grid item xs={9}>
                        <Typography>{!content.lyDo ? <i>(trống)</i> : content.lyDo}</Typography>
                    </Grid>
                    <Grid item xs={3} align="right">
                        <Typography sx={{ mr: 2 }}>Vào ngày thứ <b>{content.vaoNgayThu}</b> của bệnh</Typography>
                    </Grid>
                </Grid>
                <Divider sx={{ my: 2 }}/>
                
                <Grid container sx={{ mt: 1 }}>
                    <Grid item xs={3}>
                        <Typography fontWeight="bold">Ngày vào viện</Typography>
                    </Grid>
                    <Grid item xs={9}>
                        <Typography>{format(new Date(content.ngayVaoVien), 'dd/MM/yyyy')}</Typography>
                    </Grid>
                </Grid>
                <Grid container sx={{ mt: 2 }}>
                    <Grid item xs={3}>
                        <Typography fontWeight="bold">Chẩn đoán của nơi giới thiệu</Typography>
                    </Grid>
                    <Grid item xs={7}>
                        <Typography>{!content.chanDoanNoiGioiThieu ? <i>(trống)</i> : content.chanDoanNoiGioiThieu}</Typography>
                    </Grid>
                    <Grid item xs={2} >
                        <Box className="df">
                            {content.noiGioiThieu === 'Y tế' ? <RadioButtonChecked /> : <RadioButtonUnchecked color="disabled"/>}
                            <Typography sx={{ ml: 1, mr: 2 }}>Y tế</Typography>
                        
                            {content.noiGioiThieu === 'Tự đến' ? <RadioButtonChecked /> : <RadioButtonUnchecked color="disabled"/>}
                            <Typography sx={{ ml: 1 }}>Tự đến</Typography>
                        </Box>
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
            : <FLyDoVaoVien setEdit={setEdit} />
            }
        </Collapse>
    )
}

export default CLLyDoVaoVien;
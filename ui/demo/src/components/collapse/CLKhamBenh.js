import { Collapse, Typography, Box, Button, Grid } from "@mui/material";
import { Edit } from "@mui/icons-material";
import React, { useState } from "react";
import mdSections from "../../constants/md_sections.json";
import { useSelector } from "react-redux";
import { FKhamBenh } from "../forms";

const CLKhamBenh = ({ open, id }) => {
    const [edit, setEdit] = useState(false);
    const content = useSelector((state) => state.HSBA.khamBenh);
    const { role } = useSelector(state => state.auth.user);

    return (
        <Collapse in={open} timeout="auto" unmountOnExit sx={{ mb: 3 }}>
            {!edit ? 
            <>
                <Grid container sx={{ mt: 2 }}>
                    <Grid item xs={2}>
                        <Typography fontWeight="bold">Khám toàn thân</Typography>
                    </Grid>
                    <Grid item xs={10}>
                        <Typography sx={{ pl: 3 }}>{!content.khamToanThan ? <i>(trống)</i> : content.khamToanThan}</Typography>
                    </Grid>
                </Grid>
                <Grid container sx={{ mt: 2 }}>
                    <Grid item xs={2}>
                        <Typography fontWeight="bold">Tuần hoàn</Typography>
                    </Grid>
                    <Grid item xs={10}>
                        <Typography sx={{ pl: 3 }}>{!content.tuanHoan ? <i>(trống)</i> : content.tuanHoan}</Typography>
                    </Grid>
                </Grid>
                <Grid container sx={{ mt: 2 }}>
                    <Grid item xs={2}>
                        <Typography fontWeight="bold">Hô hấp</Typography>
                    </Grid>
                    <Grid item xs={10}>
                        <Typography sx={{ pl: 3 }}>{!content.hoHap ? <i>(trống)</i> : content.hoHap}</Typography>
                    </Grid>
                </Grid>
                <Grid container sx={{ mt: 2 }}>
                    <Grid item xs={2}>
                        <Typography fontWeight="bold">Tiêu hóa</Typography>
                    </Grid>
                    <Grid item xs={10}>
                        <Typography sx={{ pl: 3 }}>{!content.tieuHoa ? <i>(trống)</i> : content.tieuHoa}</Typography>
                    </Grid>
                </Grid>
                <Grid container sx={{ mt: 2 }}>
                    <Grid item xs={2}>
                        <Typography fontWeight="bold">Thận - Tiết niệu - Sinh dục</Typography>
                    </Grid>
                    <Grid item xs={10}>
                        <Typography sx={{ pl: 3 }}>{!content.than ? <i>(trống)</i> : content.than}</Typography>
                    </Grid>
                </Grid>
                <Grid container sx={{ mt: 2 }}>
                    <Grid item xs={2}>
                        <Typography fontWeight="bold">Thần kinh</Typography>
                    </Grid>
                    <Grid item xs={10}>
                        <Typography sx={{ pl: 3 }}>{!content.thanKinh ? <i>(trống)</i> : content.thanKinh}</Typography>
                    </Grid>
                </Grid>
                <Grid container sx={{ mt: 2 }}>
                    <Grid item xs={2}>
                        <Typography fontWeight="bold">Cơ - Xương - Khớp</Typography>
                    </Grid>
                    <Grid item xs={10}>
                        <Typography sx={{ pl: 3 }}>{!content.coXuongKhop ? <i>(trống)</i> : content.coXuongKhop}</Typography>
                    </Grid>
                </Grid>
                <Grid container sx={{ mt: 2 }}>
                    <Grid item xs={2}>
                        <Typography fontWeight="bold">Tai - Mũi - Họng</Typography>
                    </Grid>
                    <Grid item xs={10}>
                        <Typography sx={{ pl: 3 }}>{!content.taiMuiHong ? <i>(trống)</i> : content.taiMuiHong}</Typography>
                    </Grid>
                </Grid>
                <Grid container sx={{ mt: 2 }}>
                    <Grid item xs={2}>
                        <Typography fontWeight="bold">Răng - Hàm - Mặt</Typography>
                    </Grid>
                    <Grid item xs={10}>
                        <Typography sx={{ pl: 3 }}>{!content.rangHamMat ? <i>(trống)</i> : content.rangHamMat}</Typography>
                    </Grid>
                </Grid>
                <Grid container sx={{ mt: 2 }}>
                    <Grid item xs={2}>
                        <Typography fontWeight="bold">Mắt</Typography>
                    </Grid>
                    <Grid item xs={10}>
                        <Typography sx={{ pl: 3 }}>{!content.mat ? <i>(trống)</i> : content.mat}</Typography>
                    </Grid>
                </Grid>
                <Grid container sx={{ mt: 2 }}>
                    <Grid item xs={2}>
                        <Typography fontWeight="bold">Nội tiết, dinh dưỡng và các bệnh lý khác</Typography>
                    </Grid>
                    <Grid item xs={10}>
                        <Typography sx={{ pl: 3 }}>{!content.noiTiet ? <i>(trống)</i> : content.noiTiet}</Typography>
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
            : <FKhamBenh setEdit={setEdit} />
            }
        </Collapse>
    )
}

export default CLKhamBenh;
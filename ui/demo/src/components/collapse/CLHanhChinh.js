import { Collapse, Grid, Typography, Divider, Box, Button } from "@mui/material";
import { Edit } from "@mui/icons-material";
import React, { useState } from "react";
import { FHanhChinh } from "../forms";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { UtilsText } from "../../utils";
import mdSections from "../../constants/md_sections.json";

const CLHanhChinh = ({ open, id }) => {
    const [edit, setEdit] = useState(false);
    const content = useSelector((state) => state.HSBA.hanhChinh);
    const { role } = useSelector(state => state.auth.user);

    return (
        <Collapse in={open} timeout="auto" unmountOnExit sx={{ mb: 3 }}>
            {!edit ? 
            <>
                <Grid container sx={{ mt: 2, '& .MuiTypography-root': { width: '90%'} }}>
                    <Grid item xs={3}>
                        <Typography fontWeight="bold">Họ và tên</Typography>
                        <Typography>{content.hoTen}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography fontWeight="bold">Ngày sinh</Typography>
                        <Typography>{format(new Date(content.ngaySinh), 'dd/MM/yyyy')}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography fontWeight="bold">Giới tính</Typography>
                        <Typography>{content.gioiTinh}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography fontWeight="bold">Nghề nghiệp</Typography>
                        <Typography>{!content.ngheNghiep ? <i>(trống)</i> : content.ngheNghiep}</Typography>
                    </Grid>
                </Grid>
                <Grid container sx={{ mt: 1, '& .MuiTypography-root': { width: '90%'} }} >
                    <Grid item xs={3}>
                        <Typography fontWeight="bold">Dân tộc</Typography>
                        <Typography>{!content.danToc ? <i>(trống)</i> : content.danToc}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography fontWeight="bold">Quốc tịch</Typography>
                        <Typography>{content.quocTich}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography fontWeight="bold">Số CMND/CCCD/SSN</Typography>
                        <Typography>{content.soCCCD}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography fontWeight="bold">Điện thoại</Typography>
                        <Typography>{!content.dienThoai ? <i>(trống)</i> : content.dienThoai}</Typography>
                    </Grid> 
                </Grid>
                <Grid container sx={{ mt: 1, '& .MuiTypography-root': { width: '90%'} }} >
                    <Grid item xs={3}>
                        <Typography fontWeight="bold">Nơi làm việc</Typography>
                        <Typography>{content.noiLamViec}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography fontWeight="bold">Đối tượng</Typography>
                        <Typography>{content.doiTuong}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography fontWeight="bold">Số nhà</Typography>
                        <Typography>{!content.soNha ? <i>(trống)</i> : content.soNha}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography fontWeight="bold">Thôn/Phố</Typography>
                        <Typography>{!content.thonPho ? <i>(trống)</i> : content.thonPho}</Typography>
                    </Grid>                   
                </Grid>
                <Grid container sx={{ mt: 1, '& .MuiTypography-root': { width: '90%'} }} >
                    <Grid item xs={3}>
                        <Typography fontWeight="bold">Phường/Xã</Typography>
                        <Typography>{content.phuongXa}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography fontWeight="bold">Quận/Huyện</Typography>
                        <Typography>{content.quanHuyen}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography fontWeight="bold">Tỉnh/Thành phố</Typography>
                        <Typography>{content.tinhTP}</Typography>
                    </Grid>
                </Grid>
                <Divider sx={{ mt: 2, mb: 2 }}/>

                <Typography color="#999"><i>Thông tin BHYT</i></Typography>
                <Grid container sx={{ mt: 1, '& .MuiTypography-root': { width: '90%'} }} >
                    <Grid item xs={3}>
                        <Typography fontWeight="bold">Số thẻ BHYT</Typography>
                        <Typography>
                            {!content.soTheBHYT 
                                ? <i>(trống)</i> 
                                : UtilsText.mask(content.soTheBHYT, '# ## ### ### ####')
                            }
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography fontWeight="bold">Nơi đăng ký KCB ban đầu</Typography>
                        <Typography>{!content.noiDangKyKCBBanDau ? <i>(trống)</i> : content.noiDangKyKCBBanDau}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography fontWeight="bold">Giá trị từ</Typography>
                        <Typography>{!content.giaTriTu ? <i>(trống)</i> : format(new Date(content.giaTriTu), 'dd/MM/yyyy')}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography fontWeight="bold">Giá trị đến</Typography>
                        <Typography>{!content.giaTriDen ? <i>(trống)</i> : format(new Date(content.giaTriDen), 'dd/MM/yyyy')}</Typography>
                    </Grid>
                </Grid>
                <Divider sx={{ mt: 2, mb: 2 }}/>

                <Typography color="#999"><i>Thông tin người nhà bệnh nhân (khi cần báo tin)</i></Typography>
                <Grid container sx={{ mt: 1, '& .MuiTypography-root': { width: '90%'} }} >
                    <Grid item xs={3}>
                        <Typography fontWeight="bold">Họ tên</Typography>
                        <Typography>{!content.nguoiNha.hoTen ? <i>(trống)</i> : content.nguoiNha.hoTen}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography fontWeight="bold">Quan hệ với bệnh nhân</Typography>
                        <Typography>{!content.nguoiNha.quanHeVoiBenhNhan ? <i>(trống)</i> : content.nguoiNha.quanHeVoiBenhNhan}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography fontWeight="bold">Điện thoại</Typography>
                        <Typography>{!content.nguoiNha.dienThoai ? <i>(trống)</i> : content.nguoiNha.dienThoai}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography fontWeight="bold">Địa chỉ</Typography>
                        <Typography>{!content.nguoiNha.diaChi ? <i>(trống)</i> : content.nguoiNha.diaChi}</Typography>
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
            : <FHanhChinh setEdit={setEdit}/>
            }
        </Collapse>
    )
}

export default CLHanhChinh;
import React from "react";
import { Box, Grid, Typography, Divider } from "@mui/material";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { UtilsText } from "../../utils";

const BoxHanhChinh = () => {
    const { hanhChinh } = useSelector(state => state.HSBA);

    return (
        <Box>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Họ và tên</Typography>
                    <Typography>{!!hanhChinh.hoTen ? hanhChinh.hoTen : <i>(trống)</i>}</Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Ngày sinh</Typography>
                    <Typography>{!!hanhChinh.ngaySinh ? format(new Date(hanhChinh.ngaySinh), "dd/MM/yyyy") : ""}</Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Giới tính</Typography>
                    <Typography>{hanhChinh.gioiTinh}</Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Nghề nghiệp</Typography>
                    <Typography>{!!hanhChinh.ngheNghiep ? hanhChinh.ngheNghiep : <i>(trống)</i>}</Typography>
                </Grid>
            </Grid>
            <Grid container sx={{ pt: 1 }} spacing={3}>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Dân tộc</Typography>
                    <Typography>{!!hanhChinh.danToc ? hanhChinh.danToc : <i>(trống)</i>}</Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Quốc tịch</Typography>
                    <Typography>{hanhChinh.quocTich}</Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Số CMND/CCCD/SSN</Typography>
                    <Typography>{!!hanhChinh.soCCCD ? hanhChinh.soCCCD : <i>(trống)</i>}</Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Điện thoại</Typography>
                    <Typography>
                        {!!hanhChinh.dienThoai 
                            ? (hanhChinh.dienThoai.length > 10 
                                ? UtilsText.mask(hanhChinh.dienThoai, "#### ### ####") 
                                : UtilsText.mask(hanhChinh.dienThoai, "#### ### ###")
                            ) : <i>(trống)</i>}
                    </Typography>
                </Grid>
            </Grid>
            <Grid container sx={{ pt: 1 }} spacing={3}>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Nơi làm việc</Typography>
                    <Typography>{!!hanhChinh.noiLamViec ? hanhChinh.noiLamViec : <i>(trống)</i>}</Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Đối tượng</Typography>
                    <Typography>{hanhChinh.doiTuong}</Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Số nhà</Typography>
                    <Typography>{!!hanhChinh.soNha ? hanhChinh.soNha : <i>(trống)</i>}</Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Thôn/Phố</Typography>
                    <Typography>{!!hanhChinh.thonPho ? hanhChinh.thonPho : <i>(trống)</i>}</Typography>
                </Grid>
            </Grid>
            <Grid container sx={{ pt: 1 }} spacing={3}>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Tỉnh/Thành phố</Typography>
                    <Typography>{!!hanhChinh.tinhTP ? hanhChinh.tinhTP : <i>(trống)</i>}</Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Quận/Huyện</Typography>
                    <Typography>{!!hanhChinh.quanHuyen ? hanhChinh.quanHuyen : <i>(trống)</i>}</Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Phường/Xã</Typography>
                    <Typography>{!!hanhChinh.phuongXa ? hanhChinh.phuongXa : <i>(trống)</i>}</Typography>
                </Grid>
            </Grid>
            <Divider sx={{ mt: 2, mb: 2 }}/>

            <Typography color="#999"><i>Thông tin BHYT</i></Typography>
            <Grid container sx={{ pt: 1 }} spacing={3}>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Số thẻ BHYT</Typography>
                    <Typography>{!!hanhChinh.soTheBHYT ? UtilsText.mask(hanhChinh.soTheBHYT, "# ## ### ### ####") : <i>(trống)</i>}</Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Nơi đăng ký KCB ban đầu</Typography>
                    <Typography>{!!hanhChinh.noiDangKyKCBBanDau ? hanhChinh.noiDangKyKCBBanDau : <i>(trống)</i>}</Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Giá trị từ</Typography>
                    <Typography>{!!hanhChinh.giaTriTu ? format(new Date(hanhChinh.giaTriTu), "dd/MM/yyyy") : <i>(trống)</i>}</Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Giá trị đến</Typography>
                    <Typography>{!!hanhChinh.giaTriDen ? format(new Date(hanhChinh.giaTriDen), "dd/MM/yyyy") : <i>(trống)</i>}</Typography>
                </Grid>
            </Grid>
            <Divider sx={{ mt: 2, mb: 2 }}/>

            <Typography color="#999"><i>Thông tin người nhà bệnh nhân (khi cần báo tin)</i></Typography>
            <Grid container sx={{ pt: 1 }} spacing={3}>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Họ tên</Typography>
                    <Typography>{!!hanhChinh.nguoiNha.hoTen ? hanhChinh.nguoiNha.hoTen : <i>(trống)</i>}</Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Quan hệ với bệnh nhân</Typography>
                    <Typography>{!!hanhChinh.nguoiNha.quanHeVoiBenhNhan ? hanhChinh.nguoiNha.quanHeVoiBenhNhan : <i>(trống)</i>}</Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Điện thoại</Typography>
                    <Typography>{!!hanhChinh.nguoiNha.dienThoai ? hanhChinh.nguoiNha.dienThoai : <i>(trống)</i>}</Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Địa chỉ</Typography>
                    <Typography>{!!hanhChinh.nguoiNha.diaChi ? hanhChinh.nguoiNha.diaChi : <i>(trống)</i>}</Typography>
                </Grid>
            </Grid>
        </Box>
    )
}

export default BoxHanhChinh;
import React from "react";
import { Box, Grid, Typography, Divider } from "@mui/material";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { UtilsText } from "../../utils";

const BoxHanhChinh = () => {
    const { hanhChinh } = useSelector(state => state.HSBA);

    return (
        <Box>
            <Grid container columnSpacing={3} rowSpacing={1}>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Họ và tên</Typography>
                    <Typography>
                        {!!hanhChinh.hoTen ? hanhChinh.hoTen : <Typography component="span">(<i>trống</i>)</Typography>}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Ngày sinh</Typography>
                    <Typography>
                        {!!hanhChinh.ngaySinh ? format(new Date(hanhChinh.ngaySinh), "dd/MM/yyyy") 
                            : <Typography component="span">(<i>trống</i>)</Typography>}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Giới tính</Typography>
                    <Typography>{hanhChinh.gioiTinh}</Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Nghề nghiệp</Typography>
                    <Typography>
                        {!!hanhChinh.ngheNghiep ? hanhChinh.ngheNghiep : <Typography component="span">(<i>trống</i>)</Typography>}
                    </Typography>
                </Grid>
            </Grid>
            <Grid container sx={{ pt: 1 }} columnSpacing={3} rowSpacing={1}>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Dân tộc</Typography>
                    <Typography>
                        {!!hanhChinh.danToc ? hanhChinh.danToc : <Typography component="span">(<i>trống</i>)</Typography>}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Quốc tịch</Typography>
                    <Typography>{hanhChinh.quocTich}</Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Số CMND/CCCD/SSN</Typography>
                    <Typography>
                        {!!hanhChinh.soCCCD ? hanhChinh.soCCCD : <Typography component="span">(<i>trống</i>)</Typography>}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Điện thoại</Typography>
                    <Typography>
                        {!!hanhChinh.dienThoai 
                            ? (hanhChinh.dienThoai.length > 10 
                                ? UtilsText.mask(hanhChinh.dienThoai, "#### ### ####") 
                                : UtilsText.mask(hanhChinh.dienThoai, "#### ### ###")
                            ) : <Typography component="span">(<i>trống</i>)</Typography>}
                    </Typography>
                </Grid>
            </Grid>
            <Grid container sx={{ pt: 1 }} columnSpacing={3} rowSpacing={1}>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Nơi làm việc</Typography>
                    <Typography>
                        {!!hanhChinh.noiLamViec ? hanhChinh.noiLamViec : <Typography component="span">(<i>trống</i>)</Typography>}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Đối tượng</Typography>
                    <Typography>{hanhChinh.doiTuong}</Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Số nhà</Typography>
                    <Typography>
                        {!!hanhChinh.soNha ? hanhChinh.soNha : <Typography component="span">(<i>trống</i>)</Typography>}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Thôn/Phố</Typography>
                    <Typography>
                        {!!hanhChinh.thonPho ? hanhChinh.thonPho : <Typography component="span">(<i>trống</i>)</Typography>}
                    </Typography>
                </Grid>
            </Grid>
            <Grid container sx={{ pt: 1 }} columnSpacing={3} rowSpacing={1}>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Tỉnh/Thành phố</Typography>
                    <Typography>
                        {!!hanhChinh.tinhTP ? hanhChinh.tinhTP : <Typography component="span">(<i>trống</i>)</Typography>}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Quận/Huyện</Typography>
                    <Typography>
                        {!!hanhChinh.quanHuyen ? hanhChinh.quanHuyen : <Typography component="span">(<i>trống</i>)</Typography>}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Phường/Xã</Typography>
                    <Typography>
                        {!!hanhChinh.phuongXa ? hanhChinh.phuongXa : <Typography component="span">(<i>trống</i>)</Typography>}
                    </Typography>
                </Grid>
            </Grid>
            <Divider sx={{ mt: 2, mb: 2 }}/>

            <Typography color="#999"><i>Thông tin BHYT</i></Typography>
            <Grid container sx={{ pt: 1 }} columnSpacing={3} rowSpacing={1}>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Số thẻ BHYT</Typography>
                    <Typography>
                        {!!hanhChinh.soTheBHYT ? UtilsText.mask(hanhChinh.soTheBHYT, "# ## ### ### ####") 
                            : <Typography component="span">(<i>trống</i>)</Typography>}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Nơi đăng ký KCB ban đầu</Typography>
                    <Typography>
                        {!!hanhChinh.noiDangKyKCBBanDau ? hanhChinh.noiDangKyKCBBanDau 
                            : <Typography component="span">(<i>trống</i>)</Typography>}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Giá trị từ</Typography>
                    <Typography>
                        {!!hanhChinh.giaTriTu ? format(new Date(hanhChinh.giaTriTu), "dd/MM/yyyy") 
                            : <Typography component="span">(<i>trống</i>)</Typography>}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Giá trị đến</Typography>
                    <Typography>
                        {!!hanhChinh.giaTriDen ? format(new Date(hanhChinh.giaTriDen), "dd/MM/yyyy") 
                            : <Typography component="span">(<i>trống</i>)</Typography>}
                    </Typography>
                </Grid>
            </Grid>
            <Divider sx={{ mt: 2, mb: 2 }}/>

            <Typography color="#999"><i>Thông tin người nhà bệnh nhân (khi cần báo tin)</i></Typography>
            <Grid container sx={{ pt: 1 }} columnSpacing={3} rowSpacing={1}>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Họ tên</Typography>
                    <Typography>
                        {!!hanhChinh.nguoiNha.hoTen ? hanhChinh.nguoiNha.hoTen 
                            : <Typography component="span">(<i>trống</i>)</Typography>}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Quan hệ với bệnh nhân</Typography>
                    <Typography>
                        {!!hanhChinh.nguoiNha.quanHeVoiBenhNhan ? hanhChinh.nguoiNha.quanHeVoiBenhNhan 
                            : <Typography component="span">(<i>trống</i>)</Typography>}
                    </Typography>
                </Grid>
            </Grid>

            <Grid container sx={{ pt: 1 }} columnSpacing={3} rowSpacing={1}>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Số CMND/CCCD/hộ chiếu</Typography>
                    <Typography>
                        {!!hanhChinh.nguoiNha.soCCCD ? hanhChinh.nguoiNha.soCCCD 
                            : <Typography component="span">(<i>trống</i>)</Typography>}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Điện thoại</Typography>
                    <Typography>
                        {!!hanhChinh.nguoiNha.dienThoai ? hanhChinh.nguoiNha.dienThoai 
                            : <Typography component="span">(<i>trống</i>)</Typography>}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Địa chỉ</Typography>
                    <Typography>
                        {!!hanhChinh.nguoiNha.diaChi ? hanhChinh.nguoiNha.diaChi 
                            : <Typography component="span">(<i>trống</i>)</Typography>}
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    )
}

export default BoxHanhChinh;
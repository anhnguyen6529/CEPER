import { Box, Grid, Typography, Divider, TextField, Select, MenuItem } from "@mui/material";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import DatePicker from '@mui/lab/DatePicker';
import CLocal from "../../constants/local.json";
import { HSBAActions } from "../../redux/slices/HSBA.slice";
import { Button } from "../common";
import { makeStyles } from "@mui/styles";
import "../../styles/index.css";

const useStyles = makeStyles(() => ({
    select: {
        marginTop: 8
    },
}))

const FHanhChinh = () => {
    const classes = useStyles();
    const benhNhan = useSelector((state) => state.HSBA);
    // const { role } = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const [hoTen, setHoTen] = useState(benhNhan.hanhChinh.hoTen);
    const [ngaySinh, setNgaySinh] = useState(benhNhan.hanhChinh.ngaySinh);
    const [gioiTinh, setGioiTinh] = useState(benhNhan.hanhChinh.gioiTinh);
    const [ngheNghiep, setNgheNghiep] = useState(benhNhan.hanhChinh.ngheNghiep);
    const [danToc, setDanToc] = useState(benhNhan.hanhChinh.danToc);
    const [quocTich, setQuocTich] = useState(benhNhan.hanhChinh.quocTich);
    const [soCCCD, setSoCCCD] = useState(benhNhan.hanhChinh.soCCCD);
    const [dienThoai, setDienThoai] = useState(benhNhan.hanhChinh.dienThoai);
    const [noiLamViec, setNoiLamViec] = useState(benhNhan.hanhChinh.noiLamViec);
    const [soNha, setSoNha] = useState(benhNhan.hanhChinh.soNha);
    const [thonPho, setThonPho] = useState(benhNhan.hanhChinh.thonPho);
    const [phuongXa, setPhuongXa] = useState(benhNhan.hanhChinh.phuongXa);
    const [quanHuyen, setQuanHuyen] = useState(benhNhan.hanhChinh.quanHuyen);
    const [tinhTP, setTinhTP] = useState(benhNhan.hanhChinh.tinhTP);
    const [doiTuong, setDoiTuong] = useState(benhNhan.hanhChinh.doiTuong);
    const [soTheBHYT, setSoTheBHYT] = useState(benhNhan.hanhChinh.soTheBHYT);
    const [noiDangKyKCBBanDau, setNoiDangKyKCBBanDau] = useState(benhNhan.hanhChinh.noiDangKyKCBBanDau);
    const [giaTriTu, setGiaTriTu] = useState(benhNhan.hanhChinh.giaTriTu);
    const [giaTriDen, setGiaTriDen] = useState(benhNhan.hanhChinh.giaTriDen);
    const [hoTenNguoiNha, setHoTenNguoiNha] = useState(benhNhan.hanhChinh.nguoiNha.hoTen);
    const [quanHeVoiBenhNhan, setQuanHeVoiBenhNhan] = useState(benhNhan.hanhChinh.nguoiNha.quanHeVoiBenhNhan);
    const [diaChiNguoiNha, setDiaChiNguoiNha] = useState(benhNhan.hanhChinh.nguoiNha.diaChi);
    const [dienThoaiNguoiNha, setDienThoaiNguoiNha] = useState(benhNhan.hanhChinh.nguoiNha.dienThoai);

    const [hasChanged, setHasChanged] = useState(false);

    const handleSave = () => {
        dispatch(HSBAActions.updateBenhNhanSection([
            { name: 'hoTen', value: hoTen },
            { name: 'ngaySinh', value: ngaySinh.toString() },
            { name: 'gioiTinh', value: gioiTinh },
            { name: 'ngheNghiep', value: ngheNghiep },
            { name: 'danToc', value: danToc },
            { name: 'quocTich', value: quocTich },
            { name: 'soCCCD', value: soCCCD },
            { name: 'dienThoai', value: dienThoai },
            { name: 'noiLamViec', value: noiLamViec },
            { name: 'soNha', value: soNha },
            { name: 'thonPho', value: thonPho },
            { name: 'phuongXa', value: phuongXa },
            { name: 'quanHuyen', value: quanHuyen },
            { name: 'tinhTP', value: tinhTP },
            { name: 'doiTuong', value: doiTuong },
            { name: 'soTheBHYT', value: soTheBHYT },
            { name: 'noiDangKyKCBBanDau', value: noiDangKyKCBBanDau },
            { name: 'giaTriTu', value: giaTriTu.toString() },
            { name: 'giaTriDen', value: giaTriDen.toString() },
            { name: 'nguoiNha', value: { hoTen: hoTenNguoiNha, quanHeVoiBenhNhan: quanHeVoiBenhNhan, diaChi: diaChiNguoiNha, dienThoai: dienThoaiNguoiNha } },
        ]))
        setHasChanged(false);
    }

    const handleReset = () => {
        setHasChanged(false);
    }

    const handleChange = () => {
        if (!hasChanged) {
            setHasChanged(true);
        }
    }

    return (
        <Box component="form" noValidate>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Họ và tên</Typography>
                    <TextField 
                        fullWidth
                        margin="dense"
                        value={hoTen}
                        onChange={(event) => {
                            setHoTen(event.target.value);
                            handleChange();
                        }}
                        error={!hoTen}
                        helperText={!hoTen ? "Vui lòng nhập họ tên" : ""}
                        disabled
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Ngày sinh</Typography>
                    <DatePicker
                        value={ngaySinh}
                        onChange={(newValue) => {
                            setNgaySinh(newValue);
                            handleChange();
                        }}
                        renderInput={(params) => <TextField fullWidth {...params} className={classes.select}/>}
                        inputFormat="DD/MM/yyyy"
                        disabled 
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Giới tính</Typography>
                    <Select
                        fullWidth
                        value={gioiTinh}
                        onChange={(event) => {
                            setGioiTinh(event.target.value);
                            handleChange();
                        }}
                        className={classes.select}
                        disabled
                    >
                        <MenuItem value="Nam">Nam</MenuItem>
                        <MenuItem value="Nữ">Nữ</MenuItem>
                    </Select>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Nghề nghiệp</Typography>
                    <TextField 
                        fullWidth
                        margin="dense"
                        multiline
                        value={ngheNghiep}
                        onChange={(event) => {
                            setNgheNghiep(event.target.value);
                            handleChange();
                        }}
                        error={!ngheNghiep}
                        helperText={!ngheNghiep ? "Vui lòng nhập nghề nghiệp" : ""}
                        disabled
                    />
                </Grid>
            </Grid>
            <Grid container sx={{ pt: 1 }} spacing={3}>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Dân tộc</Typography>
                    <TextField 
                        fullWidth
                        margin="dense"
                        multiline
                        value={danToc}
                        onChange={(event) => {
                            setDanToc(event.target.value);
                            handleChange();
                        }}
                        error={!danToc}
                        helperText={!danToc ? "Vui lòng nhập dân tộc" : ""}
                        disabled
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Quốc tịch</Typography>
                    <Select
                        fullWidth
                        value={quocTich}
                        onChange={(event) => {
                            setQuocTich(event.target.value);
                            handleChange();
                        }}
                        className={classes.select}
                        disabled
                    >
                        <MenuItem value="Việt Nam">Việt Nam</MenuItem>
                        <MenuItem value="Hoa Kỳ">Hoa Kỳ</MenuItem>
                    </Select>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Số CMND/CCCD/SSN</Typography>
                    <TextField 
                        fullWidth
                        margin="dense"
                        multiline
                        value={soCCCD}
                        onChange={(event) => {
                            setSoCCCD(event.target.value);
                            handleChange();
                        }}
                        error={!soCCCD}
                        helperText={!soCCCD ? "Vui lòng nhập số CMND/CCCD/SSN" : ""}
                        disabled
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Điện thoại</Typography>
                    <TextField  
                        fullWidth
                        margin="dense"
                        multiline
                        value={dienThoai}
                        onChange={(event) => {
                            setDienThoai(event.target.value);
                            handleChange();
                        }}
                        error={!dienThoai}
                        helperText={!dienThoai ? "Vui lòng nhập điện thoại" : ""}
                        disabled
                    />
                </Grid>
            </Grid>
            <Grid container sx={{ pt: 1 }} spacing={3}>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Nơi làm việc</Typography>
                    <TextField 
                        fullWidth
                        margin="dense"
                        multiline
                        value={noiLamViec}
                        onChange={(event) => {
                            setNoiLamViec(event.target.value);
                            handleChange();
                        }}
                        disabled
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Đối tượng</Typography>
                    <Select
                        fullWidth
                        value={doiTuong}
                        onChange={(event) => {
                            setDoiTuong(event.target.value);
                            handleChange();
                        }}
                        className={classes.select}
                        disabled
                    >   
                        <MenuItem value="BHYT">BHYT</MenuItem>
                        <MenuItem value="Thu phí">Thu phí</MenuItem>
                        <MenuItem value="Miễn">Miễn</MenuItem>
                        <MenuItem value="Khác">Khác</MenuItem>
                    </Select>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Số nhà</Typography>
                    <TextField 
                        fullWidth
                        margin="dense"
                        multiline
                        value={soNha}
                        onChange={(event) => {
                            setSoNha(event.target.value);
                            handleChange();
                        }}
                        disabled
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Thôn/Phố</Typography>
                    <TextField 
                        fullWidth
                        margin="dense"
                        multiline
                        value={thonPho}
                        onChange={(event) => {
                            setThonPho(event.target.value); 
                            handleChange();
                        }}
                        disabled
                    />
                </Grid>
            </Grid>
            <Grid container sx={{ pt: 1 }} spacing={3}>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Tỉnh/Thành phố</Typography>
                    <Select
                        fullWidth
                        value={tinhTP}
                        onChange={(event) => {
                            setTinhTP(event.target.value);
                            setQuanHuyen("-- Quận/Huyện --");
                            setPhuongXa("-- Phường/Xã --");
                            handleChange();
                        }}
                        className={classes.select}
                        disabled
                    >
                        {CLocal.map((province, id) => (
                            <MenuItem value={province.name} key={id}>{province.name}</MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Quận/Huyện</Typography>
                    <Select
                        fullWidth
                        value={quanHuyen}
                        onChange={(event) => {
                            setQuanHuyen(event.target.value);
                            setPhuongXa("-- Phường/Xã --");
                            handleChange();
                        }}
                        className={classes.select}
                        disabled
                    >
                        <MenuItem value="-- Quận/Huyện --">-- Quận/Huyện --</MenuItem>
                        {CLocal.find((element) => element.name === tinhTP).districts.map((district, id) => (
                            <MenuItem value={district.name} key={id}>{district.name}</MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Phường/Xã</Typography>
                    <Select
                        fullWidth
                        value={phuongXa}
                        onChange={(event) => {
                            setPhuongXa(event.target.value);
                            handleChange();
                        }}
                        className={classes.select}
                        disabled
                    >
                        <MenuItem value="-- Phường/Xã --">-- Phường/Xã --</MenuItem>
                        {quanHuyen !== "-- Quận/Huyện --" &&
                            CLocal.find((element) => element.name === tinhTP).districts
                                .find((element) => element.name === quanHuyen).wards.map((ward, id) => (
                                <MenuItem value={ward.name} key={id}>{ward.name}</MenuItem>
                            ))
                        }
                    </Select>
                </Grid>
            </Grid>
            <Divider sx={{ mt: 2, mb: 2 }}/>

            <Typography color="#999"><i>Thông tin BHYT</i></Typography>
            <Grid container sx={{ pt: 1 }} spacing={3}>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Số thẻ BHYT</Typography>
                    <TextField 
                        fullWidth
                        margin="dense"
                        multiline
                        value={soTheBHYT}
                        onChange={(event) => {
                            setSoTheBHYT(event.target.value);
                            handleChange();
                        }}
                        disabled
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Nơi đăng ký KCB ban đầu</Typography>
                    <TextField 
                        fullWidth
                        margin="dense"
                        multiline
                        value={noiDangKyKCBBanDau}
                        onChange={(event) => {
                            setNoiDangKyKCBBanDau(event.target.value);
                            handleChange();
                        }}
                        disabled
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Giá trị từ</Typography>
                    <DatePicker
                        value={giaTriTu}
                        onChange={(newValue) => {
                            setGiaTriTu(newValue);
                            handleChange();
                        }}
                        renderInput={(params) => <TextField {...params} fullWidth className={classes.select} />}
                        inputFormat="DD/MM/yyyy"
                        disabled 
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Giá trị đến</Typography>
                    <DatePicker
                        value={giaTriDen}
                        onChange={(newValue) => {
                            setGiaTriDen(newValue);
                            handleChange();
                        }}
                        renderInput={(params) => <TextField {...params} fullWidth className={classes.select} />}
                        inputFormat="DD/MM/yyyy"
                        disabled 
                    />
                </Grid>
            </Grid>
            <Divider sx={{ mt: 2, mb: 2 }}/>

            <Typography color="#999"><i>Thông tin người nhà bệnh nhân (khi cần báo tin)</i></Typography>
            <Grid container sx={{ pt: 1 }} spacing={3}>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Họ tên</Typography>
                    <TextField 
                        fullWidth
                        margin="dense"
                        multiline
                        value={hoTenNguoiNha}
                        onChange={(event) => {
                            setHoTenNguoiNha(event.target.value);
                            handleChange();
                        }}
                        disabled
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Quan hệ với bệnh nhân</Typography>
                    <TextField 
                        fullWidth
                        margin="dense"
                        multiline
                        value={quanHeVoiBenhNhan}
                        onChange={(event) => {
                            setQuanHeVoiBenhNhan(event.target.value);
                            handleChange();
                        }}
                        disabled
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Điện thoại</Typography>
                    <TextField 
                        fullWidth
                        margin="dense"
                        multiline
                        value={dienThoaiNguoiNha}
                        onChange={(event) => {
                            setDienThoaiNguoiNha(event.target.value);
                            handleChange();
                        }}
                        disabled
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography fontWeight="bold">Địa chỉ</Typography>
                    <TextField 
                        fullWidth
                        margin="dense"
                        multiline
                        value={diaChiNguoiNha}
                        onChange={(event) => {
                            setDiaChiNguoiNha(event.target.value);
                            handleChange();
                        }}
                        disabled
                    />
                </Grid>
            </Grid>

            {hasChanged &&
                <Box sx={{ width: '100%', textAlign: 'right', mt: 2 }}>
                    <Button variant="outlined" sx={{ mr: 2 }} onClick={handleReset}>
                        Hủy
                    </Button>

                    <Button variant="primary" onClick={handleSave}>
                        Lưu tạm thời
                    </Button>
                </Box>
            }
        </Box>
    )
}

export default FHanhChinh;

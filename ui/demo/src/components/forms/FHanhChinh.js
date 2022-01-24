import { Box, Grid, Typography, Button, Divider, TextField, Select, MenuItem } from "@mui/material";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import CLocal from "../../constants/local.json";
import { HSBAActions } from "../../redux/slices/HSBA.slice";
import { Save } from "@mui/icons-material";

const FHanhChinh = ({ setEdit }) => {
    const benhNhan = useSelector((state) => state.HSBA);
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
        setEdit(false);
    }

    return (
        <Box component="form" noValidate>
            <Grid container sx={{ mt: 2 }}>
                <Grid item xs={3}>
                    <Typography fontWeight="bold">Họ và tên</Typography>
                    <TextField 
                        margin="normal"
                        multiline
                        value={hoTen}
                        onChange={(event) => setHoTen(event.target.value)}
                        sx={{ width: '90%' }}
                        error={!hoTen}
                        helperText={!hoTen ? "Vui lòng nhập họ tên" : ""}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Typography fontWeight="bold">Ngày sinh</Typography>
                    <LocalizationProvider dateAdapter={AdapterDateFns} >
                        <DatePicker
                            value={ngaySinh}
                            onChange={(newValue) => setNgaySinh(newValue)}
                            renderInput={(params) => <TextField {...params} sx={{ width: '90%', mt: 2 }}/>}
                            inputFormat="dd/MM/yyyy"
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={3}>
                    <Typography fontWeight="bold">Giới tính</Typography>
                    <Select
                        value={gioiTinh}
                        onChange={(event) => setGioiTinh(event.target.value)}
                        sx={{ width: '90%', mt: 2 }}
                    >
                        <MenuItem value="Nam">Nam</MenuItem>
                        <MenuItem value="Nữ">Nữ</MenuItem>
                    </Select>
                </Grid>
                <Grid item xs={3}>
                    <Typography fontWeight="bold">Nghề nghiệp</Typography>
                    <TextField 
                        margin="normal"
                        multiline
                        value={ngheNghiep}
                        onChange={(event) => setNgheNghiep(event.target.value)}
                        sx={{ width: '90%' }}
                        error={!ngheNghiep}
                        helperText={!ngheNghiep ? "Vui lòng nhập nghề nghiệp" : ""}
                    />
                </Grid>
            </Grid>
            <Grid container sx={{ mt: 1 }}>
                <Grid item xs={3}>
                    <Typography fontWeight="bold">Dân tộc</Typography>
                    <TextField 
                        margin="normal"
                        multiline
                        value={danToc}
                        onChange={(event) => setDanToc(event.target.value)}
                        sx={{ width: '90%' }}
                        error={!danToc}
                        helperText={!danToc ? "Vui lòng nhập dân tộc" : ""}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Typography fontWeight="bold">Quốc tịch</Typography>
                    <Select
                        multiline
                        value={quocTich}
                        onChange={(event) => setQuocTich(event.target.value)}
                        sx={{ width: '90%', mt: 2 }}
                    >

                        <MenuItem value="Việt Nam">Việt Nam</MenuItem>
                        <MenuItem value="Hoa Kỳ">Hoa Kỳ</MenuItem>
                    </Select>
                </Grid>
                <Grid item xs={3}>
                    <Typography fontWeight="bold">Số CMND/CCCD/SSN</Typography>
                    <TextField 
                        margin="normal"
                        multiline
                        value={soCCCD}
                        onChange={(event) => setSoCCCD(event.target.value)}
                        sx={{ width: '90%' }}
                        error={!soCCCD}
                        helperText={!soCCCD ? "Vui lòng nhập số CMND/CCCD/SSN" : ""}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Typography fontWeight="bold">Điện thoại</Typography>
                    <TextField 
                        margin="normal"
                        multiline
                        value={dienThoai}
                        onChange={(event) => setDienThoai(event.target.value)}
                        sx={{ width: '90%' }}
                        error={!dienThoai}
                        helperText={!dienThoai ? "Vui lòng nhập điện thoại" : ""}
                    />
                </Grid>
            </Grid>
            <Grid container sx={{ mt: 1 }}>
                <Grid item xs={3}>
                    <Typography fontWeight="bold">Nơi làm việc</Typography>
                    <TextField 
                        margin="normal"
                        multiline
                        value={noiLamViec}
                        onChange={(event) => setNoiLamViec(event.target.value)}
                        sx={{ width: '90%' }}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Typography fontWeight="bold">Đối tượng</Typography>
                    <Select
                        multiline
                        value={doiTuong}
                        onChange={(event) => setDoiTuong(event.target.value)}
                        sx={{ width: '90%', mt: 2 }}
                    >   
                        <MenuItem value="BHYT">BHYT</MenuItem>
                        <MenuItem value="Thu phí">Thu phí</MenuItem>
                        <MenuItem value="Miễn">Miễn</MenuItem>
                        <MenuItem value="Khác">Khác</MenuItem>
                    </Select>
                </Grid>
                <Grid item xs={3}>
                    <Typography fontWeight="bold">Số nhà</Typography>
                    <TextField 
                        margin="normal"
                        multiline
                        value={soNha}
                        onChange={(event) => setSoNha(event.target.value)}
                        sx={{ width: '90%' }}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Typography fontWeight="bold">Thôn/Phố</Typography>
                    <TextField 
                        margin="normal"
                        multiline
                        value={thonPho}
                        onChange={(event) => setThonPho(event.target.value)}
                        sx={{ width: '90%' }}
                    />
                </Grid>
            </Grid>
            <Grid container sx={{ mt: 1 }}>
                <Grid item xs={3}>
                    <Typography fontWeight="bold">Tỉnh/Thành phố</Typography>
                    <Select
                        value={tinhTP}
                        multiline
                        onChange={(event) => {
                            setTinhTP(event.target.value);
                            setQuanHuyen("-- Quận/Huyện --");
                            setPhuongXa("-- Phường/Xã --");
                        }}
                        sx={{ width: '90%', mt: 2 }}
                    >
                        {CLocal.map((province, id) => (
                            <MenuItem value={province.name} key={id}>{province.name}</MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid item xs={3}>
                    <Typography fontWeight="bold">Quận/Huyện</Typography>
                    <Select
                        multiline
                        value={quanHuyen}
                        onChange={(event) => {
                            setQuanHuyen(event.target.value);
                            setPhuongXa("-- Phường/Xã --");
                        }}
                        sx={{ width: '90%', mt: 2 }}
                    >
                        <MenuItem value="-- Quận/Huyện --">-- Quận/Huyện --</MenuItem>
                        {CLocal.find((element) => element.name === tinhTP).districts.map((district, id) => (
                            <MenuItem value={district.name} key={id}>{district.name}</MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid item xs={3}>
                    <Typography fontWeight="bold">Phường/Xã</Typography>
                    <Select
                        multiline
                        value={phuongXa}
                        onChange={(event) => setPhuongXa(event.target.value)}
                        sx={{ width: '90%', mt: 2 }}
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
            <Grid container sx={{ mt: 1 }}>
                <Grid item xs={3}>
                    <Typography fontWeight="bold">Số thẻ BHYT</Typography>
                    <TextField 
                        margin="normal"
                        multiline
                        value={soTheBHYT}
                        onChange={(event) => setSoTheBHYT(event.target.value)}
                        sx={{ width: '90%' }}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Typography fontWeight="bold">Nơi đăng ký KCB ban đầu</Typography>
                    <TextField 
                        margin="normal"
                        multiline
                        value={noiDangKyKCBBanDau}
                        onChange={(event) => setNoiDangKyKCBBanDau(event.target.value)}
                        sx={{ width: '90%' }}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Typography fontWeight="bold">Giá trị từ</Typography>
                    <LocalizationProvider dateAdapter={AdapterDateFns} >
                        <DatePicker
                            value={giaTriTu}
                            onChange={(newValue) => setGiaTriTu(newValue)}
                            renderInput={(params) => <TextField {...params} sx={{ width: '90%', mt: 2 }} />}
                            inputFormat="dd/MM/yyyy"
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={3}>
                    <Typography fontWeight="bold">Giá trị đến</Typography>
                    <LocalizationProvider dateAdapter={AdapterDateFns} >
                        <DatePicker
                            value={giaTriDen}
                            onChange={(newValue) => setGiaTriDen(newValue)}
                            renderInput={(params) => <TextField {...params} sx={{ width: '90%', mt: 2 }} />}
                            inputFormat="dd/MM/yyyy"
                        />
                    </LocalizationProvider>
                </Grid>
            </Grid>
            <Divider sx={{ mt: 2, mb: 2 }}/>

            <Typography color="#999"><i>Thông tin người nhà bệnh nhân (khi cần báo tin)</i></Typography>
            <Grid container sx={{ mt: 1 }}>
                <Grid item xs={3}>
                    <Typography fontWeight="bold">Họ tên</Typography>
                    <TextField 
                        margin="normal"
                        multiline
                        value={hoTenNguoiNha}
                        onChange={(event) => setHoTenNguoiNha(event.target.value)}
                        sx={{ width: '90%' }}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Typography fontWeight="bold">Quan hệ với bệnh nhân</Typography>
                    <TextField 
                        margin="normal"
                        multiline
                        value={quanHeVoiBenhNhan}
                        onChange={(event) => setQuanHeVoiBenhNhan(event.target.value)}
                        sx={{ width: '90%' }}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Typography fontWeight="bold">Điện thoại</Typography>
                    <TextField 
                        margin="normal"
                        multiline
                        value={dienThoaiNguoiNha}
                        onChange={(event) => setDienThoaiNguoiNha(event.target.value)}
                        sx={{ width: '90%' }}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Typography fontWeight="bold">Địa chỉ</Typography>
                    <TextField 
                        margin="normal"
                        multiline
                        value={diaChiNguoiNha}
                        onChange={(event) => setDiaChiNguoiNha(event.target.value)}
                        sx={{ width: '90%' }}
                    />
                </Grid>
            </Grid>

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

export default FHanhChinh;

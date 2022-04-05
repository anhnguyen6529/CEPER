import { Box, Grid, Typography, Divider, TextField, Select, MenuItem, Paper, FormControl, FormHelperText } from "@mui/material";
import React, { forwardRef, useContext } from "react";
import DatePicker from '@mui/lab/DatePicker';
import CLocal from "../../../constants/local.json";
import CCountries from "../../../constants/countries.json";
import "../../../styles/index.css";
import MaskedInput from "react-text-mask";
import TaoHSBAContext from "../../../contexts/TaoHSBAContext";

const MaskedInputCustom = forwardRef(function MaskedInputCustom(props, ref) {
    return (
        <MaskedInput
            {...props}
            mask={[/[1-5]/, ' ', /[Dd\d]/, /[BbNn\d]/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]}
        />
    )
});

const FHanhChinh = () => {
    const { values, setValues, hasChangedNew, setHasChangedNew, submitted } = useContext(TaoHSBAContext);

    return (
        <Paper sx={{ px: 3, pb: 2, pt: 1.5, mb: 2 }}>
            <Typography fontWeight="bold" color="primary" sx={{ mb: 2 }}>Hành chính</Typography>
            <Box component="form">
                <Grid container columnSpacing={3} rowSpacing={1}>
                    <Grid item xs={12} md={6} lg={3}>
                        <Typography fontWeight="bold">Họ và tên*</Typography>
                        <TextField 
                            fullWidth
                            margin="dense"
                            value={values.hoTen}
                            onChange={({ target: { value } }) => {
                                setValues({ ...values, hoTen: value.replace(/[0-9]/g, '') });
                                if (!!value && !hasChangedNew) {
                                    setHasChangedNew(true);
                                }
                            }}
                            error={submitted && !values.hoTen}
                            helperText={submitted && !values.hoTen ? "Vui lòng nhập Họ và tên" : ""} 
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <Typography fontWeight="bold">Ngày sinh*</Typography>
                        <DatePicker
                            value={values.ngaySinh}
                            onChange={(newValue) => {
                                setValues({ ...values, ngaySinh: newValue });
                                if (!!newValue && !hasChangedNew) {
                                    setHasChangedNew(true);
                                }
                            }}
                            renderInput={(params) => 
                                <TextField 
                                    fullWidth 
                                    {...params} 
                                    margin="dense"
                                    error={submitted && !values.ngaySinh}
                                    helperText={submitted && !values.ngaySinh ? "Vui lòng nhập Ngày sinh" : ""}
                                />
                            }
                            inputFormat="DD/MM/yyyy"
                            disableFuture
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <Typography fontWeight="bold">Giới tính*</Typography>
                        <FormControl sx={{ width: "100%" }}>
                            <Select
                                fullWidth
                                sx={{ mt: 1 }}
                                value={values.gioiTinh}
                                onChange={({ target: { value } }) => {
                                    setValues({ ...values, gioiTinh: value });
                                    if (!!value && !hasChangedNew) {
                                        setHasChangedNew(true);
                                    }
                                }}
                                error={submitted && !values.gioiTinh}
                                displayEmpty
                                renderValue={(select) => !select ? "-- Chọn --" : select}
                            >
                                <MenuItem value="Nam">Nam</MenuItem>
                                <MenuItem value="Nữ">Nữ</MenuItem>
                            </Select>
                            <FormHelperText error>{submitted && !values.gioiTinh ? "Vui lòng nhập Giới tính" : ""}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <Typography fontWeight="bold">Nghề nghiệp*</Typography>
                        <TextField 
                            fullWidth
                            margin="dense"
                            multiline
                            value={values.ngheNghiep}
                            onChange={({ target: { value } }) => {
                                setValues({ ...values, ngheNghiep: value.replace(/[0-9]/g, '') });
                                if (!!value && !hasChangedNew) {
                                    setHasChangedNew(true);
                                }
                            }}
                            error={submitted && !values.ngheNghiep}
                            helperText={submitted && !values.ngheNghiep ? "Vui lòng nhập Nghề nghiệp" : ""}
                        />
                    </Grid>
                </Grid>
                <Grid container sx={{ pt: 1 }} columnSpacing={3} rowSpacing={1}>
                    <Grid item xs={12} md={6} lg={3}>
                        <Typography fontWeight="bold">Dân tộc*</Typography>
                        <TextField 
                            fullWidth
                            margin="dense"
                            multiline
                            value={values.danToc}
                            onChange={({ target: { value } }) => {
                                setValues({ ...values, danToc: value.replace(/[0-9]/g, '') });
                                if (!!value && !hasChangedNew) {
                                    setHasChangedNew(true);
                                }
                            }}
                            error={submitted && !values.danToc}
                            helperText={submitted && !values.danToc ? "Vui lòng nhập Dân tộc" : ""}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <Typography fontWeight="bold">Quốc tịch*</Typography>
                        <Select
                            fullWidth
                            sx={{ mt: 1 }}
                            value={values.quocTich}
                            onChange={({ target: { value } }) => {
                                setValues({ ...values, quocTich: value });
                                if (!hasChangedNew) {
                                    setHasChangedNew(true);
                                }
                            }}
                            displayEmpty
                            renderValue={(select) => !select ? "-- Chọn --" : select}
                        >
                            <MenuItem value="" disabled>-- Chọn --</MenuItem>
                            {CCountries.map(country => country.name).sort().map((cname, id) => (
                                <MenuItem value={cname} key={id}>{cname}</MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <Typography fontWeight="bold">Số CMND/CCCD/hộ chiếu*</Typography>
                        <TextField 
                            fullWidth
                            margin="dense"
                            multiline
                            value={values.soCCCD}
                            onChange={({ target: { value } }) => {
                                setValues({ ...values, soCCCD: value.replace(/[^0-9]/g, '') });
                                if (!!value && !hasChangedNew) {
                                    setHasChangedNew(true);
                                }
                            }}
                            error={submitted && !values.soCCCD}
                            helperText={submitted && !values.soCCCD ? "Vui lòng nhập Số CMND/CCCD/hộ chiếu" : ""}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <Typography fontWeight="bold">Điện thoại</Typography>
                        <TextField  
                            fullWidth
                            margin="dense"
                            multiline
                            value={values.dienThoai}
                            onChange={({ target: { value } }) => {
                                setValues({ ...values, dienThoai: value.replace(/[^0-9]/g, '') });
                                if (!!value && !hasChangedNew) {
                                    setHasChangedNew(true);
                                }
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid container sx={{ pt: 1 }} columnSpacing={3} rowSpacing={1}>
                    <Grid item xs={12} md={6} lg={3}>
                        <Typography fontWeight="bold">Nơi làm việc</Typography>
                        <TextField 
                            fullWidth
                            margin="dense"
                            multiline
                            value={values.noiLamViec}
                            onChange={({ target: { value } }) => {
                                setValues({ ...values, noiLamViec: value });
                                if (!!value && !hasChangedNew) {
                                    setHasChangedNew(true);
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <Typography fontWeight="bold">Đối tượng*</Typography>
                        <FormControl sx={{ width: "100%" }}>
                            <Select
                                fullWidth
                                sx={{ mt: 1 }}
                                value={values.doiTuong}
                                onChange={({ target: { value } }) => {
                                    setValues({ ...values, doiTuong: value });
                                    if (!!value && !hasChangedNew) {
                                        setHasChangedNew(true);
                                    }
                                }}
                                error={submitted && !values.doiTuong}
                                displayEmpty
                                renderValue={(select) => !select ? "-- Chọn --" : select}
                            >   
                                <MenuItem value="BHYT">BHYT</MenuItem>
                                <MenuItem value="Thu phí">Thu phí</MenuItem>
                                <MenuItem value="Miễn">Miễn</MenuItem>
                                <MenuItem value="Khác">Khác</MenuItem>
                            </Select>
                            <FormHelperText error>{submitted && !values.doiTuong ? "Vui lòng nhập Đối tượng" : ""}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <Typography fontWeight="bold">Số nhà</Typography>
                        <TextField 
                            fullWidth
                            margin="dense"
                            multiline
                            value={values.soNha}
                            onChange={({ target: { value } }) => {
                                setValues({ ...values, soNha: value });
                                if (!!value && !hasChangedNew) {
                                    setHasChangedNew(true);
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <Typography fontWeight="bold">Thôn/Phố</Typography>
                        <TextField 
                            fullWidth
                            margin="dense"
                            multiline
                            value={values.thonPho}
                            onChange={({ target: { value } }) => {
                                setValues({ ...values, thonPho: value });
                                if (!!value && !hasChangedNew) {
                                    setHasChangedNew(true);
                                }
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid container sx={{ pt: 1 }} columnSpacing={3} rowSpacing={1}>
                    <Grid item xs={12} md={6} lg={3}>
                        <Typography fontWeight="bold">Tỉnh/Thành phố*</Typography>
                        <FormControl sx={{ width: "100%" }}>
                            <Select
                                fullWidth
                                sx={{ mt: 1 }}
                                value={values.tinhTP}
                                onChange={({ target: { value } }) => {
                                    setValues({ ...values, tinhTP: value, quanHuyen: "", phuongXa: "" });
                                    if (!!value && !hasChangedNew) {
                                        setHasChangedNew(true);
                                    }
                                }}
                                error={submitted && !values.tinhTP}
                                displayEmpty
                                renderValue={(select) => !select ? "-- Chọn --" : select}
                            >
                                <MenuItem value="" disabled>-- Chọn --</MenuItem>
                                {CLocal.map((province, id) => (
                                    <MenuItem value={province.name} key={id}>{province.name}</MenuItem>
                                ))}
                            </Select>
                            <FormHelperText error>{submitted && !values.tinhTP ? "Vui lòng nhập Tỉnh/Thành phố" : ""}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <Typography fontWeight="bold">Quận/Huyện*</Typography>
                        <FormControl sx={{ width: "100%" }}>
                            <Select
                                fullWidth
                                sx={{ mt: 1 }}
                                value={values.quanHuyen}
                                onChange={({ target: { value } }) => {
                                    setValues({ ...values, quanHuyen: value, phuongXa: "" });
                                    if (!!value && !hasChangedNew) {
                                        setHasChangedNew(true);
                                    }
                                }}
                                error={submitted && !values.quanHuyen}
                                displayEmpty
                                renderValue={(select) => !select ? "-- Chọn --" : select}
                            >
                                <MenuItem value="" disabled>-- Chọn --</MenuItem>
                                {!!values.tinhTP && CLocal.find((element) => element.name === values.tinhTP).districts.map((district, id) => (
                                    <MenuItem value={district.name} key={id}>{district.name}</MenuItem>
                                ))}
                            </Select>
                            <FormHelperText error>{submitted && !values.quanHuyen ? "Vui lòng nhập Quận/Huyện" : ""}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <Typography fontWeight="bold">Phường/Xã*</Typography>
                        <FormControl sx={{ width: "100%" }}>
                            <Select
                                fullWidth
                                sx={{ mt: 1 }}
                                value={values.phuongXa}
                                onChange={({ target: { value } }) => {
                                    setValues({ ...values, phuongXa: value });
                                    if (!!value && !hasChangedNew) {
                                        setHasChangedNew(true);
                                    }
                                }}
                                error={submitted && !values.phuongXa}
                                displayEmpty
                                renderValue={(select) => !select ? "-- Chọn --" : select}
                            >
                                <MenuItem value="" disabled>-- Chọn --</MenuItem>
                                {(!!values.tinhTP && !!values.quanHuyen) &&
                                    CLocal.find((element) => element.name === values.tinhTP).districts
                                        .find((element) => element.name === values.quanHuyen).wards.map((ward, id) => (
                                        <MenuItem value={ward.name} key={id}>{ward.name}</MenuItem>
                                    ))
                                }
                            </Select>
                            <FormHelperText error>{submitted && !values.phuongXa ? "Vui lòng nhập Phường/Xã" : ""}</FormHelperText>
                        </FormControl>
                    </Grid>
                </Grid>
                <Divider sx={{ mt: 2, mb: 2 }}/>

                <Typography color="#999"><i>Thông tin BHYT</i></Typography>
                <Grid container sx={{ pt: 1 }} columnSpacing={3} rowSpacing={1}>
                    <Grid item xs={12} md={6} lg={3}>
                        <Typography fontWeight="bold">Số thẻ BHYT</Typography>
                        <TextField 
                            fullWidth
                            margin="dense"
                            multiline
                            value={values.soTheBHYT}
                            onChange={({ target: { value } }) => {
                                setValues({ ...values, soTheBHYT: value.toUpperCase() });
                                if (!!value && !hasChangedNew) {
                                    setHasChangedNew(true);
                                }
                            }}
                            InputProps={{ inputComponent: MaskedInputCustom }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <Typography fontWeight="bold">Nơi đăng ký KCB ban đầu</Typography>
                        <TextField 
                            fullWidth
                            margin="dense"
                            multiline
                            value={values.noiDangKyKCBBanDau}
                            onChange={({ target: { value } }) => {
                                setValues({ ...values, noiDangKyKCBBanDau: value });
                                if (!!value && !hasChangedNew) {
                                    setHasChangedNew(true);
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <Typography fontWeight="bold">Giá trị từ</Typography>
                        <DatePicker
                            value={values.giaTriTu}
                            onChange={(newValue) => {
                                setValues({ ...values, giaTriTu: newValue });
                                if (!!newValue && !hasChangedNew) {
                                    setHasChangedNew(true);
                                }
                            }}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                            inputFormat="DD/MM/yyyy"
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <Typography fontWeight="bold">Giá trị đến</Typography>
                        <DatePicker
                            value={values.giaTriDen}
                            onChange={(newValue) => {
                                setValues({ ...values, giaTriDen: newValue });
                                if (!!newValue && !hasChangedNew) {
                                    setHasChangedNew(true);
                                }
                            }}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                            inputFormat="DD/MM/yyyy"
                        />
                    </Grid>
                </Grid>
                <Divider sx={{ mt: 2, mb: 2 }}/>

                <Typography color="#999"><i>Thông tin người nhà bệnh nhân (khi cần báo tin)</i></Typography>
                <Grid container sx={{ pt: 1 }} columnSpacing={3} rowSpacing={1}>
                    <Grid item xs={12} md={6} lg={3}>
                        <Typography fontWeight="bold">Họ tên</Typography>
                        <TextField 
                            fullWidth
                            margin="dense"
                            multiline
                            value={values.nguoiNha.hoTen}
                            onChange={({ target: { value } }) => {
                                setValues({ ...values, nguoiNha: { ...values.nguoiNha, hoTen: value.replace(/[0-9]/g, '') } });
                                if (!!value && !hasChangedNew) {
                                    setHasChangedNew(true);
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <Typography fontWeight="bold">Quan hệ với bệnh nhân</Typography>
                        <TextField 
                            fullWidth
                            margin="dense"
                            multiline
                            value={values.nguoiNha.quanHeVoiBenhNhan}
                            onChange={({ target: { value } }) => {
                                setValues({ ...values, nguoiNha: { ...values.nguoiNha, quanHeVoiBenhNhan: value } });
                                if (!!value && !hasChangedNew) {
                                    setHasChangedNew(true);
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <Typography fontWeight="bold">Điện thoại</Typography>
                        <TextField 
                            fullWidth
                            margin="dense"
                            multiline
                            value={values.nguoiNha.dienThoai}
                            onChange={({ target: { value } }) => {
                                setValues({ ...values, nguoiNha: { ...values.nguoiNha, dienThoai: value.replace(/[^0-9]/g, '') } });
                                if (!!value && !hasChangedNew) {
                                    setHasChangedNew(true);
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <Typography fontWeight="bold">Địa chỉ</Typography>
                        <TextField 
                            fullWidth
                            margin="dense"
                            multiline
                            value={values.nguoiNha.diaChi}
                            onChange={({ target: { value } }) => {
                                setValues({ ...values, nguoiNha: { ...values.nguoiNha, diaChi: value } });
                                if (!!value && !hasChangedNew) {
                                    setHasChangedNew(true);
                                }
                            }}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    )
}

export default FHanhChinh;

import { Box, Grid, Typography, Divider, TextField, Select, MenuItem, Paper, FormControl, FormHelperText } from "@mui/material";
import React, { forwardRef, useContext } from "react";
import DatePicker from '@mui/lab/DatePicker';
import CLocal from "../../../constants/local.json";
import CCountries from "../../../constants/countries.json";
import "../../../styles/index.css";
import MaskedInput from "react-text-mask";
import TaoHSBAContext from "../../../contexts/TaoHSBAContext";
import validator from "validator";
import { UtilsDateTime } from "../../../utils";

const MaskedInputCustom = forwardRef(function MaskedInputCustom(props, ref) {
    return (
        <MaskedInput
            {...props}
            mask={[/[1-5]/, ' ', /[Dd\d]/, /[BbNn\d]/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]}
        />
    )
});

const FHanhChinh = () => {
    const { values, setValues, errors, setErrors, hasChangedNew, setHasChangedNew, submitted } = useContext(TaoHSBAContext);

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
                                if (!!value) {
                                    if (!hasChangedNew) {
                                        setHasChangedNew(true);
                                    }
                                    setErrors({ ...errors, hoTen: "" });
                                } else {
                                    setErrors({ ...errors, hoTen: "Vui lòng nhập Họ và tên" });
                                }
                            }}
                            error={submitted && !!errors.hoTen}
                            helperText={submitted ? errors.hoTen : ""} 
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <Typography fontWeight="bold">Ngày sinh*</Typography>
                        <DatePicker
                            value={values.ngaySinh}
                            onChange={(newValue) => {
                                setValues({ ...values, ngaySinh: newValue });
                                if (!!newValue) {
                                    if (!hasChangedNew) {
                                        setHasChangedNew(true);
                                    }
                                    if (UtilsDateTime.getAge(newValue) >= 14) {
                                        setErrors({ ...errors, ngaySinh: "", soCCCD: "Vui lòng nhập Số CMND/CCCD/hộ chiếu" });
                                    } else {
                                        setErrors({ ...errors, ngaySinh: "", soCCCD: "" });
                                    }
                                } else {
                                    setErrors({ ...errors, ngaySinh: "Vui lòng nhập Ngày sinh" });
                                }
                            }}
                            renderInput={(params) => 
                                <TextField 
                                    fullWidth 
                                    {...params} 
                                    margin="dense"
                                    error={submitted && !!errors.ngaySinh}
                                    helperText={submitted ? errors.ngaySinh : ""}
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
                                    if (!!value) {
                                        if (!hasChangedNew) {
                                            setHasChangedNew(true);
                                        }
                                        setErrors({ ...errors, gioiTinh: "" });
                                    } else {
                                        setErrors({ ...errors, gioiTinh: "Vui lòng nhập Giới tính" });
                                    }
                                }}
                                error={submitted && !!errors.gioiTinh}
                                displayEmpty
                                renderValue={(select) => !select ? "-- Chọn --" : select}
                            >
                                <MenuItem value="Nam">Nam</MenuItem>
                                <MenuItem value="Nữ">Nữ</MenuItem>
                            </Select>
                            <FormHelperText error>{submitted ? errors.gioiTinh : ""}</FormHelperText>
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
                                if (!!value) {
                                    if (!hasChangedNew) {
                                        setHasChangedNew(true);
                                    }
                                    setErrors({ ...errors, ngheNghiep: "" });
                                } else {
                                    setErrors({ ...errors, ngheNghiep: "Vui lòng nhập Nghề nghiệp" });
                                }
                            }}
                            error={submitted && !!errors.ngheNghiep}
                            helperText={submitted ? errors.ngheNghiep : ""}
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
                                if (!!value) {
                                    if (!hasChangedNew) {
                                        setHasChangedNew(true);
                                    }
                                    setErrors({ ...errors, danToc: "" });
                                } else {
                                    setErrors({ ...errors, danToc: "Vui lòng nhập Dân tộc" });
                                }
                            }}
                            error={submitted && !!errors.danToc}
                            helperText={submitted ? errors.danToc : ""}
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
                            {CCountries.map(country => country.name).sort().map((cname, id) => (
                                <MenuItem value={cname} key={id}>{cname}</MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <Typography fontWeight="bold">
                            Số CMND/CCCD/hộ chiếu
                            {!values.ngaySinh || (!!values.ngaySinh && UtilsDateTime.getAge(values.ngaySinh) >= 14)
                                ? <Typography component="span">*</Typography> : null}
                        </Typography>
                        <TextField 
                            fullWidth
                            margin="dense"
                            multiline
                            value={values.soCCCD}
                            onChange={({ target: { value } }) => {
                                setValues({ ...values, soCCCD: value.replace(/[^0-9]/g, '') });
                                if (!!value) {
                                    if (!hasChangedNew) {
                                        setHasChangedNew(true);
                                    }
                                    setErrors({ ...errors, soCCCD: "" });
                                } else {
                                    if (!values.ngaySinh || (!!values.ngaySinh && UtilsDateTime.getAge(values.ngaySinh) >= 14)) {
                                        setErrors({ ...errors, soCCCD: "Vui lòng nhập Số CMND/CCCD/hộ chiếu" });
                                    }
                                }
                            }}
                            error={submitted && !!errors.soCCCD}
                            helperText={submitted ? errors.soCCCD : ""}
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
                                if (!!value) {
                                    if (!hasChangedNew) {
                                        setHasChangedNew(true);
                                    }
                                    if (!validator.isMobilePhone(value, "vi-VN")) {
                                        setErrors({ ...errors, dienThoai: "Điện thoại không hợp lệ" });
                                    } else {
                                        setErrors({ ...errors, dienThoai: "" });
                                    }
                                }
                            }}
                            error={!!errors.dienThoai}
                            helperText={errors.dienThoai}
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
                                    if (!!value) {
                                        if (!hasChangedNew) {
                                            setHasChangedNew(true);
                                        }
                                        if (value === "BHYT") {
                                            setErrors({ 
                                                ...errors, 
                                                doiTuong: "", 
                                                soTheBHYT: "Vui lòng nhập Số thẻ BHYT",
                                                noiDangKyKCBBanDau: "Vui lòng nhập Nơi đăng ký KCB ban đầu",
                                                giaTriTu: "Vui lòng nhập Giá trị từ",
                                                giaTriDen: "Vui lòng nhập Giá trị đến"
                                            });
                                        } else {
                                            setErrors({ ...errors, doiTuong: "", soTheBHYT: "", noiDangKyKCBBanDau: "", giaTriTu: "", giaTriDen: "" });
                                        }
                                    } else {
                                        setErrors({ ...errors, doiTuong: "Vui lòng nhập Đối tượng" });
                                    }
                                }}
                                error={submitted && !!errors.doiTuong}
                                displayEmpty
                                renderValue={(select) => !select ? "-- Chọn --" : select}
                            >   
                                <MenuItem value="BHYT">BHYT</MenuItem>
                                <MenuItem value="Thu phí">Thu phí</MenuItem>
                                <MenuItem value="Miễn">Miễn</MenuItem>
                                <MenuItem value="Khác">Khác</MenuItem>
                            </Select>
                            <FormHelperText error>{submitted ? errors.doiTuong : ""}</FormHelperText>
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
                                    if (!!value) {
                                        if (!hasChangedNew) {
                                            setHasChangedNew(true);
                                        }
                                        setErrors({ ...errors, tinhTP: "", quanHuyen: "Vui lòng nhập Quận/Huyện", phuongXa: "Vui lòng nhập Phường/Xã" });
                                    } else {
                                        setErrors({ ...errors, tinhTP: "Vui lòng nhập Tỉnh/Thành phố" });
                                    }
                                }}
                                error={submitted && !!errors.tinhTP}
                                displayEmpty
                                renderValue={(select) => !select ? "-- Chọn --" : select}
                            >
                                <MenuItem value="" disabled>-- Chọn --</MenuItem>
                                {CLocal.sort((a, b) => { return a.name === b.name ? 0 : (a.name < b.name ? -1 : 1) }).map((province, id) => (
                                    <MenuItem value={province.name} key={id}>{province.name}</MenuItem>
                                ))}
                            </Select>
                            <FormHelperText error>{submitted ? errors.tinhTP : ""}</FormHelperText>
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
                                    if (!!value) {
                                        if (!hasChangedNew) {
                                            setHasChangedNew(true);
                                        } 
                                        setErrors({ ...errors, quanHuyen: "", phuongXa: "Vui lòng nhập Phường/Xã" });
                                    } else {
                                        setErrors({ ...errors, quanHuyen: "Vui lòng nhập Quận/Huyện" });
                                    }
                                }}
                                error={submitted && !!errors.quanHuyen}
                                displayEmpty
                                renderValue={(select) => !select ? "-- Chọn --" : select}
                            >
                                <MenuItem value="" disabled>-- Chọn --</MenuItem>
                                {!!values.tinhTP && CLocal.find((element) => element.name === values.tinhTP).districts.sort((a, b) => 
                                { return a.name === b.name ? 0 : (a.name < b.name ? -1 : 1) }).map((district, id) => (
                                    <MenuItem value={district.name} key={id}>{district.name}</MenuItem>
                                ))}
                            </Select>
                            <FormHelperText error>{submitted ? errors.quanHuyen : ""}</FormHelperText>
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
                                    if (!!value) {
                                        if (!hasChangedNew) {
                                            setHasChangedNew(true);
                                        }
                                        setErrors({ ...errors, phuongXa: "" });
                                    } else {
                                        setErrors({ ...errors, phuongXa: "Vui lòng nhập Phường/Xã" });
                                    }
                                }}
                                error={submitted && !!errors.phuongXa}
                                displayEmpty
                                renderValue={(select) => !select ? "-- Chọn --" : select}
                            >
                                <MenuItem value="" disabled>-- Chọn --</MenuItem>
                                {(!!values.tinhTP && !!values.quanHuyen) &&
                                    CLocal.find((element) => element.name === values.tinhTP).districts
                                        .find((element) => element.name === values.quanHuyen).wards.sort((a, b) => 
                                        { return a.name === b.name ? 0 : (a.name < b.name ? -1 : 1) }).map((ward, id) => (
                                        <MenuItem value={ward.name} key={id}>{ward.name}</MenuItem>
                                    ))
                                }
                            </Select>
                            <FormHelperText error>{submitted ? errors.phuongXa : ""}</FormHelperText>
                        </FormControl>
                    </Grid>
                </Grid>
                <Divider sx={{ mt: 2, mb: 2 }}/>

                <Typography color="#999"><i>Thông tin BHYT</i></Typography>
                <Grid container sx={{ pt: 1 }} columnSpacing={3} rowSpacing={1}>
                    <Grid item xs={12} md={6} lg={3}>
                        <Typography fontWeight="bold">
                            Số thẻ BHYT
                            {values.doiTuong === "BHYT" ? <Typography component="span">*</Typography> : null}
                        </Typography>
                        <TextField 
                            fullWidth
                            margin="dense"
                            multiline
                            value={values.soTheBHYT}
                            onChange={({ target: { value } }) => {
                                setValues({ ...values, soTheBHYT: value.toUpperCase() });
                                if (!!value) {
                                    if (!hasChangedNew) {
                                        setHasChangedNew(true);
                                    }
                                    if (value.includes("_")) {
                                        setErrors({ ...errors, soTheBHYT: "Số thẻ BHYT không hợp lệ" });
                                    } else {
                                        setErrors({ ...errors, soTheBHYT: "" });
                                    }
                                } else {
                                    if (values.doiTuong === "BHYT") {
                                        setErrors({ ...errors, soTheBHYT: "Vui lòng nhập Số thẻ BHYT" });
                                    }
                                }
                            }}
                            InputProps={{ inputComponent: MaskedInputCustom }}
                            error={submitted && !!errors.soTheBHYT}
                            helperText={submitted ? errors.soTheBHYT : ""}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <Typography fontWeight="bold">
                            Nơi đăng ký KCB ban đầu
                            {values.doiTuong === "BHYT" ? <Typography component="span">*</Typography> : null}
                        </Typography>
                        <TextField 
                            fullWidth
                            margin="dense"
                            multiline
                            value={values.noiDangKyKCBBanDau}
                            onChange={({ target: { value } }) => {
                                setValues({ ...values, noiDangKyKCBBanDau: value });
                                if (!!value) {
                                    if (!hasChangedNew) {
                                        setHasChangedNew(true);
                                    }
                                    setErrors({ ...errors, noiDangKyKCBBanDau: "" });
                                } else {
                                    if (values.doiTuong === "BHYT") {
                                        setErrors({ ...errors, noiDangKyKCBBanDau: "Vui lòng nhập Nơi đăng ký KCB ban đầu" });
                                    }
                                }
                            }}
                            error={submitted && !!errors.noiDangKyKCBBanDau}
                            helperText={submitted ? errors.noiDangKyKCBBanDau : ""}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <Typography fontWeight="bold">
                            Giá trị từ
                            {values.doiTuong === "BHYT" ? <Typography component="span">*</Typography> : null}
                        </Typography>
                        <DatePicker
                            value={values.giaTriTu}
                            onChange={(newValue) => {
                                setValues({ ...values, giaTriTu: newValue });
                                if (!!newValue) {
                                    if (!hasChangedNew) {
                                        setHasChangedNew(true);
                                    }
                                    setErrors({ ...errors, giaTriTu: "" });
                                } else {
                                    if (values.doiTuong === "BHYT") {
                                        setErrors({ ...errors, giaTriTu: "Vui lòng nhập Giá trị từ" });
                                    }
                                }
                            }}
                            renderInput={(params) => 
                                <TextField 
                                    {...params} 
                                    fullWidth 
                                    error={submitted && !!errors.giaTriTu}
                                    helperText={submitted ? errors.giaTriTu : ""}
                                />
                            }
                            inputFormat="DD/MM/yyyy"
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <Typography fontWeight="bold">
                            Giá trị đến
                            {values.doiTuong === "BHYT" ? <Typography component="span">*</Typography> : null}
                        </Typography>
                        <DatePicker
                            value={values.giaTriDen}
                            onChange={(newValue) => {
                                setValues({ ...values, giaTriDen: newValue });
                                if (!!newValue) {
                                    if (!hasChangedNew) {
                                        setHasChangedNew(true);
                                    }
                                    if (new Date(values.giaTriTu) >= new Date(newValue)) {
                                        setErrors({ ...errors, giaTriDen: "Giá trị đến phải sau Giá trị từ" });
                                    } else { 
                                        setErrors({ ...errors, giaTriDen: "" });
                                    }
                                } else {
                                    if (values.doiTuong === "BHYT") {
                                        setErrors({ ...errors, giaTriDen: "Vui lòng nhập Giá trị đến" });
                                    }
                                }
                            }}
                            renderInput={(params) => 
                                <TextField 
                                    {...params} 
                                    fullWidth 
                                    error={submitted && !!errors.giaTriDen}
                                    helperText={submitted ? errors.giaTriDen : ""}
                                />
                            }
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
                        <Typography fontWeight="bold">Số CMND/CCCD/hộ chiếu</Typography>
                        <TextField 
                            fullWidth
                            margin="dense"
                            multiline
                            value={values.nguoiNha.soCCCD}
                            onChange={({ target: { value } }) => {
                                setValues({ ...values, nguoiNha: { ...values.nguoiNha, soCCCD: value.replace(/[^0-9]/g, '') } });
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
                                if (!!value) {
                                    if (!hasChangedNew) {
                                        setHasChangedNew(true);
                                    }
                                    if (!validator.isMobilePhone(value, "vi-VN")) {
                                        setErrors({ ...errors, nguoiNha: { ...values.nguoiNha, dienThoai: "Điện thoại không hợp lệ" } });
                                    } else {
                                        setErrors({ ...errors, nguoiNha: { ...values.nguoiNha, dienThoai: "" } });
                                    }
                                }
                            }}
                            error={!!errors.nguoiNha.dienThoai}
                            helperText={errors.nguoiNha.dienThoai}
                        />
                    </Grid>
                </Grid>

                <Grid container sx={{ pt: 1 }} columnSpacing={3} rowSpacing={1}>
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

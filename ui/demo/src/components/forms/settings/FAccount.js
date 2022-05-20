import { CancelOutlined, Save } from "@mui/icons-material";
import { Box, Grid, TextField, Typography } from "@mui/material";
import { format } from "date-fns";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../common";
import validator from "validator";
import authThunk from "../../../redux/thunks/auth.thunk";

const FAccount = ({ setHasSaved }) => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [hasChanged, setHasChanged] = useState(false);
    const [values, setValues] = useState({ email: user.email, phone: user.phone, address: user.address });
    const [errors, setErrors] = useState({ email: '', phone: '', address: '' });

    const handleCancel = () => {
        setHasChanged(false);
        setValues({ email: user.email, phone: user.phone, address: user.address });
        setErrors({ email: '', phone: '', address: '' });
    }

    const handleSave = () => {
        setHasChanged(false);
        setHasSaved(true);
        if (Object.values(errors).every(err => !err)) {
            dispatch(authThunk.updateUserInfo({ userID: user.id, email: values.email, phone: values.phone, address: values.address }));
        }
    }

    return (
        <Box>
            <Grid container rowSpacing={1} columnSpacing={3}>
                <Grid item xs={4}>
                    <Typography fontWeight="bold">Mã số</Typography>
                    <TextField 
                        margin="dense"
                        fullWidth
                        value={user.id}
                        disabled
                    />
                </Grid>
                <Grid item xs={4}>
                    <Typography fontWeight="bold">Tên đăng nhập</Typography>
                    <TextField 
                        margin="dense"
                        fullWidth
                        value={user.username}
                        disabled
                    />
                </Grid>
                <Grid item xs={4}>
                    <Typography fontWeight="bold">Tên người dùng</Typography>
                    <TextField 
                        margin="dense"
                        fullWidth
                        value={user.name}
                        disabled
                    />
                </Grid>
                {user.role !== "BN" ?
                    <Grid item xs={4}>
                        <Typography fontWeight="bold">Khoa công tác</Typography>
                        <TextField 
                            margin="dense"
                            fullWidth
                            multiline
                            value={user.department}
                            disabled
                        />
                    </Grid>
                : null}
                {user.role === "BS" ?
                    <Grid item xs={4}>
                        <Typography fontWeight="bold">Chuyên khoa</Typography>
                        <TextField 
                            margin="dense"
                            fullWidth
                            value={user.speciality}
                            disabled
                        />
                    </Grid>
                : null}
                <Grid item xs={4}>
                    <Typography fontWeight="bold">Ngày sinh</Typography>
                    <TextField 
                        margin="dense"
                        fullWidth
                        multiline
                        value={format(new Date(user.dateOfBirth), 'dd/MM/yyyy')}
                        disabled
                    />
                </Grid>
                <Grid item xs={4}>
                    <Typography fontWeight="bold">Giới tính</Typography>
                    <TextField 
                        margin="dense"
                        fullWidth
                        multiline
                        value={user.gender}
                        disabled
                    />
                </Grid>
                <Grid item xs={4}>
                    <Typography fontWeight="bold">Email</Typography>
                    <TextField 
                        margin="dense"
                        fullWidth
                        multiline
                        value={values.email}
                        onChange={({ target: { value } }) => {
                            if (!hasChanged) {
                                setHasChanged(true);
                            }
                            setValues({ ...values, email: value });
                            if (!!value && !validator.isEmail(value)) {
                                setErrors({ ...errors, email: "Email không hợp lệ" });
                            } else {
                                setErrors({ ...errors, email: "" });
                            }
                        }}
                        error={hasChanged && !!errors.email}
                        helperText={hasChanged ? errors.email : ""}
                    />
                </Grid>
                <Grid item xs={4}>
                    <Typography fontWeight="bold">Điện thoại</Typography>
                    <TextField 
                        margin="dense"
                        fullWidth
                        multiline
                        value={values.phone}
                        onChange={({ target: { value } }) => {
                            const repValue = value.replace(/[^0-9]/g, '');
                            if (!hasChanged) {
                                setHasChanged(true);
                            }
                            setValues({ ...values, phone: repValue });
                            if (!!repValue && !validator.isMobilePhone(repValue, "vi-VN")) {
                                setErrors({ ...errors, phone: "Điện thoại không hợp lệ" });
                            } else {
                                setErrors({ ...errors, phone: "" });
                            }
                        }}
                        error={hasChanged && !!errors.phone}
                        helperText={hasChanged ? errors.phone : ""}
                    />
                </Grid>
                <Grid item xs={4}>
                    <Typography fontWeight="bold">Địa chỉ</Typography>
                    <TextField 
                        margin="dense"
                        fullWidth
                        multiline
                        value={values.address}
                        onChange={({ target: { value } }) => {
                            if (!hasChanged) {
                                setHasChanged(true);
                            }
                            setValues({ ...values, address: value });
                        }}
                    />
                </Grid>
            </Grid>

            {hasChanged ? 
                <Box sx={{ width: '100%', textAlign: 'right' }}>
                    <Button startIcon={<CancelOutlined />} variant="outlined" sx={{ mr: 2 }} onClick={handleCancel}>
                        Hủy
                    </Button>
                    <Button startIcon={<Save />} variant="primary" onClick={handleSave} disabled={Object.values(errors).some(err => !!err)}>
                        Lưu
                    </Button>
                </Box>
            : null}
        </Box>
    )
}

export default FAccount;
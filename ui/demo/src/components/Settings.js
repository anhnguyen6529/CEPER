import { Check, Circle } from "@mui/icons-material";
import { Box, CircularProgress, Container, Divider, Grid, IconButton, Paper, Switch, Typography } from "@mui/material";
import { format } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserContext from "../contexts/UserContext";
import authThunk from "../redux/thunks/auth.thunk";
import "../styles/index.css";

const Settings = () => {
    const { handleLogout } = useContext(UserContext);
    const { user, settings } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    
    const [hasChangedAppearance, setHasChangedAppearance] = useState(false);
    const [hasChangedFunctionality, setHasChangedFunctionality] = useState(false);

    const ButtonColor = ({ color, ...others }) => {
        return (
            <IconButton 
                sx={{
                    border: (theme) => settings.appearance.accentColor === color ? `2px solid ${theme.palette[color].main}` : 'none',
                    p: '0.5px',
                    mr: 2
                }} 
                onClick={() => {
                    if (!hasChangedAppearance) {
                        setHasChangedAppearance(true);
                    }
                    dispatch(authThunk.changeAccentColor({ userID: user.id, color }));
                }}
                {...others}
            >
                <Circle color={color} fontSize="large" />
            </IconButton>
        )
    }

    useEffect(() => {
        if (settings.appearance.changingError === "Token has expired" || settings.functionality.changingError === "Token has expired") {
            handleLogout();
        }
        // eslint-disable-next-line
    }, [settings.appearance.changingError, settings.functionality.changingError]);

    return (
        <Container maxWidth={false} sx={{ pt: 3 }}>
            <Paper sx={{ px: 3, py: 2 }}>
                <Typography color={`${settings.appearance.accentColor}.dark`} variant="h5" fontWeight="bold">Cài đặt</Typography>

                <Box sx={{ mt: 3, mb: 2 }}>
                    <Typography color={`${settings.appearance.accentColor}.main`} fontWeight="bold">Tài khoản</Typography>
                    <Typography color="text.secondary">Thông tin tài khoản người dùng và thông tin cá nhân</Typography>
                    <Divider sx={{ my: 1 }} />

                    <Grid container sx={{ mt: 1 }} rowSpacing={1} columnSpacing={3}>
                        <Grid item xs={3}>
                            <Typography fontWeight="bold">Mã số</Typography>
                            <Typography>{user.id}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography fontWeight="bold">Tên đăng nhập</Typography>
                            <Typography>{user.username}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography fontWeight="bold">Tên người dùng</Typography>
                            <Typography>{user.name}</Typography>
                        </Grid>
                        {user.role === "BS" ?
                            <Grid item xs={3}>
                                <Typography fontWeight="bold">Chuyên khoa</Typography>
                                <Typography>{user.speciality}</Typography>
                            </Grid>
                        : null}
                    </Grid>
                    <Grid container sx={{ mt: 1 }} rowSpacing={1} columnSpacing={3}>
                        <Grid item xs={3}>
                            <Typography fontWeight="bold">Ngày sinh</Typography>
                            <Typography>{format(new Date(user.dateOfBirth), 'dd/MM/yyyy')}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography fontWeight="bold">Giới tính</Typography>
                            <Typography>{user.gender}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography fontWeight="bold">Email</Typography>
                            <Typography>{user.email}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography fontWeight="bold">Địa chỉ</Typography>
                            <Typography>{user.address}</Typography>
                        </Grid>
                    </Grid>
                </Box>

                <Box sx={{ mt: 3, mb: 2 }}>
                    <Grid container alignItems="center">
                        <Grid item xs={10}>
                            <Typography color={`${settings.appearance.accentColor}.main`} fontWeight="bold">Giao diện</Typography>
                            <Typography color="text.secondary">Thay đổi màu sắc giao diện hệ thống</Typography>
                        </Grid>
                        <Grid item xs={2} align="right">
                            {hasChangedAppearance && settings.appearance.changing
                                ? <CircularProgress size={18} sx={{ color: (theme) => theme.palette[settings.appearance.accentColor].main }} />
                                : (hasChangedAppearance ? <Check color="success" /> : null)
                            }
                        </Grid>
                    </Grid>
                    <Divider sx={{ mt: 1, mb: 2 }} />

                    <Typography>Chọn màu chủ đề</Typography>
                    <Box className="df" sx={{ mt: 1 }}>
                        <ButtonColor color="primary" />
                        <ButtonColor color="primaryGreen" />
                        <ButtonColor color="primaryPurple" />
                        <ButtonColor color="primaryRed" />
                        <ButtonColor color="primaryOrange" />
                    </Box>
                </Box>

                {user.role !== "BN" ?
                    <Box sx={{ mt: 3, mb: 2 }}>
                        <Grid container alignItems="center">
                            <Grid item xs={10}>
                                <Typography color={`${settings.appearance.accentColor}.main`} fontWeight="bold">Tính năng</Typography>
                                <Typography color="text.secondary">Thay đổi một số cài đặt cho các tính năng của hệ thống</Typography>
                            </Grid>
                            <Grid item xs={2} align="right">
                                {hasChangedFunctionality && settings.functionality.changing
                                    ? <CircularProgress size={18} sx={{ color: (theme) => theme.palette[settings.appearance.accentColor].main }} />
                                    : (hasChangedFunctionality ? <Check color="success" /> : null)
                                }
                            </Grid>
                        </Grid>
                        <Divider sx={{ mt: 1, mb: 2 }} />

                        <Grid container>
                            <Grid item xs={9}>
                                <Typography>Tự động cập nhật bệnh án với kết quả xử lý lỗi chính tả</Typography>
                                <Typography variant="subtitle2" color="text.secondary"></Typography>
                            </Grid>
                            <Grid item xs={3} align="right">
                                <Switch 
                                    edge="end" 
                                    color={settings.appearance.accentColor}
                                    checked={settings.functionality.autoUpdateWithProcessResult}
                                    onChange={({ target: { checked }}) => {
                                        if (!hasChangedFunctionality) {
                                            setHasChangedFunctionality(true);
                                        }
                                        dispatch(authThunk.toggleAutoUpdateWithProcessResult({ userID: user.id }));
                                    }} 
                                />
                            </Grid>
                        </Grid>
                    </Box>
                : null}
            </Paper>
        </Container>
    )
}

export default Settings;
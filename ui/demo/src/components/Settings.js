import { Check, Circle, Colorize } from "@mui/icons-material";
import { Box, Card, CardContent, CardHeader, CircularProgress, Container, Grid, IconButton, Paper, Popover, Switch, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { recommendPrimary } from "../App";
import UserContext from "../contexts/UserContext";
import authThunk from "../redux/thunks/auth.thunk";
import "../styles/index.css";
import { BoxAccount } from "./boxes";
import { Button } from "./common";
import { SketchPicker } from "react-color";

const ButtonColor = ({ accentColor, color, handleClick, ...others }) => {
    return (
        <IconButton 
            sx={{
                border: accentColor === color ? `2px solid ${color}` : 'none',
                p: '0.5px',
                mr: 2
            }} 
            onClick={handleClick}
            {...others}
        >
            <Circle sx={{ color: color }} fontSize="large"/>
        </IconButton>
    )
}

const Settings = () => {
    const { handleLogout } = useContext(UserContext);
    const { user, settings } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    
    const [hasChangedAppearance, setHasChangedAppearance] = useState(false);
    const [hasChangedFunctionality, setHasChangedFunctionality] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null); 
    const openColor = Boolean(anchorEl);

    useEffect(() => {
        if (settings.appearance.changingError === "Token has expired" || settings.functionality.changingError === "Token has expired") {
            handleLogout();
        }
        // eslint-disable-next-line
    }, [settings.appearance.changingError, settings.functionality.changingError]);

    const handleReset = () => {
        setHasChangedAppearance(true);
        dispatch(authThunk.changeAccentColor({ userID: user.id, color: "#009ABB" }));
        setHasChangedFunctionality(true);
        if (settings.functionality.autoUpdateWithProcessResult) {
            dispatch(authThunk.toggleAutoUpdateWithProcessResult({ userID: user.id }));
        }
    }

    const handleClickRecommendColor = (color) => {
        if (!hasChangedAppearance) {
            setHasChangedAppearance(true);
        }
        dispatch(authThunk.changeAccentColor({ userID: user.id, color }));
    }

    const handleClickColor = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleCloseColor = () => {
        setAnchorEl(null);
    }

    return (
        <Container maxWidth={false} sx={{ pt: 3 }}>
            <Paper sx={{ px: 3, py: 2 }}>
                <Typography color="primary" variant="h5" fontWeight="bold">Cài đặt</Typography>

                <Card sx={{ mt: 3, mb: 2 }}>
                    <CardHeader 
                        title="Tài khoản"
                        titleTypographyProps={{ fontWeight: "bold", color: "black" }}
                        subheader="Thông tin tài khoản người dùng và thông tin cá nhân"
                        subheaderTypographyProps={{ color: "black" }}
                        sx={{ bgcolor: "primary.light" }} 
                    />
                    <CardContent>
                        <BoxAccount />
                    </CardContent>
                </Card>

                <Card sx={{ mt: 3, mb: 2 }}>
                    <CardHeader 
                        title="Giao diện"
                        titleTypographyProps={{ fontWeight: "bold", color: "black" }}
                        subheader="Thay đổi màu sắc giao diện hệ thống"
                        subheaderTypographyProps={{ color: "black" }}
                        sx={{ bgcolor: "primary.light", '.MuiCardHeader-action': { alignSelf: "center", m: 0 } }} 
                        action={hasChangedAppearance && settings.appearance.changing
                            ? <CircularProgress size={18} color="primary" />
                            : (hasChangedAppearance ? <Check color="success" /> : null)
                        }
                    />
                    <CardContent>
                        <Typography>Chọn màu chủ đề</Typography>
                        <Box sx={{ mt: 1 }}>
                            {Object.keys(recommendPrimary).map((color, id) => 
                                <ButtonColor 
                                    key={id}
                                    accentColor={settings.appearance.accentColor} 
                                    color={color} 
                                    handleClick={() => handleClickRecommendColor(color)}
                                />
                            )}
                            <IconButton sx={{ p: 0.5, border: (theme) => `2px solid ${theme.palette.action.active}` }} onClick={handleClickColor}>
                                <Colorize />
                            </IconButton>
                            <Popover
                                open={openColor}
                                anchorEl={anchorEl}
                                onClose={handleCloseColor}
                                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                            >
                                <SketchPicker 
                                    color={settings.appearance.accentColor} 
                                    onChangeComplete={(color) => {
                                        if (!hasChangedAppearance) {
                                            setHasChangedAppearance(true);
                                        }
                                        dispatch(authThunk.changeAccentColor({ userID: user.id, color: color.hex.toUpperCase() }));
                                    }}
                                    presetColors={[]}
                                />
                            </Popover>
                        </Box>
                    </CardContent>
                </Card>

                {user.role !== "BN" ?
                    <Card sx={{ mt: 3, mb: 2 }}>
                        <CardHeader 
                            title="Tính năng"
                            titleTypographyProps={{ fontWeight: "bold", color: "black" }}
                            subheader="Thay đổi một số cài đặt cho các tính năng của hệ thống"
                            subheaderTypographyProps={{ color: "black" }}
                            sx={{ bgcolor: "primary.light", '.MuiCardHeader-action': { alignSelf: "center", m: 0 } }} 
                            action={hasChangedFunctionality && settings.functionality.changing
                                ? <CircularProgress size={18} color="primary" />
                                : (hasChangedFunctionality ? <Check color="success" /> : null)
                            }
                        />
                        <CardContent>
                            <Grid container columnSpacing={3}>
                                <Grid container item xs={6}>
                                    <Grid item xs={9}>
                                        <Typography>Tự động cập nhật bệnh án với kết quả xử lý lỗi chính tả</Typography>
                                        <Typography variant="subtitle2" color="text.secondary"></Typography>
                                    </Grid>
                                    <Grid item xs={3} align="right">
                                        <Switch 
                                            edge="end" 
                                            color="primary"
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
                            </Grid>
                        </CardContent>
                    </Card>
                : null}

                <Button sx={{ mt: 2 }} onClick={handleReset}>
                    Đặt lại các tùy chọn cài đặt
                </Button>
            </Paper>
        </Container>
    )
}

export default Settings;
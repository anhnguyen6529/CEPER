import { Box, Grid, Typography } from "@mui/material";
import { format } from "date-fns";
import React from "react";
import { useSelector } from "react-redux";

const BoxAccount = () => {
    const { user } = useSelector((state) => state.auth);

    return (
        <Box>
            <Grid container rowSpacing={1} columnSpacing={3}>
                <Grid item xs={2.4}>
                    <Typography fontWeight="bold">Mã số</Typography>
                    <Typography>{user.id}</Typography>
                </Grid>
                <Grid item xs={2.4}>
                    <Typography fontWeight="bold">Tên đăng nhập</Typography>
                    <Typography>{user.username}</Typography>
                </Grid>
                <Grid item xs={2.4}>
                    <Typography fontWeight="bold">Tên người dùng</Typography>
                    <Typography>{user.name}</Typography>
                </Grid>
                <Grid item xs={2.4}>
                    <Typography fontWeight="bold">Khoa công tác</Typography>
                    <Typography>{user.department}</Typography>
                </Grid>
                {user.role === "BS" ?
                    <Grid item xs={2.4}>
                        <Typography fontWeight="bold">Chuyên khoa</Typography>
                        <Typography>{user.speciality}</Typography>
                    </Grid>
                : null}
            </Grid>
            <Grid container sx={{ mt: 1 }} rowSpacing={1} columnSpacing={3}>
                <Grid item xs={2.4}>
                    <Typography fontWeight="bold">Ngày sinh</Typography>
                    <Typography>{format(new Date(user.dateOfBirth), 'dd/MM/yyyy')}</Typography>
                </Grid>
                <Grid item xs={2.4}>
                    <Typography fontWeight="bold">Giới tính</Typography>
                    <Typography>{user.gender}</Typography>
                </Grid>
                <Grid item xs={2.4}>
                    <Typography fontWeight="bold">Email</Typography>
                    <Typography>{user.email}</Typography>
                </Grid>
                <Grid item xs={2.4}>
                    <Typography fontWeight="bold">Điện thoại</Typography>
                    <Typography>{user.phone}</Typography>
                </Grid>
                <Grid item xs={2.4}>
                    <Typography fontWeight="bold">Địa chỉ</Typography>
                    <Typography>{user.address}</Typography>
                </Grid>
            </Grid>
        </Box>
    )
}

export default BoxAccount;
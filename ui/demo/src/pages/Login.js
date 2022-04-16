import React, { useState, useEffect } from "react";
import { makeStyles } from '@mui/styles';
import { Container, Grid, Typography, Button, Box, TextField, Link, FormHelperText, CircularProgress } from "@mui/material";
import { NavBar } from "../components/common";
import loginImg from "../images/login.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserInjured, faUserMd, faUserNurse } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import authApi from "../apis/auth";
import { useDispatch } from "react-redux";
import { authActions } from "../redux/slices/auth.slice";

const useStyles = makeStyles(() => ({
    root: {
        minHeight: `calc(100vh - 72px)`,
    },
    loginImg: {
        width: 500,
        marginTop: 100,
    },
    loginForm: {
        marginTop: 30,
        width: '80%',
        '& .MuiOutlinedInput-root': {
            paddingTop: '16.5px',
            paddingBottom: '16.5px'
        }
    }
}))

const roles = [
    [<FontAwesomeIcon icon={faUserMd} />, "Bác sĩ", "BS"], 
    [<FontAwesomeIcon icon={faUserNurse} />, "Điều dưỡng", "DD"], 
    [<FontAwesomeIcon icon={faUserInjured} />, "Bệnh nhân", "BN"]
];

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const classes = useStyles();
    const [clickedId, setClickedId] = useState(-1);
    const [login, setLogin] = useState({ error: '', role: '', username: '', password: '' });
    const [submitting, setSubmitting] = useState(false);

    const handleLogin = async () => {
        setSubmitting(true);

        try {
            const apiResponse = await authApi.login({ username: login.username.trim(), password: login.password, role: login.role });
            
            if (apiResponse.data.token) {
                localStorage.setItem('token', apiResponse.data.token);
                dispatch(authActions.updateUserFields({ ...apiResponse.data.user }));
                if (login.role === "BN") {
                    // get user pid => api
                    const pid = '123456';
                    navigate(`/user/HSBA/${pid}`);
                } else {
                    navigate('/user/HSBA');
                }  
            } else {
                setLogin({ ...login, error: "Thông tin đăng nhập không đúng. Vui lòng kiểm tra và nhập lại." });
            }
        } catch (error) {
            const err = error.toJSON();
            if (err.status === 401 || err.status === 404) {
                setLogin({ ...login, error: "Thông tin đăng nhập không đúng. Vui lòng kiểm tra và nhập lại." });
            } else {
                setLogin({ ...login, error: err.message });
            }
        } finally {
            setSubmitting(false);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!login.username || !login.password) {
            setLogin({ ...login, error: "Vui lòng nhập đầy đủ thông tin đăng nhập" });
        } else if (!login.role) {
            setLogin({ ...login, error: "Vui lòng chọn vai trò để đăng nhập" });
        } else {
            handleLogin();
        }
    }

    useEffect(() => {
        if (!!localStorage.getItem('token')) {
            if (login.role === "BN") {
                // get user pid => api
                const pid = '123456';
                navigate(`/user/HSBA/${pid}`);
            } else {
                navigate('/user/HSBA');
            } 
        }
        // eslint-disable-next-line
    }, []);

    return (
        <div className={classes.root}>
            <NavBar>
                <Link href="/" underline="none" color="inherit">
                    <Typography fontWeight="bold" color={(theme) => theme.palette.secondary.main}>Trang chủ</Typography>
                </Link>     
            </NavBar>
            <Container>
                <Grid container>
                    <Grid item xs={6}>
                        <Typography fontWeight="bold" sx={{ pt: '150px' }} fontSize={20}>
                            CHÀO MỪNG BẠN ĐẾN VỚI CEPER
                        </Typography>
                        
                        <div style={{ marginTop: 40 }}>
                            {roles.map((role, i) => (
                                <Button
                                    key={i}
                                    onClick={() => {
                                        setClickedId(i);
                                        setLogin({ ...login, role: role[2] });
                                    }}
                                    style={{
                                        color: i === clickedId ? 'white' : '#09425A',
                                        background: i === clickedId ? '#09425A' : 'white',
                                        textTransform: 'none',
                                        width: '25%',
                                        height: 40,
                                        border: i === clickedId ? 'none' : '1px solid #09425A',
                                        marginRight: 16,
                                        boxShadow: '0px 4px 4px 0px rgb(0, 0, 0, 0.25)'
                                    }}
                                    startIcon={role[0]}
                                >
                                    {role[1]}
                                </Button>
                            ))}
                        </div>

                        <Box className={classes.loginForm}>
                            <TextField 
                                margin="normal"
                                required
                                fullWidth
                                label="Tên đăng nhập"
                                name="username"
                                autoComplete="none"
                                sx={{ bgcolor: 'white' }}
                                value={login.username}
                                onChange={({ target: { value } }) => setLogin({ ...login, username: value })}
                            />

                            <TextField 
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Mật khẩu"
                                type="password"
                                sx={{ bgcolor: 'white' }}
                                value={login.password}
                                onChange={({ target: { value } }) => setLogin({ ...login, password: value })}
                            />

                            <Link 
                                href="#" 
                                style={{ color: "#009ABB", textDecoration: 'none' }}
                            >
                                <Typography variant="subtitle2" textAlign="right" mt={1} mb={2}>Quên mật khẩu</Typography>
                            </Link>
                                
                            <FormHelperText error sx={{ fontWeight: 'bold', textAlign: 'center' }}>{login.error}</FormHelperText>

                            {submitting ?
                                <Box className="df fdc aic">
                                    <CircularProgress color="secondary" size={28}/>
                                </Box> 
                            : null}

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ height: 42, fontWeight: 'bold', mt: 2 }}
                                onClick={handleSubmit}
                                disabled={submitting}
                            >
                                Đăng nhập
                            </Button>
                        </Box>
                    </Grid>

                    <Grid item xs={6} align="center">
                        <img src={loginImg} alt="" className={classes.loginImg}/>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}

export default Login;
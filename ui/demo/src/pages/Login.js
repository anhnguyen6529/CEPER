import React, { useState, useEffect } from "react";
import { makeStyles } from '@mui/styles';
import { Container, Grid, Typography, Button, Box, TextField, Link, FormHelperText, CircularProgress } from "@mui/material";
import { NavBar } from "../components/common";
import loginImg from "../images/login.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserInjured, faUserMd, faUserNurse } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../redux/slices/auth.slice";

const useStyles = makeStyles(() => ({
    root: {
        minHeight: `calc(100vh - 72px)`,
    },
    homeLink: {
        color: '#09425A'
    },
    loginImg: {
        width: 500,
        marginTop: 100,
    },
    greeting: {
        paddingTop: 150,
    }, 
    buttonGroup: {
        marginTop: 40
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
    useEffect(() => {
        if (!!localStorage.getItem('user')) {
            navigate('/user/HSBA');
        }
    });

    const classes = useStyles();
    const [clickedId, setClickedId] = useState(-1);
    
    
    const { login } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const onSubmit = () => {
        dispatch(authActions.login({ username: login.username, password: login.password, role: login.role }));
    }

    useEffect(() => {
        if (login.success) {
            setTimeout(() => {
                navigate('/user');
                localStorage.setItem('user', login.username);
            }, 1000);
        }
    });

    return (
        <div className={classes.root}>
            <NavBar>
                <Link href="/" underline="none" color="inherit">
                    <Typography fontWeight="bold" className={classes.homeLink}>Trang chủ</Typography>
                </Link>     
            </NavBar>
            <Container>
                <Grid container>
                    <Grid item xs={6}>
                        <Typography fontWeight="bold" className={classes.greeting} fontSize={20}>
                            CHÀO MỪNG BẠN ĐẾN VỚI CEPER
                        </Typography>
                        
                        <div className={classes.buttonGroup}>
                            {roles.map((role, i) => (
                                <Button
                                    key={i}
                                    onClick={() => {
                                        setClickedId(i);
                                        dispatch(authActions.updateLoginField({ field: 'role', value: role[2] }));
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
                                id="username"
                                label="Tên đăng nhập"
                                name="username"
                                style={{ background: 'white' }}
                                value={login.username}
                                onChange={(event) => {
                                    dispatch(authActions.updateLoginField({ field: 'username', value: event.target.value }))
                                }}
                            />

                            <TextField 
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Mật khẩu"
                                type="password"
                                id="password"
                                style={{ background: 'white' }}
                                value={login.password}
                                onChange={(event) => {
                                    dispatch(authActions.updateLoginField({ field: 'password', value: event.target.value }))
                                }}
                            />

                            <Link 
                                href="#" 
                                style={{ color: "#009ABB", textDecoration: 'none' }}
                            >
                                <Typography variant="subtitle2" textAlign="right" mt={1} mb={2}>Quên mật khẩu</Typography>
                            </Link>
                                
                            <FormHelperText error sx={{ fontWeight: 'bold', textAlign: 'center'}}>{login.error}</FormHelperText>

                            {login.success && 
                            <Box className="df fdc aic">
                                <CircularProgress color="secondary" size={28}/>
                            </Box> 
                            }

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ height: 42, fontWeight: 'bold', mt: 2 }}
                                onClick={onSubmit}
                                disabled={!!login.success}
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
import { createSlice } from "@reduxjs/toolkit";
import authThunk from "../thunks/auth.thunk";

const initialState = {
    user: {
        getting: false,
        error: '',
        username: '',
        avatar: '',
        role: 'BS',
        id: '000001',
        name: 'Trần Quốc A',
        dateOfBirth: '',
        gender: '',
        address: '',
        phone: '',
        email: '',
        speciality: '',
        position: 'Bác sĩ điều trị', // Trưởng khoa, Phó khoa, Bác sĩ điều trị, Điều dưỡng
        medicalLicenseNo: '',
        signature: ''
    },
    login: {
        username: '',
        password: '',
        error: '',
        success: false,
        role: '',
    }
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        updateLoginField: (state, action) => {
            return {
                ...state,
                login: {
                    ...state.login,
                    [action.payload.field]: action.payload.value
                }
            }
        },
        login: (state, action) => {
            if ((action.payload.username === 'user01' && action.payload.password === '123456' && action.payload.role === 'BS')
            || (action.payload.username === 'user02' && action.payload.password === '123456' && action.payload.role === 'DD')
            || (action.payload.username === 'user03' && action.payload.password === '123456' && action.payload.role === 'BN')
            ) 
            {
                state.login.error = '';
                state.login.success = true;
                state.user.username = action.payload.username;
                state.user.role = action.payload.role;

                if (action.payload.username === 'user02') {
                    state.user.name = 'Nguyễn Ngọc A';
                    state.user.id = '100001';
                }

                if (action.payload.username === 'user03') {
                    state.user.name = 'Nguyễn Văn A';
                    state.user.id = '123456';
                }
            } else {
                state.login.success = false;
                if (action.payload.username === '' || action.payload.password === '' || action.payload.role === '') {
                    state.login.error = 'Vui lòng nhập đầy đủ thông tin';
                } else {    
                    state.login.error = 'Tên đăng nhập và mật khẩu không đúng. Vui lòng kiểm tra và nhập lại.';
                }
            }
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(authThunk.getUserInfo.fulfilled, (state, action) => {
            return {
                ...state,
                user: {
                    ...state.user,
                    ...action.payload,
                    getting: false,
                }
            }
        })
        .addCase(authThunk.getUserInfo.pending, (state) => {
            return {
                ...state, 
                user: {
                    ...state.user,
                    getting: true
                }
            }
        })
        .addCase(authThunk.getUserInfo, (state, action) => {
            return {
                ...state,
                user: {
                    ...state.user,
                    getting: false,
                    error: action.payload
                }
            }
        })
    }
})

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;

export default authSlice;

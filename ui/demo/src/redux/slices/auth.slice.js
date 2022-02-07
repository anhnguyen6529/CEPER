import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: {
        username: 'user01',
        avatar: '',
        role: 'BS',
        name: 'Trần Quốc A'        
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
            if (action.payload.username === 'user01' && action.payload.password === '123456') {
                state.login.error = '';
                state.login.success = true;
                state.user.username = action.payload.username;
                state.user.role = action.payload.role;
            } else {
                state.login.success = false;
                if (action.payload.username === '' || action.payload.password === '' || action.payload.role === '') {
                    state.login.error = 'Vui lòng nhập đầy đủ thông tin';
                } else {    
                    state.login.error = 'Tên đăng nhập và mật khẩu không đúng. Vui lòng kiểm tra và nhập lại.';
                }
            }
        },
    }
})

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;

export default authSlice;

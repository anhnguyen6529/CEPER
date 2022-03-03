import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: {
        username: '',
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
            if ((action.payload.username === 'user01' && action.payload.password === '123456' && action.payload.role === 'BS')
            || (action.payload.username === 'user02' && action.payload.password === '123456' && action.payload.role === 'DD')
            || (action.payload.username === 'user03' && action.payload.password === '123456' && action.payload.role === 'BN')
            ) 
            {
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

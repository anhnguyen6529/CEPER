import { createSlice } from "@reduxjs/toolkit";
import authThunk from "../thunks/auth.thunk";

const initialState = {
    user: {
        getting: false,
        error: '',
        username: '',
        avatar: '',
        role: '',
        id: '',
        name: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        phone: '',
        email: '',
        speciality: '',
        position: '', // Trưởng khoa, Phó khoa, Bác sĩ điều trị, Điều dưỡng
        medicalLicenseNo: '',
        signature: ''
    }
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        updateUserFields: (state, action) => {
            return {
                ...state,
                user: {
                    ...state.user,
                    ...action.payload
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

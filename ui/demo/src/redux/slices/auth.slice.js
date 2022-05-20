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
        department: '',
        position: '', // Trưởng khoa, Phó khoa, Bác sĩ điều trị, Điều dưỡng
        medicalLicenseNo: '',
        signature: '',
        notifications: [],
        gettingNoti: false, 
        errorNoti: ''
    },
    settings: {
        appearance: {
            changing: false,
            changingError: '',
            accentColor: "#009ABB"
        },
        functionality: {
            changing: false,
            changingError: '',
            autoUpdateWithProcessResult: false
        }
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
                    ...action.payload.user
                },
                settings: {
                    ...state.settings,
                    ...action.payload.settings
                }
            }
        },
        updateAppearanceField: (state, action) => {
            return { 
                ...state,
                settings: {
                    ...state.settings,
                    appearance: {
                        ...state.settings.appearance,
                        [action.payload.field]: action.payload.value
                    }
                }
            }
        },
        updateFunctionalityField: (state, action) => {
            return { 
                ...state,
                settings: {
                    ...state.settings,
                    functionality: {
                        ...state.settings.functionality,
                        [action.payload.field]: action.payload.value
                    }
                }
            }
        }
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
        .addCase(authThunk.getUserInfo.rejected, (state, action) => {
            return {
                ...state,
                user: {
                    ...state.user,
                    getting: false,
                    error: action.payload
                }
            }
        })
        .addCase(authThunk.getNotifications.fulfilled, (state, action) => {
            return {
                ...state,
                user: {
                    ...state.user,
                    notifications: action.payload.notifications,
                    gettingNoti: false, 
                    errorNoti: ''
                }
            }
        })
        .addCase(authThunk.getNotifications.pending, (state) => {
            return {
                ...state,
                user: {
                    ...state.user,
                    gettingNoti: true
                }
            }
        })
        .addCase(authThunk.getNotifications.rejected, (state, action) => {
            return {
                ...state,
                user: {
                    ...state.user,
                    gettingNoti: false,
                    errorNoti: action.payload
                }
            }
        })
        .addCase(authThunk.changeAccentColor.pending, (state) => {
            state.settings.appearance.changing = true;
        })
        .addCase(authThunk.changeAccentColor.fulfilled, (state, action) => {
            state.settings.appearance.changing = false;
            state.settings.appearance.changingError = '';
            state.settings.appearance.accentColor = action.payload
        })
        .addCase(authThunk.changeAccentColor.rejected, (state, action) => {
            state.settings.appearance.changing = false;
            state.settings.appearance.changingError = action.payload;
        })
        .addCase(authThunk.toggleAutoUpdateWithProcessResult.pending, (state) => {
            state.settings.functionality.changing = true;
        })
        .addCase(authThunk.toggleAutoUpdateWithProcessResult.fulfilled, (state) => {
            state.settings.functionality.changing = false;
            state.settings.functionality.changingError = '';
            state.settings.functionality.autoUpdateWithProcessResult = !state.settings.functionality.autoUpdateWithProcessResult;
        })
        .addCase(authThunk.toggleAutoUpdateWithProcessResult.rejected, (state, action) => {
            state.settings.functionality.changing = false;
            state.settings.functionality.changingError = action.payload;
        })
    }
})

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;

export default authSlice;

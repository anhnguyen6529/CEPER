import { createSlice } from "@reduxjs/toolkit";
import danhSachHSBAThunk from "../thunks/danhSachHSBA.thunk";
import { UtilsDateTime } from "../../utils";

const initialState = {
    loading: false,
    error: '',
    hienTai: [],
    raVien: [],
    creatingMode: false,
    creatingHSBA: false,
    creatingHSBAError: ''
}

const danhSachHSBASlice = createSlice({
    name: 'danhSachHSBA',
    initialState,
    reducers: {
        setCreatingMode: (state, action) => {
            state.creatingMode = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(danhSachHSBAThunk.createNewHSBA.pending, (state) => {
            return {
                ...state,
                creatingHSBA: true
            }
        })
        .addCase(danhSachHSBAThunk.createNewHSBA.fulfilled, (state, action) => {
            if (action.payload.token) {
                localStorage.setItem('token', action.payload.token);
                delete action.payload.token
            }
            
            return {
                ...state,
                creatingHSBA: false,
                creatingHSBAError: '',
                hienTai: [action.payload, ...state.hienTai],
                creatingMode: false
            }
        })
        .addCase(danhSachHSBAThunk.createNewHSBA.rejected, (state, action) => {
            return {
                ...state,
                creatingHSBA: false,
                creatingHSBAError: action.payload
            }
        })
        .addCase(danhSachHSBAThunk.getDanhSachHSBA.pending, (state) => {
            return {
                ...state,
                loading: true
            }
        })
        .addCase(danhSachHSBAThunk.getDanhSachHSBA.fulfilled, (state, action) => {
            if (action.payload.token) {
                localStorage.setItem('token', action.payload.token);
                delete action.payload.token
            }

            const hienTai = [...action.payload.hienTai].map(ht => ({ ...ht, tuoi: UtilsDateTime.getAge(ht.ngaySinh) }));
            const raVien = [...action.payload.raVien].map(rv => ({ ...rv, tuoi: UtilsDateTime.getAge(rv.ngaySinh) }));
            return {
                ...state,
                loading: false,
                error: '',
                hienTai: hienTai, 
                raVien: raVien
            }
        })
        .addCase(danhSachHSBAThunk.getDanhSachHSBA.rejected, (state, action) => {
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        })
    }
})

export const danhSachHSBAReducer = danhSachHSBASlice.reducer;
export const danhSachHSBAActions = danhSachHSBASlice.actions;

export default danhSachHSBASlice;
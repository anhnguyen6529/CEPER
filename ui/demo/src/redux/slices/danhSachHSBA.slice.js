import { createSlice } from "@reduxjs/toolkit";
import danhSachHSBAThunk from "../thunks/danhSachHSBA.thunk";

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
            return {
                ...state,
                loading: false,
                error: '',
                ...action.payload
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
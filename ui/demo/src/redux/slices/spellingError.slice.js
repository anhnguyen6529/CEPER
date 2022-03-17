import { createSlice } from "@reduxjs/toolkit";
import mdSections from "../../constants/md_sections.json";
import SpellingErrorThunk from "../thunks/spellingError.thunk";

const EMPTY_SPELLING = {
    loading: true, 
    error: '',
    detection: '',
    correction: ''
}

const initialState = Object.keys(mdSections["clinicalText"]).reduce((prev, key) => ({ ...prev, [key]: EMPTY_SPELLING }), {});

const SpellingErrorSlice = createSlice({
    name: 'SpellingErrorSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(SpellingErrorThunk.getProcessResult.fulfilled, (state, action) => {
            return {
                ...state,
                [action.payload.section]: {
                    ...state[action.payload.section],
                    ...action.payload.result,
                    loading: false,
                    error: ''
                }
            }
        })
        .addCase(SpellingErrorThunk.getProcessResult.rejected, (state, action) => {
            return {
                ...state,
                [action.payload.section]: {
                    ...state[action.payload.section],
                    loading: false,
                    error: action.payload.error
                }
            }
        })
    }
})

export const SpellingErrorReducer = SpellingErrorSlice.reducer;
export const SpellingErrorActions = SpellingErrorSlice.actions;

export default SpellingErrorSlice;

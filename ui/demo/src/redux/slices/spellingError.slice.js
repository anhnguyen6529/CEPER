import { createSlice } from "@reduxjs/toolkit";
import mdSections from "../../constants/md_sections.json";
import SpellingErrorThunk from "../thunks/spellingError.thunk";

const EMPTY_SPELLING = {
    loading: true,
    changed: '', 
    error: '',
    detection: '',
    correction: ''
}

const clinicalState = Object.keys(mdSections["clinicalText"]).reduce((prev, key) => ({ ...prev, [key]: EMPTY_SPELLING }), {});

const initialState = {
    ...clinicalState,
    loading: true
}

const SpellingErrorSlice = createSlice({
    name: 'SpellingErrorSlice',
    initialState,
    reducers: {
        updateChanged: (state, action) => {
            return {
                ...state,
                [action.payload.section]: {
                    ...state[action.payload.section],
                    changed: action.payload.changed
                }
            }
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(SpellingErrorThunk.getProcessResult.fulfilled, (state, action) => {
            if (Object.keys(clinicalState).filter(key => key !== action.payload.section).every(key => !state[key].changed 
                || (!!state[key].changed && !state[key].loading))) {
                state.loading = false;
            }
            state[action.payload.section] = { ...state[action.payload.section], ...action.payload.result, loading: false, error: '' };
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

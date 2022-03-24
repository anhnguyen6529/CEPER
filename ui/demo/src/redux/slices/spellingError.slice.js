import { createSlice } from "@reduxjs/toolkit";
import mdSections from "../../constants/md_sections.json";
import SpellingErrorThunk from "../thunks/spellingError.thunk";

const EMPTY_SPELLING = {
    loading: true,
    changed: false, 
    error: '',
    detection: '',
    correction: ''
}

export const sectionState = [...mdSections["clinicalSection"], ...mdSections["attached"]].reduce((prev, key) => {
    if (key === "Bệnh án" || key === "Tổng kết bệnh án") {
        return { ...prev, ...mdSections[key].reduce((subPrev, subKey) => {
            if (subKey === "Lý do vào viện" || subKey === "Hỏi bệnh" || subKey === "Khám bệnh" || subKey === "Chẩn đoán khi ra viện") {
                return { 
                    ...subPrev, 
                    [subKey]: { 
                        changed: false, 
                        ...mdSections[subKey].reduce((subSubPrev, subSubKey) => {
                            return { ...subSubPrev, [subSubKey]: EMPTY_SPELLING };
                        }, {}) 
                    } 
                };
            }
            return { ...subPrev, [subKey]: EMPTY_SPELLING };
        }, {})};
    } 
    return { ...prev, [key]: EMPTY_SPELLING };
}, {});

const initialState = {
    ...sectionState,
    loading: true
}

const SpellingErrorSlice = createSlice({
    name: 'SpellingErrorSlice',
    initialState,
    reducers: {
        updateSectionChanged: (state, action) => {
            state[action.payload.section].changed = action.payload.changed;
        },
        updateSubSectionChanged: (state, action) => {
            state[action.payload.section][action.payload.subSection].changed = action.payload.changed;
        },
        resetState: () => {
            return { ...sectionState };
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(SpellingErrorThunk.getProcessResult.fulfilled, (state, action) => {
            if (!action.payload.subSection) {
                const filter = Object.keys(sectionState).filter(key => key !== action.payload.section && !mdSections["attached"].includes(key));
                const loadedAll = filter.every((key) => {
                    if (key === "Lý do vào viện" || key === "Hỏi bệnh" || key === "Khám bệnh" || key === "Chẩn đoán khi ra viện") {
                        return Object.keys(state[key]).filter(subKey => subKey !== "changed").every(subKey => !state[key][subKey].changed 
                            || (state[key][subKey].changed && !state[key][subKey].loading));
                    } else {
                        return !state[key].changed || (state[key].changed && !state[key].loading);
                    }
                });
                if (loadedAll) state.loading = false;
                state[action.payload.section] = { ...state[action.payload.section], ...action.payload.result, loading: false, error: "" };
            } else {
                const filter = Object.keys(sectionState).filter(key => !mdSections["attached"].includes(key));
                const loadedAll = filter.every((key) => {
                    if (key === "Lý do vào viện" || key === "Hỏi bệnh" || key === "Khám bệnh" || key === "Chẩn đoán khi ra viện") {
                        return Object.keys(state[key]).filter(subKey => subKey !== "changed" 
                            && subKey !== action.payload.subSection).every(subKey => !state[key][subKey].changed 
                            || (state[key][subKey].changed && !state[key][subKey].loading));
                    } else {
                        return !state[key].changed || (state[key].changed && !state[key].loading);
                    }
                });
                if (loadedAll) state.loading = false;
                state[action.payload.section][action.payload.subSection] = {
                    ...state[action.payload.section][action.payload.subSection],
                    ...action.payload.result,
                    loading: false, 
                    error: ""
                };
            }
        })
        .addCase(SpellingErrorThunk.getProcessResult.rejected, (state, action) => {
            if (!action.payload.subSection) {
                state[action.payload.section].loading = false;
                state[action.payload.section].error = action.payload.error;
            } else {
                state[action.payload.section][action.payload.subSection].loading = false;
                state[action.payload.section][action.payload.subSection].error = action.payload.error;
            }
        })
    }
})

export const SpellingErrorReducer = SpellingErrorSlice.reducer;
export const SpellingErrorActions = SpellingErrorSlice.actions;

export default SpellingErrorSlice;

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
    loading: true,
    loadingError: ''
}

const checkAllWithoutSubSection = (state, section, fieldCheck) => {
    const filter = Object.keys(sectionState).filter(key => key !== section && key !== "Tóm tắt bệnh án" && !mdSections["attached"].includes(key));
    return filter.every((key) => {
        if (key === "Lý do vào viện" || key === "Hỏi bệnh" || key === "Khám bệnh" || key === "Chẩn đoán khi ra viện") {
            return Object.keys(state[key]).filter(subKey => subKey !== "changed").every(subKey => !state[key][subKey].changed 
                || (state[key][subKey].changed && !state[key][subKey][fieldCheck]));
        } else {
            return !state[key].changed || (state[key].changed && !state[key][fieldCheck]);
        }
    });
}

const checkAllWithSubSection = (state, subSection, fieldCheck) => {
    const filter = Object.keys(sectionState).filter(key => !mdSections["attached"].includes(key) && key !== "Tóm tắt bệnh án");
    return filter.every((key) => {
        if (key === "Lý do vào viện" || key === "Hỏi bệnh" || key === "Khám bệnh" || key === "Chẩn đoán khi ra viện") {
            return Object.keys(state[key]).filter(subKey => subKey !== "changed" 
                && subKey !== subSection).every(subKey => !state[key][subKey].changed 
                || (state[key][subKey].changed && !state[key][subKey][fieldCheck]));
        } else {
            return !state[key].changed || (state[key].changed && !state[key][fieldCheck]);
        }
    });
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
        },
        resetLoading: (state, action) => {
            if (!action.payload.subSection) {
                state[action.payload.section].loading = true;
            } else {
                state[action.payload.section][action.payload.subSection].loading = true;
            }
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(SpellingErrorThunk.getProcessResult.fulfilled, (state, action) => {
            if (action.payload.result.token) {
                localStorage.setItem('token', action.payload.result.token);
                delete action.payload.result.token
            }

            if (!action.payload.subSection) {
                const loadedAll = checkAllWithoutSubSection(state, action.payload.section, "loading");
                const noErrorAll = checkAllWithoutSubSection(state, action.payload.section, "error");
                if (loadedAll) state.loading = false;
                if (noErrorAll) state.loadingError = "";
                state[action.payload.section] = { ...state[action.payload.section], ...action.payload.result, loading: false, error: "" };
            } else {
                const loadedAll = checkAllWithSubSection(state, action.payload.subSection, "loading");
                const noErrorAll = checkAllWithSubSection(state, action.payload.subSection, "error");
                if (loadedAll) state.loading = false;
                if (noErrorAll) state.loadingError = "";
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
                const loadedAll = checkAllWithoutSubSection(state, action.payload.section, "loading");
                if (loadedAll) state.loading = false;
                state.loadingError = action.payload.error;
                state[action.payload.section].loading = false;
                state[action.payload.section].error = action.payload.error;
            } else {
                const loadedAll = checkAllWithSubSection(state, action.payload.subSection, "loading");
                if (loadedAll) state.loading = false;
                state.loadingError = action.payload.error;
                state[action.payload.section][action.payload.subSection].loading = false;
                state[action.payload.section][action.payload.subSection].error = action.payload.error;
            }
        })
    }
})

export const SpellingErrorReducer = SpellingErrorSlice.reducer;
export const SpellingErrorActions = SpellingErrorSlice.actions;

export default SpellingErrorSlice;

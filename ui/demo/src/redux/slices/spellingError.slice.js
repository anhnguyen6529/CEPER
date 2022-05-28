import { createSlice } from "@reduxjs/toolkit";
import mdSections from "../../constants/md_sections.json";
import SpellingErrorThunk from "../thunks/spellingError.thunk";

const EMPTY_SPELLING = {
    loading: true,
    changed: false, 
    error: '',
    detection: '',
    correction: []
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
    } else if (["Tờ điều trị", "Phiếu chăm sóc", "Phiếu TD dị ứng thuốc", "Phiếu công khai thuốc"].includes(key)) {
        return { ...prev, [key]: { changed: false, loading: true } };
    } 
    return { ...prev, [key]: EMPTY_SPELLING };
}, {});

const initialState = {
    ...sectionState,
    loading: true,
    loadingError: ''
}

const checkAllWithoutSubSection = (state, section, fieldCheck) => {
    const filter = Object.keys(sectionState).filter(key => key !== section && mdSections["clinical"].includes(key));
    return filter.every((key) => {
        if (["Lý do vào viện", "Hỏi bệnh", "Khám bệnh", "Chẩn đoán khi ra viện"].includes(key)) {
            return Object.keys(state[key]).filter(subKey => subKey !== "changed").every(subKey => !state[key][subKey].changed 
                || (state[key][subKey].changed && !state[key][subKey][fieldCheck]));
        } else {
            return !state[key].changed || (state[key].changed && !state[key][fieldCheck]);
        }
    });
}

const checkAllWithSubSection = (state, subSection, fieldCheck) => {
    const filter = Object.keys(sectionState).filter(key => mdSections["clinical"].includes(key));
    return filter.every((key) => {
        if (["Lý do vào viện", "Hỏi bệnh", "Khám bệnh", "Chẩn đoán khi ra viện"].includes(key)) {
            return Object.keys(state[key]).filter(subKey => subKey !== "changed" && subKey !== "loading"
                && subKey !== subSection).every(subKey => !state[key][subKey].changed 
                || (state[key][subKey].changed && !state[key][subKey][fieldCheck]));
        } else if (key === "Phiếu chăm sóc") {
            return Object.keys(state[key]).filter(subKey => !["changed", "loading", subSection].includes(subKey)).every(subKey =>
                state[key][subKey].every(subKeyValue => !subKeyValue[fieldCheck]));
        } else if (key === "Tờ điều trị") {
            return Object.keys(state[key]).filter(subKey => !["changed", "loading", subSection].includes(subKey)).every(subKey =>
                !state[key][subKey]["Chẩn đoán"][fieldCheck] && !state[key][subKey]["Diễn biến bệnh"][fieldCheck]);
        } else if (key === "Phiếu TD dị ứng thuốc") {
            return Object.keys(state[key]).filter(subKey => !["changed", "loading", subSection].includes(subKey)).every(subKey =>
                !state[key][subKey]["Biểu hiện lâm sàng"][fieldCheck] && !state[key][subKey]["Ghi chú"][fieldCheck]);
        } else if (key === "Phiếu công khai thuốc") {
            return Object.keys(state[key]).filter(subKey => !["changed", "loading", subSection].includes(subKey)).every(subKey =>
                !state[key][subKey][fieldCheck]);
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
            if (action.payload.section === "Tờ điều trị") {
                state[action.payload.section] = { 
                    ...state[action.payload.section], 
                    [action.payload.newKey]: {
                        "Chẩn đoán": { ...EMPTY_SPELLING, changed: true },
                        "Diễn biến bệnh": { ...EMPTY_SPELLING, changed: true }
                    }
                };
            } else if (action.payload.section === "Phiếu TD dị ứng thuốc") {
                state[action.payload.section] = { 
                    ...state[action.payload.section], 
                    [action.payload.newKey]: {
                        "Biểu hiện lâm sàng": { ...EMPTY_SPELLING, changed: true },
                        "Ghi chú": { ...EMPTY_SPELLING, changed: true }
                    }
                };
            } else if (action.payload.section === "Phiếu chăm sóc") {
                state[action.payload.section] = { 
                    ...state[action.payload.section], 
                    [action.payload.newKey]: new Array(action.payload.newKeyLength).fill({ ...EMPTY_SPELLING, changed: true })
                };
            } else if (action.payload.section === "Phiếu công khai thuốc") {
                var newSubSection = {};
                action.payload.newKeys.forEach(newKey => {
                    newSubSection = { ...newSubSection, [newKey]: { ...EMPTY_SPELLING, changed: true } }
                });
                state[action.payload.section] = { ...state[action.payload.section], ...newSubSection };
            } 
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
                if (["Tờ điều trị", "Phiếu chăm sóc", "Phiếu TD dị ứng thuốc", "Phiếu công khai thuốc"].includes(action.payload.section)) {
                    state[action.payload.section].loading = true;
                }
                if (action.payload.section === "Phiếu chăm sóc") {
                    state[action.payload.section][action.payload.subSection][action.payload.subSecIndex].loading = true;
                } else if (action.payload.section === "Tờ điều trị") {
                    state[action.payload.section][action.payload.subSection][action.payload.subSubSection].loading = true;
                } else if (action.payload.section === "Phiếu TD dị ứng thuốc") {
                    state[action.payload.section][action.payload.subSection][action.payload.subSubSection].loading = true;
                } else {
                    state[action.payload.section][action.payload.subSection].loading = true;
                }
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
                if (action.payload.section === "Phiếu chăm sóc") {
                    state[action.payload.section][action.payload.subSection][action.payload.subSecIndex] = {
                        ...state[action.payload.section][action.payload.subSection][action.payload.subSecIndex],
                        ...action.payload.result,
                        loading: false,
                        error: ""
                    }
                } else if (action.payload.section === "Tờ điều trị") {
                    state[action.payload.section][action.payload.subSection][action.payload.subSubSection] = {
                        ...state[action.payload.section][action.payload.subSection][action.payload.subSubSection],
                        ...action.payload.result,
                        loading: false,
                        error: ""
                    }
                } else if (action.payload.section === "Phiếu TD dị ứng thuốc") {
                    state[action.payload.section][action.payload.subSection][action.payload.subSubSection] = {
                        ...state[action.payload.section][action.payload.subSection][action.payload.subSubSection],
                        ...action.payload.result,
                        loading: false,
                        error: ""
                    }
                } else {
                    state[action.payload.section][action.payload.subSection] = {
                        ...state[action.payload.section][action.payload.subSection],
                        ...action.payload.result,
                        loading: false, 
                        error: ""
                    };
                }

                if (action.payload.section === "Tờ điều trị") {
                    if (Object.keys(state[action.payload.section]).filter(subKey => !["loading", "changed"].includes(subKey)).every(subKey => 
                    !state[action.payload.section][subKey]["Chẩn đoán"].loading && !state[action.payload.section][subKey]["Chẩn đoán"].error
                    && !state[action.payload.section][subKey]["Diễn biến bệnh"].loading && !state[action.payload.section][subKey]["Diễn biến bệnh"].error)) {
                        state[action.payload.section].loading = false;
                    }
                } else if (action.payload.section === "Phiếu TD dị ứng thuốc") {
                    if (Object.keys(state[action.payload.section]).filter(subKey => !["loading", "changed"].includes(subKey)).every(subKey => 
                    !state[action.payload.section][subKey]["Biểu hiện lâm sàng"].loading && !state[action.payload.section][subKey]["Biểu hiện lâm sàng"].error
                    && !state[action.payload.section][subKey]["Ghi chú"].loading && !state[action.payload.section][subKey]["Ghi chú"].error)) {
                        state[action.payload.section].loading = false;
                    }
                } else if (action.payload.section === "Phiếu chăm sóc") {
                    if (Object.keys(state[action.payload.section]).filter(subKey => !["loading", "changed"].includes(subKey)).every(subKey =>
                    state[action.payload.section][subKey].every((subKeyValue) => !subKeyValue.loading && !subKeyValue.error))) {
                        state[action.payload.section].loading = false;
                    }
                } else if (action.payload.section === "Phiếu công khai thuốc") {
                    if (Object.keys(state[action.payload.section]).filter(subKey => !["loading", "changed"].includes(subKey)).every(subKey => 
                    !state[action.payload.section][subKey].loading && !state[action.payload.section][subKey].error)) {
                        state[action.payload.section].loading = false;
                    }
                }          
                const loadedAll = checkAllWithSubSection(state, action.payload.subSection, "loading");
                const noErrorAll = checkAllWithSubSection(state, action.payload.subSection, "error");
                if (loadedAll) state.loading = false;
                if (noErrorAll) state.loadingError = "";
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
                state.loadingError = action.payload.error;
                if (action.payload.section === "Phiếu chăm sóc") {
                    state[action.payload.section][action.payload.subSection][action.payload.subSecIndex].loading = false;
                    state[action.payload.section][action.payload.subSection][action.payload.subSecIndex].error = action.payload.error;
                } else if (action.payload.section === "Tờ điều trị") {
                    state[action.payload.section][action.payload.subSection][action.payload.subSubSection].loading = false;
                    state[action.payload.section][action.payload.subSection][action.payload.subSubSection].error = action.payload.error;
                } else if (action.payload.section === "Phiếu TD dị ứng thuốc") {
                    state[action.payload.section][action.payload.subSection][action.payload.subSubSection].loading = false;
                    state[action.payload.section][action.payload.subSection][action.payload.subSubSection].error = action.payload.error;    
                } else {
                    state[action.payload.section][action.payload.subSection].loading = false;
                    state[action.payload.section][action.payload.subSection].error = action.payload.error;
                }
                const loadedAll = checkAllWithSubSection(state, action.payload.subSection, "loading");
                if (loadedAll) state.loading = false;
            }
        })
    }
})

export const SpellingErrorReducer = SpellingErrorSlice.reducer;
export const SpellingErrorActions = SpellingErrorSlice.actions;

export default SpellingErrorSlice;

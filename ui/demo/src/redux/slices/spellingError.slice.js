import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: true,
    error: '',
    checked: {
        khamBenh: {
            khamToanThan: {
                text: "tỉnh, sốt vừa, da nei 6m hồng. Hog5 sạch. Chi ấm, mạch rỏ. Phổi klho 6ng ran.",
                detector: [[18, 20], [22, 23], [31, 34], [55, 56], [64, 67], [69, 71]],
                detection: "tỉnh, sốt vừa, da <nei> <6m> hồng. <Hog5> sạch. Chi ấm, mạch <rỏ>. Phổi <klho> <6ng> ran.",
                correction: [[], [], ["Họng", "Hong"], ["rõ", "rỏ"], [], []],
                replaced: ["", "", "", "", "", ""],
                ignored: [false, false, false, false, false, false]
            }
        }
    }
}

const SpellingErrorSlice = createSlice({
    name: 'SpellingErrorSlice',
    initialState,
    reducers: {
        updateKhamBenh: (state, action) => {
            state.checked.khamBenh[action.payload.subSection] = { ...state.checked.khamBenh[action.payload.subSection], ...action.payload.data };
        }
    },
    extraReducers: {}
})

export const SpellingErrorReducer = SpellingErrorSlice.reducer;
export const SpellingErrorActions = SpellingErrorSlice.actions;

export default SpellingErrorSlice;

import { createAsyncThunk } from "@reduxjs/toolkit";

const SpellingErrorThunk = {
    getProcessResult: createAsyncThunk(
        'SpellingError/getProcessResult',
        async ({ section, subSection, text }) => {
            try {
                if (section === "Phương pháp điều trị") {
                    return {
                        section,
                        subSection,
                        result: {
                            detection: "kháng sinh, men vi <mask>, <mask> ói, hạ sốt kháng sinh, men vi <mask>, <mask> ói, hạ sốt kháng sinh, men vi <mask>, <mask> ói, hạ sốt kháng sinh, men vi <mask>, <mask> ói, hạ sốt kháng sinh, men vi <mask>, <mask> ói, hạ sốt",
                            correction: [["sinh", "khuẩn"], ["chống"], ["sinh", "khuẩn"], ["chống"], ["sinh", "khuẩn"], ["chống"], ["sinh", "khuẩn"], ["chống"], ["sinh", "khuẩn"], ["chống"]]
                        }
                    }
                } else if (section === "Chẩn đoán khi ra viện") {
                    return {
                        section,
                        subSection,
                        result: {
                            detection: "kháng sinh, men vi <mask>, <mask> ói, hạ sốt kháng sinh, men vi <mask>, <mask> ói, hạ sốt",
                            correction: [["sinh", "khuẩn"], ["chống"], ["sinh", "khuẩn"], ["chống"]]
                        }
                    }
                } else {
                    return {
                        section,
                        subSection,
                        result: {
                            detection: "",
                            correction: []
                        }
                    }
                }
            } catch (error) {
                return {
                    section,
                    subSection,
                    error: error.message
                }
            }
        }
    )
}

export default SpellingErrorThunk;
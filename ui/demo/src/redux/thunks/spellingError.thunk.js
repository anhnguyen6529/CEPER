import { createAsyncThunk } from "@reduxjs/toolkit";

const SpellingErrorThunk = {
    getProcessResult: createAsyncThunk(
        'SpellingError/getProcessResult',
        async ({ section, text }) => {
            try {
                if (section === "Phương pháp điều trị") {
                    return {
                        section,
                        result: {
                            detection: "kháng sinh, men vi <mask>, <mask> ói, hạ sốt",
                            correction: [["sinh", "khuẩn"], ["chống"]]
                        }
                    }
                } else {
                    return {
                        section,
                        result: {
                            detection: "",
                            correction: []
                        }
                    }
                }
            } catch (error) {
                return {
                    section,
                    error: error.message
                }
            }
        }
    )
}

export default SpellingErrorThunk;
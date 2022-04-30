import { createAsyncThunk } from "@reduxjs/toolkit";
import spellingErrorApi from "../../apis/spellingError";

const SpellingErrorThunk = {
    getProcessResult: createAsyncThunk(
        'SpellingError/getProcessResult',
        async ({ section, subSection, text }, { rejectWithValue }) => {
            try {
                const apiResponse = await spellingErrorApi.getProcessResult(text);

                if (apiResponse.status !== 200) {
                    throw new Error(apiResponse.statusText);
                }

                return {
                    section, 
                    subSection,
                    result: apiResponse.data
                }
            } catch (error) {
                return rejectWithValue({
                    section,
                    subSection,
                    error: error.response.data.msg
                })
            }
        }
    )
}

export default SpellingErrorThunk;
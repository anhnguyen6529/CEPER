import { createAsyncThunk } from "@reduxjs/toolkit";
import spellingErrorApi from "../../apis/spellingError";

const SpellingErrorThunk = {
    getProcessResult: createAsyncThunk(
        'SpellingError/getProcessResult',
        async (apiData, { rejectWithValue }) => {
            try {
                const apiResponse = await spellingErrorApi.getProcessResult(apiData.text);

                if (apiResponse.status !== 200) {
                    throw new Error(apiResponse.statusText);
                }

                return {
                    ...apiData,
                    result: apiResponse.data
                }
            } catch (error) {
                return rejectWithValue({
                    ...apiData,
                    error: error.response.data.msg
                })
            }
        }
    )
}

export default SpellingErrorThunk;
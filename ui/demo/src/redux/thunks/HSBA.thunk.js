import { createAsyncThunk } from "@reduxjs/toolkit";
import HSBAApi from "../../apis/HSBA";

const HSBAThunk = {
    getOneHSBAByPID: createAsyncThunk(
        'HSBA/getOneHSBA',
        async (pid) => {
            try {
                const apiResponse = await HSBAApi.getOneHSBAByPID({ pid });

                if (apiResponse.status !== 200) {
                    throw new Error(apiResponse.statusText);
                }

                return apiResponse.data;
            } catch (error) {
                return error.message;
            }
        }
    )
}

export default HSBAThunk;
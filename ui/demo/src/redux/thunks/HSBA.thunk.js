import { createAsyncThunk } from "@reduxjs/toolkit";
import HSBAApi from "../../apis/HSBA";

const HSBAThunk = {
    getOneHSBAByPID: createAsyncThunk(
        'HSBA/getOneHSBA',
        async (pid, { rejectWithValue }) => {
            try {
                const apiResponse = await HSBAApi.getOneHSBAByPID({ pid });

                if (apiResponse.status !== 200) {
                    throw new Error(apiResponse.statusText);
                }

                return apiResponse.data;
            } catch (error) {
                return rejectWithValue(error.response.data.msg);
            }
        }
    ),
    updateHSBA: createAsyncThunk(
        'HSBA/updateHSBA',
        async (apiData, { rejectWithValue }) => {
            try {
                const apiResponse = await HSBAApi.updateHSBA(apiData);

                if (apiResponse.status !== 200) {
                    throw new Error(apiResponse.statusText);
                }

                return apiResponse.data;
            } catch (error) {
                return rejectWithValue(error.response.data.msg);
            }
        }
    ),
    transferFaculty: createAsyncThunk(
        'HSBA/transferFaculty',
        async (apiData, { rejectWithValue }) => {
            try {
                const apiResponse = await HSBAApi.transferFaculty(apiData);

                if (apiResponse.status !== 200) {
                    throw new Error(apiResponse.statusText);
                }

                return apiData;
            } catch (error) {
                return rejectWithValue(error.response.data.msg);
            }
        }
    ),
    updateSickRoomBed: createAsyncThunk(
        'HSBA/updateSickRoomBed',
        async (apiData, { rejectWithValue }) => {
            try {
                const apiResponse = await HSBAApi.updateSickRoomBed(apiData);

                if (apiResponse.status !== 200) {
                    throw new Error(apiResponse.statusText);
                }

                return apiData;
            } catch (error) {
                return rejectWithValue(error.response.data.msg);
            }
        }
    )
}

export default HSBAThunk;
import { createAsyncThunk } from "@reduxjs/toolkit";
import authApi from "../../apis/auth";

const authThunk = {
    getUserInfo: createAsyncThunk(
        'auth/getUserInfo',
        async (id, { rejectWithValue }) => {
            try {
                const apiResponse = await authApi.getUserInfo({ userID: id });

                if (apiResponse.status !== 200) {
                    throw new Error(apiResponse.statusText);
                }

                return apiResponse.data;
            } catch (error) {
                return rejectWithValue(error.response.data.msg);
            }
        }
    ),
    getNotifications: createAsyncThunk(
        'auth/getNotifications',
        async (id, { rejectWithValue }) => {
            try {
                const apiResponse = await authApi.getNotifications({ userID: id });

                if (apiResponse.status !== 200) {
                    throw new Error(apiResponse.statusText);
                }

                return apiResponse.data;
            } catch (error) {
                return rejectWithValue(error.response.data.msg);
            }
        }
    ),
    markNotificationSeen: createAsyncThunk(
        'auth/markNotificationSeen',
        async ({ userID, notificationID }, { rejectWithValue }) => {
            try {
                const apiResponse = await authApi.markNotificationSeen({ userID, notificationID });

                if (apiResponse.status !== 200) {
                    throw new Error(apiResponse.statusText);
                }

                return apiResponse.data;
            } catch (error) {
                return rejectWithValue(error.response.data.msg);
            }
        }
    )
}

export default authThunk;
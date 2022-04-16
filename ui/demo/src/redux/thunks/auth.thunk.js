import { createAsyncThunk } from "@reduxjs/toolkit";
// import authApi from "../../apis/auth";

const authThunk = {
    getUserInfo: createAsyncThunk(
        'auth/getUserInfo',
        async () => {
            try {
                const userInfo = {};
                return userInfo;
            } catch (error) {
                return error.message;
            }
        }
    )
}

export default authThunk;
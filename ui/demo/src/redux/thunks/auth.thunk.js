import { createAsyncThunk } from "@reduxjs/toolkit";

const authThunk = {
    login: createAsyncThunk(
        'auth/login',
        async (payload) => {
            try {
                return payload;
            } catch (error) {
                return error.message;
            }
        }
    )
}

export default authThunk;
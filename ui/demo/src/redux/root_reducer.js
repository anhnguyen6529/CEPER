import { combineReducers } from "redux";
import { authReducer } from "./slices/auth.slice";
import { danhSachHSBAReducer } from "./slices/danhSachHSBA.slice";
import { HSBAReducer } from "./slices/HSBA.slice";

const rootReducer = combineReducers({
    auth: authReducer,
    HSBA: HSBAReducer,
    danhSachHSBA: danhSachHSBAReducer
})

export default rootReducer;
import { combineReducers } from "redux";
import { authReducer } from "./slices/auth.slice";
import { danhSachHSBAReducer } from "./slices/danhSachHSBA.slice";
import { HSBAReducer } from "./slices/HSBA.slice";
import { SpellingErrorReducer } from "./slices/spellingError.slice";

const rootReducer = combineReducers({
    auth: authReducer,
    HSBA: HSBAReducer,
    danhSachHSBA: danhSachHSBAReducer,
    spellingError: SpellingErrorReducer
})

export default rootReducer;
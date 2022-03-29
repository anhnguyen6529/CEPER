import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage';
import { authReducer } from "./slices/auth.slice";
import { danhSachHSBAReducer } from "./slices/danhSachHSBA.slice";
import { HSBAReducer } from "./slices/HSBA.slice";
import { SpellingErrorReducer } from "./slices/spellingError.slice";

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth']
}

const appReducer = combineReducers({
    auth: authReducer,
    HSBA: HSBAReducer,
    danhSachHSBA: danhSachHSBAReducer,
    spellingError: SpellingErrorReducer
});

const rootReducer = (state, action) => {
    if (action.type === 'LOG_OUT') {
        return appReducer(undefined, action);
    }
    return appReducer(state, action);
}

export const persistedReducer = persistReducer(persistConfig, rootReducer);

export default rootReducer;
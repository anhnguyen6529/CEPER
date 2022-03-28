import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './styles/theme';
import App from './App';
import { configureStore } from '@reduxjs/toolkit';
import { persistedReducer } from './redux/root_reducer';
import { Provider } from 'react-redux';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import 'moment/locale/vi';
import moment from 'moment';
import { CustomAdapterMoment } from './components/common';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import thunk from 'redux-thunk';

// const middleware = [thunk];
const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk]
})
const persistor = persistStore(store);

moment.updateLocale('vi', {
  months: 'Tháng 1_Tháng 2_Tháng 3_Tháng 4_Tháng 5_Tháng 6_Tháng 7_Tháng 8_Tháng 9_Tháng 10_Tháng 11_Tháng 12'.split('_'),
  weekdays: 'Chủ nhật_Thứ hai_Thứ ba_Thứ tư_Thứ năm_Thứ sáu_Thứ bảy'.split('_'),
})

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={CustomAdapterMoment}>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <Router>
              <App />
            </Router>  
          </PersistGate>
        </Provider>
      </LocalizationProvider>
    </ThemeProvider>  
  </React.StrictMode>,
  document.getElementById('root')
);

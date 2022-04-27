import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './styles/theme';
import App from './App';
import { Provider } from 'react-redux';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import 'moment/locale/vi';
import moment from 'moment';
import { CustomAdapterMoment } from './components/common';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './redux/store';
import { SnackbarProvider } from 'notistack';

moment.updateLocale('vi', {
  months: 'Tháng 1_Tháng 2_Tháng 3_Tháng 4_Tháng 5_Tháng 6_Tháng 7_Tháng 8_Tháng 9_Tháng 10_Tháng 11_Tháng 12'.split('_'),
  weekdays: 'Chủ nhật_Thứ hai_Thứ ba_Thứ tư_Thứ năm_Thứ sáu_Thứ bảy'.split('_'),
})

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3} style={{ fontSize: 16 }}>
        <LocalizationProvider dateAdapter={CustomAdapterMoment}>
          <Provider store={store}>
            <PersistGate persistor={persistor}>
              <Router>
                <App />
              </Router>  
            </PersistGate>
          </Provider>
        </LocalizationProvider>
      </SnackbarProvider>
    </ThemeProvider>  
  </React.StrictMode>,
  document.getElementById('root')
);

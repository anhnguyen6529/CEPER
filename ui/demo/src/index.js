import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './styles/theme';
import App from './App';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './redux/root_reducer';
import { Provider } from 'react-redux';

const store = configureStore({
  reducer: rootReducer,
})

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Router>
          <App />
        </Router>  
      </Provider>
    </ThemeProvider>  
  </React.StrictMode>,
  document.getElementById('root')
);

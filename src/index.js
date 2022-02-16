import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ConfigProvider } from 'antd';
import './styles.css';
import './localization';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './GlobalStyle';
import {
  BrowserRouter as Router
} from 'react-router-dom';
import { Web3ReactProvider } from '@web3-react/core';
import { getLibrary } from 'iweb3';
import { Provider } from 'react-redux'
import state from 'state';
import { getAntLocale, getDirection } from './localization';
import { RefreshContextProvider } from 'contexts/RefreshContext'

ConfigProvider.config({
  theme: {
    primaryColor: '#833ab4',
    // errorColor: 'red',
    // infoColor: 'magenta',
    // processingColor: 'orange',
    // successColor: 'green',
    // warningColor: 'yellow'
  },
});

const lightTheme = {
  dir: getDirection(),
  colors: {
    headerBackground: 'white',
    background: 'rgb(250, 249, 250)',
    primary: '#833ab4',
    secondary: '#1fc7d4',
    text: 'rgba(0,0,0,.85)',
    inputBackground: 'rgb(238, 234, 244)',
    inputSecondary: '#d7c4e2',
    border: 'rgb(231, 227, 235)',
    headerText: 'rgb(122, 110, 170)',
    maskBackground: 'rgba(40, 13, 95, 0.6)'
  }
};

ReactDOM.render(
  <ThemeProvider theme={lightTheme}>
    <Web3ReactProvider getLibrary={getLibrary}>
      <GlobalStyle />
      <Provider store={state}>
        <Router>
          <RefreshContextProvider>
            <ConfigProvider direction={getDirection()} locale={getAntLocale()}>
              <App />
            </ConfigProvider>
          </RefreshContextProvider>
        </Router>
      </Provider>
    </Web3ReactProvider>
  </ThemeProvider>
  , document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

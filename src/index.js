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
    primaryColor: '#7747FF',
    errorColor: 'rgba(198, 59, 59, 1)',
    // infoColor: 'magenta',
    // processingColor: 'orange',
    // successColor: 'green',
    // warningColor: 'yellow'
  },
});

const lightTheme = {
  dir: getDirection(),
  colors: {
    headerBackground: '#0B0322',
    headerIconColor: '#A484FF',
    headerColorSelected: '#CAE9FF',
    headerIconOutline: '#cae9ff1a',
    background: '#0B0322',
    cardBackground: '#F9F9F9',
    primary: '#6E2AFF',
    primary1: '#7747FF',
    secondary: 'rgb(202, 233, 255)',
    text: '#FFFFFF',
    textSecondary: '#B3ACC8',
    pageHeaderText: 'linear-gradient(150deg, #FFFFFF 0%, #7FC8FB 10%)',
    pageActionsBackground: '#231D35',
    inputBackground: '0xFFFFFF',
    inputText: '#5B5666',
    inputTitle: '#737277',
    inputError: 'rgba(198, 59, 59, 1)',
    inputSecondary: '#CAE9FF',
    border: 'rgb(231, 227, 235)',
    headerText: '#CAE9FF',
    maskBackground: 'rgba(11, 3, 34, 0.8)',
    connectWalletBackground: 'linear-gradient(271.6deg, #6640FF 1.39%, #987EFF 100%), linear-gradient(104.4deg, #FFFFFF -18.69%, #7FC8FB 41.02%)',
    connectWalletBackgroundFocus: 'linear-gradient(330deg,#6640FF 1.39%,#987EFF 100%),linear-gradient(104.4deg,#FFFFFF -18.69%,#7FC8FB 41.02%)',
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

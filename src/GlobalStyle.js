import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    
    ${({ theme }) => theme.dir == 'rtl' && `
      font-family: 'Roboto', 'Vazir', sans-serif;
    `}
    
    ${({ theme }) => theme.dir == 'ltr' && `
      font-family: 'Roboto', sans-serif;
    `}
  }

  .ant-input {
    ${({ theme }) => theme.dir == 'rtl' && `
      font-family: 'Roboto', 'Vazir', sans-serif;
    `}
    
    ${({ theme }) => theme.dir == 'ltr' && `
      font-family: 'Roboto', sans-serif;
    `}
  }

  .ant-layout-header {
    background: ${({ theme }) => theme.colors.headerBackground} !important;
    z-index: 1000 !important;
    height: auto !important;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border} !important;
  }

  .ant-layout-header > ul {
    border-bottom: unset !important;
  }

  .ant-menu-item-icon {
    font-size: 1rem !important;
  }

  body {
    background-color: ${({ theme }) => theme.colors.background} !important;
    background: 
  }

  .ant-modal-content {
    border-radius: 25px;
  }

  .ant-modal-header {
    border-radius: 25px 25px 0 0;
  }

  .ant-modal-confirm-title {
    font-size: 1.2rem !important;
    padding-bottom: 15px;
    font-weight: bold !important;
  }

  .ant-modal-mask {
    background: ${({ theme }) => theme.colors.maskBackground} !important;
  }

  .ant-modal-body {
    ${({ theme }) => theme.dir == 'rtl' && `
      direction: rtl !important;
    `}
  }

  .ant-modal-confirm-btns > .ant-btn-primary {
    ${({ theme }) => theme.dir == 'rtl' && `
      margin-left: 0 !important;
      margin-right: 8px !important;
    `}
  }

  .ant-modal-confirm-btns {
    ${({ theme }) => theme.dir == 'rtl' && `
      float: left !important;
    `}
  }

  .ant-modal-confirm-body > .anticon {
    ${({ theme }) => theme.dir == 'rtl' && `
      float: right !important;
      margin-right: unset !important;
      margin-left: 16px !important;
    `}
  }

  .ant-modal-content > .ant-modal-close {
    ${({ theme }) => theme.dir == 'rtl' && `
      right: unset !important;
      left: 0 !important;
    `}
  }

  .ant-modal-header {
    ${({ theme }) => theme.dir == 'rtl' && `
      direction: rtl !important;
    `}
  }

  .ant-modal-confirm-content {
    ${({ theme }) => theme.dir == 'rtl' && `
      margin-left: unset !important;
      margin-right: 38px !important;
    `}
  }

  .ant-select-item-group {
    font-size: 1rem !important;
  }

  .ant-select-selector {
    height: 52px !important;
    border-radius: 25px !important;
  }

  .ant-select-multiple .ant-select-selection-item {
    height: 44px !important;
    padding: 10px;
    border-radius: 25px !important;
    border: 1px solid ${({ theme }) => theme.colors.border} !important;
    background: ${({ theme }) => theme.colors.inputSecondary} !important;
    font-weight: bold;
    line-height: 22px !important;
  }

  .ant-select-dropdown {
    background: ${({ theme }) => theme.colors.inputBackground} !important;
    border: 1px solid ${({ theme }) => theme.colors.border} !important;
    border-radius: 10px;
  }

  .ant-select:not(.ant-select-customize-input) .ant-select-selector {
    background: ${({ theme }) => theme.colors.inputBackground} !important;
  }

  .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
    background: ${({ theme }) => theme.colors.inputSecondary} !important;
  }

  .ant-select-item-option-active:not(.ant-select-item-option-disabled) {
    background: ${({ theme }) => theme.colors.inputSecondary} !important;
  }

  .ant-select-selection-item {
    line-height: 52px !important;
    font-weight: bold;
  }

  .ant-card {
    border-radius: 25px !important;
    border: 1px solid ${({ theme }) => theme.colors.border} !important;
  }

  .ant-card-actions {
    border-radius: 0 0 25px 25px !important;
  }

  .ant-input {
    font-weight: bold;
    padding: 12px 20px !important;
    font-size: 1rem !important;
    border-radius: 25px !important;
    background: ${({ theme }) => theme.colors.inputBackground} !important;
  }

  .ant-card-head-title {
    font-weight: bold;
    font-size: 1.2rem;
  }

  .ant-switch {
    background-color: ${({ theme }) => theme.colors.inputBackground} !important;
  }

  .ant-switch-checked {
    background-color: ${({ theme }) => theme.colors.primary} !important;
  }

  .ant-btn>.ant-btn-loading-icon .anticon {
    ${({ theme }) => theme.dir == 'rtl' && `
      padding-right: 0 !important;
      padding-left: 8px !important;
    `}
  }
`

export default GlobalStyle;

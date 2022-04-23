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

  .ant-spin-container:after {
    background: ${({ theme }) => theme.colors.maskBackground} !important;
  }

  .ant-layout-header {
    background: ${({ theme }) => theme.colors.headerBackground} !important;
    z-index: 1000 !important;
    border-bottom: 1px solid ${({ theme }) => theme.colors.headerBackground} !important;
  }

  .ant-menu-item-selected {
    color: ${({ theme }) => theme.colors.headerBackground} !important;
    background: ${({ theme }) => theme.colors.headerColorSelected};
  }

  .ant-menu-item-selected > .anticon {
    color: ${({ theme }) => theme.colors.headerBackground} !important;
  }

  .ant-menu-item-selected > .ant-menu-title-content > a {
    color: ${({ theme }) => theme.colors.headerBackground} !important;
  }

  .ant-menu-item .ant-menu-item-icon, .ant-menu-item .anticon, .ant-menu-submenu-title .ant-menu-item-icon, .ant-menu-submenu-title .anticon {
    color: ${({ theme }) => theme.colors.headerIconColor};
  }

  .ant-menu-horizontal>.ant-menu-item a:hover {
    color: white;
  }

  .ant-menu-item:hover {
    background: unset;
  }

  .ant-menu-horizontal > .ant-menu-item-active,
  .ant-menu-horizontal > .ant-menu-submenu .ant-menu-submenu-title:hover {
    background-color: ${({ theme }) => theme.colors.headerColorSelected} !important;
  }

  .ant-menu-horizontal > .ant-menu-item-active > .ant-menu-title-content > a {
    color: ${({ theme }) => theme.colors.background} !important;
  }

  .ant-menu-item-selected:hover {
    background: ${({ theme }) => theme.colors.headerColorSelected} !important;
  }

  .ant-menu-title-content {
    height: 35px;
    line-height: 35px;
  }

  .ant-layout-header > ul {
    border-bottom: unset !important;
  }

  .ant-menu-item-icon {
    font-size: 1rem !important;
  }

  body {
    background-color: ${({ theme }) => theme.colors.background} !important;
    color: ${({ theme }) => theme.colors.text} !important;
  }

  .ant-typography.ant-typography-secondary {
    color: ${({ theme }) => theme.colors.textSecondary} !important;
  }

  .ant-modal-content {
    border-radius: 25px;
    background: ${({ theme }) => theme.colors.cardBackground} !important;
  }

  .ant-modal-header {
    border-radius: 25px 25px 0 0;
    background: ${({ theme }) => theme.colors.cardBackground} !important;
  }

  .ant-modal-header > .ant-modal-title {
    font-weight: bold;
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

  .ant-modal-confirm-btns > .ant-btn {
    border-radius: 24px !important;
    height: 40px !important;
    line-height: 8px;
    padding: 16px 32px !important;
    font-size: 14px !important;
    font-weight: 700;
  }

  .ant-modal-confirm-btns > .ant-btn-primary {
    ${({ theme }) => theme.dir == 'rtl' && `
      margin-left: 0 !important;
      margin-right: 8px !important;
    `}
  }

  .ant-modal-confirm-btns > .ant-btn:not(.ant-btn-primary) {
    border: unset !important;
    box-shadow: unset !important;
    color: ${({ theme }) => theme.colors.inputTitle} !important;
    background: transparent !important;
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
    border: unset !important;
    box-shadow: unset !important;
    color: ${({ theme }) => theme.colors.inputTitle} !important;
    background: transparent !important;

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

  .ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input) .ant-select-selector {
    box-shadow: none !important;
  }

  .ant-select-item-group {
    font-size: 1rem !important;
  }

  .ant-select-selector {
    height: 25px !important;
    line-height: 25px !important;
    border-radius: 12px !important;
    border: unset !important;
    padding: 0 !important;
  }

  .ant-select-selection-item {
    height: 25px !important;
    line-height: 25px !important;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.inputText} !important;
  }

  .ant-select-multiple .ant-select-selection-item {
    height: 34px !important;
    padding: 3px;
    border-radius: 25px !important;
    box-shadow: 0px 14px 24px -10px rgba(14, 12, 44, 0.16);
    background: ${({ theme }) => theme.colors.text} !important;
  }

  .ant-select-dropdown {
    background: ${({ theme }) => theme.colors.cardBackground} !important;
    border: 1px solid ${({ theme }) => theme.colors.border} !important;
    border-radius: 10px;
  }

  .ant-select-item-option-content {
    font-weight: normal;
    display: flex;
    align-items: center;
  }

  .ant-select-item-option-selected > .ant-select-item-option-content {
    font-weight: 600;
  }

  .ant-select:not(.ant-select-customize-input) .ant-select-selector {
    background: ${({ theme }) => theme.colors.inputBackground} !important;
  }

  .ant-select-item-option-selected:not(.ant-select-item-option-disabled) > .ant-select-item-option-state > .anticon {
    color: rgba(35, 169, 129, 1);
    border: 1px solid rgba(35, 169, 129, 1);
    padding: 2.5px 2.5px;
    border-radius: 50%;
  }

  .ant-select-item-group > span {
    display: flex;
    align-items: center;
  }

  .ant-select-item-group > span > .anticon {
    font-size: 1.5rem;
    ${({ theme }) => theme.dir == 'rtl' && `
      margin-left: 8px;
    `}

    ${({ theme }) => theme.dir == 'ltr' && `
      margin-right: 8px;
    `}
  }

  .ant-select-item-option-content > .anticon {
    font-size: 1.5rem !important;
    ${({ theme }) => theme.dir == 'rtl' && `
      margin-left: 8px;
    `}

    ${({ theme }) => theme.dir == 'ltr' && `
      margin-right: 8px;
    `}
  }

  .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
    background: transparent;
  }

  .ant-select-item-option:not(.ant-select-item-option-grouped) {
    margin: 0 5px;
  }

  .ant-select-item-option:nth-last-child(n+2):not(.ant-select-item-option-grouped) {
    border-bottom: 1px solid rgba(196, 196, 196, 0.2);
  }

  .ant-select-item-option-active:not(.ant-select-item-option-disabled) {
    background: ${({ theme }) => theme.colors.inputSecondary} !important;
  }

  .ant-card {
    border-radius: 25px !important;
    border: 1px solid ${({ theme }) => theme.colors.border} !important;
    background: ${({ theme }) => theme.colors.cardBackground};
  }

  .ant-card-body {
    padding: 36px;
    padding-top: 20px;
  }

  .ant-card-actions {
    border-radius: 0 0 25px 25px !important;
    background: ${({ theme }) => theme.colors.cardBackground};
  }

  .ant-card-head {
    border-bottom: unset;
  }

  .ant-card-head-title {
    font-weight: 700 !important;
    font-size: 24px !important;

    & > .anticon {
      margin: 0px 10px;
    }
  }

  .ant-card-head-wrapper {
    padding-top: 36px;
    padding-bottom: 16px;

    ${({ theme }) => theme.dir == 'rtl' && `
      text-align: right;
    `}

    ${({ theme }) => theme.dir == 'ltr' && `
      text-align: left;
    `}
  }

  .ant-card-extra {
    padding: 0 !important;
  }

  .ant-input {
    border: unset !important;
    background: ${({ theme }) => theme.colors.inputBackground} !important;
    padding: 0 !important;
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: -0.03em;
    color: ${({ theme }) => theme.colors.inputText} !important;

    ${({ theme }) => theme.dir == 'rtl' && `
      font-family: 'Vazir', 'Roboto', sans-serif;
    `}
    
    ${({ theme }) => theme.dir == 'ltr' && `
      font-family: 'Roboto', sans-serif;
    `}
  }

  .ant-card-head-title {
    font-weight: bold;
    font-size: 1.2rem;
    padding: 0 !important
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

  .ant-menu-item:after {
    visibility: hidden;
  }

  .ant-form-item {
    padding: 12px 16px;
    background: #FFFFFF;
    border: 1px solid #DFDEE2;
    box-shadow: 0px 2px 7px rgb(0 0 0 / 9%);
    border-radius: 20px;
    margin-bottom: 16px !important;
  }

  .ant-form-item-label > label{
    color: ${({ theme }) => theme.colors.inputTitle} !important;
  }

  .ant-input-focused, .ant-input:focus {
      box-shadow: unset;
      border-right-width: unset;
      outline: 0;
  }

  .ant-form-item-has-error {
    border: 1px solid ${({ theme }) => theme.colors.inputError};
  }

  .ant-form-item-has-error .ant-calendar-picker-open .ant-calendar-picker-input, .ant-form-item-has-error :not(.ant-input-affix-wrapper-disabled):not(.ant-input-affix-wrapper-borderless).ant-input-affix-wrapper-focused, .ant-form-item-has-error :not(.ant-input-affix-wrapper-disabled):not(.ant-input-affix-wrapper-borderless).ant-input-affix-wrapper:focus, .ant-form-item-has-error :not(.ant-input-disabled):not(.ant-input-borderless).ant-input-focused, .ant-form-item-has-error :not(.ant-input-disabled):not(.ant-input-borderless).ant-input:focus, .ant-form-item-has-error :not(.ant-input-number-affix-wrapper-disabled):not(.ant-input-number-affix-wrapper-borderless).ant-input-number-affix-wrapper-focused, .ant-form-item-has-error :not(.ant-input-number-affix-wrapper-disabled):not(.ant-input-number-affix-wrapper-borderless).ant-input-number-affix-wrapper:focus {
    box-shadow: unset !important;
  }

  .ant-form-item-explain {
    position: absolute;
    top: -32px;

    ${({ theme }) => theme.dir == 'rtl' && `
      left: 0;
    `}

    ${({ theme }) => theme.dir == 'ltr' && `
      right: 0;
    `}
  }

  .ant-btn-round.ant-btn-lg {
    height: 48px !important;
    line-height: 14px;
    padding: 16px 32px !important;
    font-size: 14px !important;
    font-weight: 700;
  }

  .ant-form-item-label > label > .anticon {
    ${({ theme }) => theme.dir == 'ltr' && `
      margin-right: 8px;
    `}

    ${({ theme }) => theme.dir == 'rtl' && `
      margin-left: 8px;
    `}
  }

  .ant-dropdown-menu {
    border-radius: 12px !important;
  }

  .ant-dropdown-menu-item {
    border-radius: 12px !important;
  }

  .target-asset-icon {
    position: absolute;
    z-index: 5;

    ${({ theme }) => theme.dir == 'ltr' && `
      inset: 0px auto auto 0px;
    `}

    ${({ theme }) => theme.dir == 'rtl' && `
      inset: 0px 0px auto auto;
    `}
  }
`


export default GlobalStyle;

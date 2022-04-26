import { Table } from "antd";
import styled from "styled-components";

const BazaarTable = styled(Table)`
    border-radius: 30px !important;
    overflow: hidden;
    background: ${({ theme }) => theme.colors.cardBackground} !important;

    & > .ant-spin-nested-loading {
        padding: 25px 24px !important;
    }

    & > .ant-spin-nested-loading > .ant-spin-container {
        position: unset !important;
    }

    & > .ant-spin-nested-loading > .ant-spin-container > .ant-table > .ant-table-container > .ant-table-header > table > thead > tr > th {
        background: ${({ theme }) => theme.colors.cardBackground} !important;
        border: unset !important;
        font-weight: 600;
        padding-bottom: 20px !important;
    }

    & > .ant-spin-nested-loading > .ant-spin-container > .ant-table > .ant-table-container > .ant-table-header > table > thead > tr > th:nth-last-child(2) {
        text-align: center;
    }

    & > .ant-spin-nested-loading > .ant-spin-container > .ant-table > .ant-table-container > .ant-table-header > table > thead > tr > th:before {
        display: none !important;
    }

    & > .ant-spin-nested-loading > .ant-spin-container > .ant-table > .ant-table-container > .ant-table-body {
        overflow-y: hidden !important;
        overflow-x: auto !important;
    }

    & > .ant-spin-nested-loading > .ant-spin-container > .ant-table > .ant-table-container > .ant-table-body > table > tbody > tr > td {
        background: ${({ theme }) => theme.colors.cardBackground} !important;
        color: #8D8B95 !important;
    }

    & > .ant-spin-nested-loading > .ant-spin-container > .ant-table > .ant-table-container > .ant-table-body > table > tbody > tr > td:last-child {
        text-align: center;
    }
`;

export default BazaarTable;

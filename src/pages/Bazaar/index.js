import { useWeb3React } from "@web3-react/core";
import { Col, Row, Select, Switch, Button, Typography } from "antd";
import {
    ReloadOutlined,
    ShopOutlined,
    AppstoreOutlined
} from '@ant-design/icons'
import { useFetchOrders, useOrders } from "hooks/useOrder";
import { useProfile } from "hooks/useProfile";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { orderStates } from "utils/order";
import List from "./components/List";
import PageHeader from "components/PageHeader";
import { bazaars, sourceAssetNames } from "config/assets";

const { Option } = Select;
const { Text } = Typography;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const HistorySwitch = styled.div`
    display: flex;
    align-items: center;
    background: #322C44;
    border-radius: 12px;
    ${({ theme }) => theme.dir == 'rtl' && `
        float: left;
    `}

    ${({ theme }) => theme.dir == 'ltr' && `
        float: right;
    `}
`;

const HistorySwitchItem = styled.span`
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 12px;
    color: #858192;
    font-weight: 600;

    &:first-child {
        ${({ theme }) => theme.dir == 'rtl' && `
            margin-left: 8px;
        `}

        ${({ theme }) => theme.dir == 'ltr' && `
            margin-right: 8px;
        `}
    }

    &.active {
        background: ${({ theme }) => theme.colors.headerIconColor};
        color: ${({ theme }) => theme.colors.background};
    }
`

const ActionItemLabel = styled(Text)`
    ${({ theme }) => theme.dir == 'rtl' && `
        margin-left: 16px;
    `}

    ${({ theme }) => theme.dir == 'ltr' && `
        margin-right: 16px;
    `}
`;

const Actions = styled.div`
    position: relative;
    width: 100%;
    padding: 16px 118px;
    background: ${({ theme }) => theme.colors.pageActionsBackground};

    @media (max-width: 1200px) {
        padding: 16px 60px;
    }
`;

const ActionsInner = styled.div`
    width: 100%;
    max-width: 1300px;
    margin: auto;
`;

const ActionItem = styled.div`
    display: inline-block;
    ${({ theme }) => theme.dir == 'rtl' && `
        margin-left: 25px;
    `}

    ${({ theme }) => theme.dir == 'ltr' && `
        margin-right: 25px;
    `}
`;

const StyledSelect = styled(Select)`
    & > .ant-select-selector {
        height: 40px !important;
        line-height: 40px !important;
        padding: 0 12px !important;
        background: ${({ theme }) => theme.colors.cardBackground} !important;
    }

    & > .ant-select-selector > .ant-select-selection-overflow > .ant-select-selection-overflow-item > .ant-select-selection-item, & > .ant-select-selector > .ant-select-selection-item {
        height: 24px !important;
        font-weight: 500;
        line-height: 20px !important;
        padding: 1px 3px !important;
    }

    & > .ant-select-selector > .ant-select-selection-item {
        height: 40px !important;
        line-height: 40px !important;
        ${({ theme }) => theme.dir == 'rtl' && `
            margin-left: 15px;
        `}

        ${({ theme }) => theme.dir == 'ltr' && `
            margin-right: 15px;
        `}
    }
`;

const defaultFilters = {
    sourceAssets: [...bazaars.GOLD.assets],
    states: [orderStates.Placed],
    withExpireds: false,
};

function Bazaar() {
    const { account } = useWeb3React();
    const { isLoading: isProfileLoading } = useProfile();
    const { t } = useTranslation();
    const { orders, isLoading: isOrdersLoading, isLoadingMore, hasMore } = useOrders();
    const [filters, setFilters] = useState(defaultFilters);
    const { refresh, setAutoRefresh, autoRefresh, loadMore, setItems: setOrders } = useFetchOrders(true, filters);
    const [currentBazaar, setCurrentBazaar] = useState(bazaars.GOLD.id);
    const assets = bazaars[currentBazaar].assets;

    useEffect(() => {
        return () => {
            setOrders([]);
        }
    }, [])

    useEffect(() => {
        refresh();
    }, [filters])

    const onAssetsChanged = (values) => {
        if (!values || values.length < 1) {
            return;
        }

        setFilters(prev => ({ ...prev, sourceAssets: values }));
    }

    const onBazaarChanged = (value) => {
        setCurrentBazaar(value);
        setFilters(prev => ({ ...prev, sourceAssets: bazaars[value].assets }));
    }

    const onShowHistoryChange = (showHistory) => {
        return () => {
            if (showHistory) {
                setFilters(prev => ({
                    ...prev,
                    states: [
                        orderStates.Placed,
                        orderStates.Sold,
                        orderStates.Finished,
                        orderStates.Closed,
                        orderStates.Withdrew,
                        orderStates.CancelledBySeller,
                        orderStates.CancelledByBuyer,
                    ],
                    withExpireds: true,
                }));
            } else {
                setFilters(prev => ({
                    ...prev,
                    states: defaultFilters.states,
                    withExpireds: false,
                }));
            }
        }
    }

    return (
        <Wrapper>
            <PageHeader title={t('Market')} subtitle={t('Transactions that are live and you can buy with tiny fee')} />
            <Actions>
                <ActionsInner>
                    <ActionItem>
                        <ActionItemLabel type="secondary"><ShopOutlined style={{ margin: '2px' }} />{t('Market')} </ActionItemLabel>
                        <StyledSelect
                            style={{ minWidth: '100px' }}
                            showSearch={false}
                            defaultValue={bazaars.GOLD.id}
                            onChange={onBazaarChanged}
                            dropdownMatchSelectWidth={false}
                        >
                            {
                                Object.entries(bazaars).map(([id, b]) => (
                                    <Option key={b.id} value={b.id}>{<b.icon />} {t(b.symbol)}</Option>
                                ))
                            }
                        </StyledSelect>
                    </ActionItem>
                    <ActionItem>
                        <ActionItemLabel type="secondary"><AppstoreOutlined style={{ margin: '2px' }} />{t('Assets')} </ActionItemLabel>
                        <StyledSelect
                            style={{ width: '300px' }}
                            mode="multiple"
                            showSearch={false}
                            defaultValue={defaultFilters.sourceAssets}
                            onChange={onAssetsChanged}
                            maxTagCount='responsive'
                            value={filters.sourceAssets}
                            dropdownMatchSelectWidth={false}
                        >
                            {
                                assets.map((asset) => (
                                    <Option key={asset} value={asset}>{t(sourceAssetNames[asset])}</Option>
                                ))
                            }
                        </StyledSelect>
                    </ActionItem>
                    {/* <div>
                        <Text type="secondary">{t('Auto Refresh')}: </Text>
                        <Switch onChange={(v) => setAutoRefresh(v)} checked={autoRefresh} />
                    </div> */}
                    <HistorySwitch>
                        <HistorySwitchItem
                            className={!filters.withExpireds && "active"}
                            onClick={onShowHistoryChange(false)}
                        >
                            {t('Recent Orders')}
                        </HistorySwitchItem>
                        <HistorySwitchItem
                            className={filters.withExpireds && "active"}
                            onClick={onShowHistoryChange(true)}
                        >
                            {t('History Orders')}
                        </HistorySwitchItem>
                    </HistorySwitch>
                    {/* <Button
                        icon={<ReloadOutlined />}
                        loading={isOrdersLoading}
                        onClick={() => refresh()}
                        shape="circle"
                        type="primary"
                        size="middle"
                    /> */}
                </ActionsInner>
            </Actions>
            <List
                isLoading={(account && isProfileLoading) || isOrdersLoading}
                isLoadingMore={isLoadingMore}
                items={orders}
                refresh={refresh}
                loadMore={loadMore}
                hasMore={hasMore}
                currentBazaar={currentBazaar}
            />
        </Wrapper >
    );
}

export default Bazaar;

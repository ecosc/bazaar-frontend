import { useWeb3React } from "@web3-react/core";
import { Col, Row, Select, Switch, Button, Typography } from "antd";
import { ReloadOutlined } from '@ant-design/icons'
import { useFetchOrders, useOrders } from "hooks/useOrder";
import { useProfile } from "hooks/useProfile";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { orderStates } from "utils/order";
import List from "./components/List";
import PageHeader from "components/PageHeader";
import { bazaars, sourceAssetNames } from "config/assets";
import HeadImg1 from 'assets/images/bazaar-1.png'
import HeadImg2 from 'assets/images/bazaar-2.png'
import HeadImg3 from 'assets/images/bazaar-3.png'

const { Option } = Select;
const { Text } = Typography;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Actions = styled(Row)`
    width: 100%;
    padding: 16px;

    background: ${({ theme }) => theme.colors.pageActionsBackground};;

    & > .ant-col {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    & > .ant-col > * {
        padding: 0 10px;
    }
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
    }

    // & > .ant-select-selector{
    //     height: 40px !important;
    //     line-height: 40px !important;
    //     padding: 0 12px !important;
    // }
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
    const { refresh, setAutoRefresh, autoRefresh, loadMore } = useFetchOrders(true, filters);
    const [currentBazaar, setCurrentBazaar] = useState(bazaars.GOLD.id);
    const assets = bazaars[currentBazaar].assets;

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

    return (
        <Wrapper>
            <img src={HeadImg1} style={{width: '100%'}}/>
            <PageHeader title={t('Market')} subtitle={t('Transactions that are live and you can buy with tiny fee')} />
            <Actions align="center" gutter={10}>
                <Col xl={16} lg={22} md={22} sm={24} xs={24}>
                    <div>
                        <Text type="secondary">{t('Merket')}: </Text>
                        <StyledSelect
                            style={{ minWidth: '100px' }}
                            showSearch={false}
                            defaultValue={bazaars.GOLD.id}
                            onChange={onBazaarChanged}
                        >
                            {
                                Object.entries(bazaars).map(([id, b]) => (
                                    <Option key={b.id} value={b.id}>{b.icon} {t(b.symbol)}</Option>
                                ))
                            }
                        </StyledSelect>
                    </div>
                    <div>
                        <Text type="secondary">{t('Assets')}: </Text>
                        <StyledSelect
                            style={{ width: '300px' }}
                            mode="multiple"
                            showSearch={false}
                            defaultValue={defaultFilters.sourceAssets}
                            onChange={onAssetsChanged}
                            maxTagCount='responsive'
                            value={filters.sourceAssets}
                        >
                            {
                                assets.map((asset) => (
                                    <Option key={asset} value={asset}>{t(sourceAssetNames[asset])}</Option>
                                ))
                            }
                        </StyledSelect>
                    </div>
                    <div>
                        <Text type="secondary">{t('Auto Refresh')}: </Text>
                        <Switch onChange={(v) => setAutoRefresh(v)} checked={autoRefresh} />
                    </div>
                    <div>
                        <Text type="secondary">{t('History')}: </Text>
                        <Switch onChange={onShowHistoryChange} checked={filters.withExpireds} />
                    </div>
                    <Button
                        icon={<ReloadOutlined />}
                        loading={isOrdersLoading}
                        onClick={() => refresh()}
                        shape="circle"
                        type="primary"
                        size="middle"
                    />
                </Col>
            </Actions>
            <List
                isLoading={(account && isProfileLoading) || isOrdersLoading}
                isLoadingMore={isLoadingMore}
                items={orders}
                refresh={refresh}
                loadMore={loadMore}
                hasMore={hasMore}
            />
        </Wrapper >
    );
}

export default Bazaar;

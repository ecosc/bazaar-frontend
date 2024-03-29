import { useWeb3React } from "@web3-react/core";
import { Select, Switch, Button, Typography } from "antd";
import {
    ReloadOutlined,
    AppstoreOutlined
} from '@ant-design/icons'
import { useFetchOrders, useOrders } from "hooks/useOrder";
import { useProfile } from "hooks/useProfile";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { orderStateNames, orderStates } from "utils/order";
import List from "./components/List";
import PageHeader from "components/PageHeader";
import { useNotifyOnDeliveryApproved, useNotifyOnOrderCancelledByBuyer, useNotifyOnOrderSold } from "hooks/useNotifyOn";

const { Option } = Select;
const { Text } = Typography;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

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

const defaultFilters = [
    orderStates.Sold,
];

function Bazaar() {
    const { isLoading: isProfileLoading, profile } = useProfile();
    const { t } = useTranslation();
    const { account } = useWeb3React();
    const navigate = useNavigate();
    const { orders, isLoading: isOrdersLoading, isLoadingMore, hasMore } = useOrders();
    const [filters, setFilters] = useState({ states: defaultFilters, buyer: account });
    const { refresh, setAutoRefresh, autoRefresh, loadMore, setItems: setOrders } = useFetchOrders(false, filters);
    useNotifyOnOrderSold(onEventFired);
    useNotifyOnDeliveryApproved(onEventFired);
    useNotifyOnOrderCancelledByBuyer(onEventFired);

    function onEventFired() {
        refresh();
    }

    useEffect(() => {
        return () => {
            setOrders([]);
        }
    }, [])

    useEffect(() => {
        if (!isProfileLoading && !profile) {
            navigate('/');
        }

        refresh();
    }, [isProfileLoading, profile, filters])

    const onFiltersChange = (values) => {
        setFilters(prev => ({ ...prev, states: values }));
    }

    return (
        <Wrapper>
            <PageHeader title={t('My Purchases')} subtitle={t('Your active and history purchases')} />
            <Actions>
                <ActionsInner>
                    <ActionItem>
                        <ActionItemLabel type="secondary"><AppstoreOutlined style={{ margin: '2px' }} />{t('State')} </ActionItemLabel>
                        <StyledSelect
                            style={{ width: '300px' }}
                            mode="multiple"
                            showSearch={false}
                            defaultValue={defaultFilters}
                            onChange={onFiltersChange}
                            maxTagCount='responsive'
                            dropdownMatchSelectWidth={false}
                        >
                            <Option key={0} value={orderStates.Sold}>{t('Bought')}</Option>
                            <Option key={1} value={orderStates.Finished}>{t('Delivered')}</Option>
                            <Option key={2} value={orderStates.CancelledByBuyer}>{t(orderStateNames[orderStates.CancelledByBuyer])}</Option>
                            <Option key={3} value={orderStates.CancelledBySeller}>{t(orderStateNames[orderStates.CancelledBySeller])}</Option>
                        </StyledSelect>
                    </ActionItem>
                    {/* <div>
                        <Text type="secondary">{t('Auto Refresh')}: </Text>
                        <Switch onChange={(v) => setAutoRefresh(v)} checked={autoRefresh} />
                    </div> */}
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
            />
        </Wrapper >
    );
}

export default Bazaar;

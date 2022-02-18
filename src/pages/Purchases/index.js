import { useWeb3React } from "@web3-react/core";
import { Col, Row, Select, Switch, Button, Typography } from "antd";
import { ReloadOutlined } from '@ant-design/icons'
import { useFetchOrders, useOrders } from "hooks/useOrder";
import { useProfile } from "hooks/useProfile";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { orderStateInString, orderStateNames, orderStates } from "utils/order";
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

const Actions = styled(Row)`
    width: 100%;
    padding: 24px;

    & > .ant-col {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    & > .ant-col > * {
        padding: 0 10px;
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
    const { orders, isLoading: isOrdersLoading } = useOrders();
    const [filters, setFilters] = useState({ states: defaultFilters, buyer: account });
    const { refresh, setAutoRefresh, autoRefresh } = useFetchOrders(false, filters);
    useNotifyOnOrderSold(onEventFired);
    useNotifyOnDeliveryApproved(onEventFired);
    useNotifyOnOrderCancelledByBuyer(onEventFired);

    function onEventFired() {
        refresh();
    }

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
            <Actions align="center" gutter={10}>
                <Col xl={16} lg={22} md={22} sm={24} xs={24}>
                    <div>
                        <Text type="secondary">{t('State')}: </Text>
                        <Select
                            style={{ width: '300px' }}
                            mode="multiple"
                            showSearch={false}
                            defaultValue={defaultFilters}
                            onChange={onFiltersChange}
                            maxTagCount='responsive'
                        >
                            <Option key={0} value={orderStates.Sold}>{t('Bought')}</Option>
                            <Option key={1} value={orderStates.Finished}>{t('Delivered')}</Option>
                            <Option key={2} value={orderStates.CancelledByBuyer}>{t(orderStateNames[orderStates.CancelledByBuyer])}</Option>
                            <Option key={3} value={orderStates.CancelledBySeller}>{t(orderStateNames[orderStates.CancelledBySeller])}</Option>
                        </Select>
                    </div>
                    <div>
                        <Text type="secondary">{t('Auto Refresh')}: </Text>
                        <Switch onChange={(v) => setAutoRefresh(v)} checked={autoRefresh} />
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
                isLoading={isProfileLoading || isOrdersLoading}
                items={orders}
                refresh={refresh}
            />
        </Wrapper>
    );
}

export default Bazaar;

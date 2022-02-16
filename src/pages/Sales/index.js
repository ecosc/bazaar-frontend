import { useWeb3React } from "@web3-react/core";
import { ReloadOutlined } from '@ant-design/icons'
import { Col, Row, Select, Switch, Form, Typography, Button } from "antd";
import { useFetchOrders, useOrders } from "hooks/useOrder";
import { useProfile } from "hooks/useProfile";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { orderStateInString, orderStateNames, orderStates } from "utils/order";
import List from "./components/List";
import PageHeader from "components/PageHeader";

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
    orderStates.Placed,
    orderStates.Soled,
    orderStates.Conflict
];

function Bazaar() {
    const { isLoading: isProfileLoading, profile } = useProfile();
    const { account } = useWeb3React();
    const { t } = useTranslation();
    const { orders, isLoading: isOrdersLoading } = useOrders();
    const navigate = useNavigate();
    const [filters, setFilters] = useState({ states: defaultFilters, seller: account });
    const { refresh, setAutoRefresh, autoRefresh } = useFetchOrders(false, filters);

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
            <PageHeader title={t('My Sale Orders')} subtitle={t('Your active and history sale orders')} />
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
                            {
                                Object.entries(orderStates).map(([stateName, value]) => (
                                    <Option key={value} value={value}>{orderStateInString(value)}</Option>
                                ))
                            }
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

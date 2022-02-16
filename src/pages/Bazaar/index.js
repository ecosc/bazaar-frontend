import { useWeb3React } from "@web3-react/core";
import { Col, Row, Select, Switch, Button, Typography } from "antd";
import { ReloadOutlined } from '@ant-design/icons'
import { useFetchOrders, useOrders } from "hooks/useOrder";
import { useProfile } from "hooks/useProfile";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { orderStateInString, orderStates } from "utils/order";
import List from "./components/List";
import PageHeader from "components/PageHeader";
import { bazaars } from "config/assets";

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

const defaultFilters = {
    sourceAssets: [...bazaars.GOLD.assets],
    states: [orderStates.Placed],
    withExpireds: false,
};

function Bazaar() {
    const { account } = useWeb3React();
    const { isLoading: isProfileLoading } = useProfile();
    const { t } = useTranslation();
    const { orders, isLoading: isOrdersLoading } = useOrders();
    const [filters, setFilters] = useState(defaultFilters);
    const { refresh, setAutoRefresh, autoRefresh } = useFetchOrders(true, filters);

    useEffect(() => {
        refresh();
    }, [filters])

    const onStatesChanged = (values) => {
        setFilters(prev => ({ ...prev, states: values }));
    }

    const onBazaarChanged = (value) => {
        setFilters(prev => ({ ...prev, sourceAssets: bazaars[value].assets }));
    }

    return (
        <Wrapper>
            <PageHeader title={t('Online Transactions')} subtitle={t('Transactions that are live and you can buy with tiny fee')} />
            <Actions align="center" gutter={10}>
                <Col xl={16} lg={22} md={22} sm={24} xs={24}>
                    <div>
                        <Text type="secondary">{t('Bazaar')}: </Text>
                        <Select
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
                        </Select>
                    </div>
                    <div>
                        <Text type="secondary">{t('State')}: </Text>
                        <Select
                            style={{ width: '300px' }}
                            mode="multiple"
                            showSearch={false}
                            defaultValue={defaultFilters.states}
                            onChange={onStatesChanged}
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
                isLoading={(account && isProfileLoading) || isOrdersLoading}
                items={orders}
                refresh={refresh}
            />
        </Wrapper >
    );
}

export default Bazaar;

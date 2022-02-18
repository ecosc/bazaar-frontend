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
                        <Text type="secondary">{t('Assets')}: </Text>
                        <Select
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

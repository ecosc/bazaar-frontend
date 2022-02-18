import PropTypes from 'prop-types';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Col, Collapse, Row, Skeleton, Typography, Modal, Space, message, Empty } from "antd";
import styled from "styled-components";
import BuyButton from "components/BuyButton";
import React from "react";
import { useTranslation } from "react-i18next";
import { accountEllipsis, secondsToTime, transformSourceAmount, transformTargetAmount } from "utils/transforms";
import { calcBuyFee } from 'utils/fees';
import { BAZAAR_ADDRESS } from 'constants/addresses';
import useTokenBalance from 'hooks/useTokenBalance';
import tokens from 'constants/tokens';
import { useBazaarContract } from 'hooks/useContracts';
import { APPROVE_STATES, useApproveToken } from 'hooks/useApproveToken';
import { useNavigate } from 'react-router-dom';
import { orderStates } from 'utils/order';
import { sourceAssetNames } from 'config/assets';

const { Text } = Typography;
const { confirm } = Modal;
const { Panel } = Collapse;

const StyledCollapse = styled(Collapse)`
    width: 100%;
    border-radius: 20px 20px 0 0;
    filter: drop-shadow(rgba(25, 19, 38, 0.15) 0px 1px 4px);
`;

const StyledPanel = styled(Panel)`
    & > .ant-collapse-header {
        padding: 24px 32px !important;
    }

    text-align: center;
`;

const StyledSkeleton = styled(Skeleton)`
    & > .ant-skeleton-content > .ant-skeleton-paragraph {
        margin-bottom: 0 !important;
    }
`;

const RowWrapper = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-around;
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

function List({ isLoading, items, refresh }) {
    const { t } = useTranslation();
    const { balance: busdBalance } = useTokenBalance(tokens.busd.address);
    const bazaarContract = useBazaarContract();
    const navigate = useNavigate();

    const { state: approveState, approve } = useApproveToken(handleOnApproved);

    const remainingTime = (item) => {
        const now = Date.now();

        return Math.floor(item.deadline - (now / 1000));
    }

    const isItemBuyable = (item) => {
        if (remainingTime(item) <= 0) {
            return false;
        }

        return item.state == orderStates.Placed;
    }

    const renderSkeleton = () => {
        return (
            <>
                <StyledPanel header={<StyledSkeleton active title={false} paragraph={{ rows: 2, width: '100%' }} />} key={1} collapsible="disabled" />
                <StyledPanel header={<StyledSkeleton active title={false} paragraph={{ rows: 2, width: '100%' }} />} key={2} collapsible="disabled" />
                <StyledPanel header={<StyledSkeleton active title={false} paragraph={{ rows: 2, width: '100%' }} />} key={3} collapsible="disabled" />
            </>
        );
    }

    const renderHeader = (item) => {
        const now = Date.now();
        const remainingTime = Math.floor(item.deadline - (now / 1000));

        return (
            <RowWrapper>
                <Column>
                    <Text type="secondary">{t('Order ID')}</Text>
                    <Text>{item.id}</Text>
                </Column>
                <Column>
                    <Text type="secondary">{t('Asset')}</Text>
                    <Text>{t(sourceAssetNames[item.sourceAsset])}</Text>
                </Column>
                <Column>
                    <Text type="secondary">{t('Amount')}</Text>
                    <Text>{transformSourceAmount(item.sourceAsset, item.sourceAmount)}</Text>
                </Column>
                <Column>
                    <Text type="secondary">{t('Price')}</Text>
                    <Text>{transformTargetAmount(item.targetAsset, item.targetAmount)}</Text>
                </Column>
                <Column>
                    <Text type="secondary">{t('Seller')}</Text>
                    <Text>{accountEllipsis(item.seller)}</Text>
                </Column>
                <Column>
                    <Text type="secondary">{t('Remaining Time')}</Text>
                    <Text>{remainingTime <= 0 ? t('Expired') : secondsToTime(remainingTime)}</Text>
                </Column>
            </RowWrapper>
        );
    }

    function renderConfirmContent(item) {
        const {
            targetAmount,
            targetAsset
        } = item;

        const buyFee = calcBuyFee(targetAmount);
        const totalPrice = targetAmount.add(buyFee);

        return (
            <Space direction="vertical">
                <div>
                    <Text type="secondary">{t('Buy Fee')}: </Text>
                    <Text>{transformTargetAmount(targetAsset, buyFee)}</Text>
                </div>
                <div>
                    <Text type="secondary">{t('Total Price')}: </Text>
                    <Text>{transformTargetAmount(targetAsset, totalPrice)}</Text>
                </div>
                <div>
                    <Text type="secondary">{t('Your Balance')}: </Text>
                    <Text>{transformTargetAmount(targetAsset, busdBalance)}</Text>
                </div>
            </Space>
        );
    }

    function handleOnApproved(item) {
        confirm({
            title: t('Confirm Transaction'),
            icon: <ExclamationCircleOutlined />,
            content: renderConfirmContent(item),
            onOk() {
                return bazaarContract.buy(item.id).
                    then(() => {
                        message.success(t("Order buy requested"));
                        navigate('/purchases');
                    }).
                    catch(e => {
                        console.error(e);
                        message.error(t('Error while buying order'));
                    });
            },
        });
    }

    const handleBuyClick = (item) => {
        return () => {
            const { targetAmount, targetAsset } = item;
            const buyFee = calcBuyFee(targetAmount);
            const totalPrice = buyFee.add(targetAmount);

            approve(BAZAAR_ADDRESS, targetAsset, totalPrice, item);
        }
    }

    const renderItems = () => {
        return items.map(item => (
            <StyledPanel header={renderHeader(item)} key={item.id}>
                <BuyButton
                    onClick={handleBuyClick(item)}
                    loading={approveState === APPROVE_STATES.APPROVING}
                    disabled={!isItemBuyable(item)}
                />
            </StyledPanel>
        ));
    }

    return (
        <Row style={{ width: '100%', padding: "24px" }} align="center">
            <Col xl={16} lg={20} md={20} sm={24} xs={24}>
                {
                    (items.length < 1 && !isLoading) ? <Empty /> :
                        <StyledCollapse expandIconPosition="right">
                            {
                                isLoading ? renderSkeleton() : renderItems()
                            }
                        </StyledCollapse>
                }
            </Col>
        </Row>
    );
}

List.propTypes = {
    isLoading: PropTypes.bool,
    items: PropTypes.array,
    refresh: PropTypes.func,
};

export default List;

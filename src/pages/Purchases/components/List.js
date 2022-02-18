import PropTypes from 'prop-types';
import { Col, Collapse, Row, Skeleton, Typography, Modal, Space, message, Button, Empty } from "antd";
import styled from "styled-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { accountEllipsis, transformSourceAmount, transformTargetAmount } from "utils/transforms";
import { calcBuyFee, calcCancellationFee } from 'utils/fees';
import { useBazaarContract } from 'hooks/useContracts';
import { timestampInLocale } from 'utils/datetime';
import { orderStates, orderStateInString, maxDeliveryTime } from 'utils/order';
import { AddressZero } from '@ethersproject/constants'
import ProfileInfoButton from 'components/ProfileInfoButton';
import Timer from 'components/Timer';
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
    const bazaarContract = useBazaarContract();

    const timeToCancel = (item) => {
        const now = Date.now();

        return Math.floor(item.createdAt + maxDeliveryTime - (now / 1000));
    }

    const isInCancellableState = (item) => {
        return item.state == orderStates.Sold;
    }

    const isItemCancellable = (item) => {
        if (timeToCancel(item) > 0) {
            return false;
        }

        return isInCancellableState(item);
    }

    const isItemApprovable = (item) => {
        return item.state == orderStates.Sold;
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
                    <Text type="secondary">{t('Status')}</Text>
                    <Text>{orderStateInString(item.state)}</Text>
                </Column>
                <Column>
                    <Text type="secondary">{t('Created At')}</Text>
                    <Text>{timestampInLocale(item.createdAt)}</Text>
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
                    <Text type="secondary">{t('Order ID')}: </Text>
                    <Text>{item.id}</Text>
                </div>
                <div>
                    <Text type="secondary">{t('Amount')}: </Text>
                    <Text>{transformSourceAmount(item.sourceAsset, item.sourceAmount)}</Text>
                </div>
                <div>
                    <Text type="secondary">{t('Price')}: </Text>
                    <Text>{transformTargetAmount(item.targetAsset, item.targetAmount)}</Text>
                </div>
                <div>
                    <Text type="secondary">{t('Seller')}: </Text>
                    <Text>{accountEllipsis(item.seller)}</Text>
                </div>
                <div>
                    <Text type="secondary">{t('Buy Fee')}: </Text>
                    <Text>{transformTargetAmount(targetAsset, buyFee)}</Text>
                </div>
                <div>
                    <Text type="secondary">{t('Order Price')}: </Text>
                    <Text>{transformTargetAmount(targetAsset, targetAmount)}</Text>
                </div>
                <div>
                    <Text type="secondary">{t('Total Price')}: </Text>
                    <Text>{transformTargetAmount(targetAsset, totalPrice)}</Text>
                </div>
            </Space>
        );
    }

    const handleApproveClick = (item) => {
        return () => {
            confirm({
                title: t('Confirm Item Delivery'),
                okButtonProps: { danger: true },
                content: renderConfirmContent(item),
                onOk() {
                    return bazaarContract.approveDelivery(item.id).
                        then(() => {
                            message.success(t("Delivery approvement requested"));
                        }).
                        catch(e => {
                            console.error(e);
                            message.error(t('Error while approving item delivery'));
                        });
                },
            });
        }
    }

    function renderConfirmCancelContent(item) {
        const {
            targetAmount,
            targetAsset
        } = item;

        const buyFee = calcBuyFee(targetAmount);
        const totalPrice = targetAmount.add(buyFee);
        const cancellationFee = calcCancellationFee(targetAmount);
        const payback = totalPrice.sub(cancellationFee);

        return (
            <Space direction="vertical">
                <div>
                    <Text type="secondary">{t('Buy Fee')}: </Text>
                    <Text>{transformTargetAmount(targetAsset, buyFee)}</Text>
                </div>
                <div>
                    <Text type="secondary">{t('Order Price')}: </Text>
                    <Text>{transformTargetAmount(targetAsset, targetAmount)}</Text>
                </div>
                <div>
                    <Text type="secondary">{t('Total Price')}: </Text>
                    <Text>{transformTargetAmount(targetAsset, totalPrice)}</Text>
                </div>
                <div>
                    <Text type="secondary">{t('Cancellation Fee')}: </Text>
                    <Text>{transformTargetAmount(targetAsset, cancellationFee)}</Text>
                </div>
                <div>
                    <Text type="secondary">{t('Payback')}: </Text>
                    <Text>{transformTargetAmount(targetAsset, payback)}</Text>
                </div>
            </Space>
        );
    }

    const handleCancelClick = (item) => {
        return () => {
            confirm({
                title: t('Confirm Transaction'),
                okButtonProps: { danger: true },
                content: renderConfirmCancelContent(item),
                onOk() {
                    return bazaarContract.cancelForBuyer(item.id).
                        then(() => {
                            message.success(t("Order cancel requested"));
                        }).
                        catch(e => {
                            console.error(e);
                            message.error(t('Error while cancelling item'));
                        });
                },
            });
        }
    }

    const renderItems = () => {
        return items.map(item => (
            <StyledPanel header={renderHeader(item)} key={item.id}>
                <Space direction='horizontal'>
                    <Button
                        onClick={handleApproveClick(item)}
                        disabled={!isItemApprovable(item)}
                        size="large"
                        type="primary"
                        shape="round"
                    >
                        {t('Approve Delivery')}
                    </Button>
                    <Button
                        onClick={handleCancelClick(item)}
                        danger
                        disabled={!isItemCancellable(item)}
                        size="large"
                        type="primary"
                        shape="round"
                    >
                        <span>{t('Cancel Sale')}&nbsp;</span>
                        {isInCancellableState(item) && timeToCancel(item) > 0 && <Timer initialValue={timeToCancel(item)} />}
                    </Button>
                    <ProfileInfoButton
                        address={item.seller}
                        modalTitle={t('Seller Info')}
                        buttonTitle={t('Seller Info')}
                    />
                </Space>
            </StyledPanel>
        ));
    }

    return (
        <Row style={{ width: '100%', padding: "24px" }} align="center">
            <Col xl={18} lg={22} md={22} sm={24} xs={24}>
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

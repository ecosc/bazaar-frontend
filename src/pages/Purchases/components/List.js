import PropTypes from 'prop-types';
import { Col, Collapse, Row, Skeleton, Typography, Modal, Space, message, Button, Empty } from "antd";
import styled from "styled-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { accountEllipsis, secondsToTime, transformSourceAmount, transformTargetAmount } from "utils/transforms";
import { calcBuyFee } from 'utils/fees';
import { useBazaarContract } from 'hooks/useContracts';
import { timestampInLocale } from 'utils/datetime';
import { orderStates, orderStateInString } from 'utils/order';
import { AddressZero } from '@ethersproject/constants'
import ProfileInfoButton from 'components/ProfileInfoButton';

const { Text } = Typography;
const { confirm } = Modal;
const { Panel } = Collapse;

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

    const remainingTime = (item) => {
        const now = Date.now();

        return Math.floor(item.deadline - (now / 1000));
    }

    const isItemApprovable = (item) => {
        return item.state == orderStates.Soled;
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
                    <Text type="secondary">{t('Amount')}</Text>
                    <Text>{transformSourceAmount(item.sourceAsset, item.sourceAmount)}</Text>
                </Column>
                <Column>
                    <Text type="secondary">{t('Price')}</Text>
                    <Text>{transformTargetAmount(item.targetAsset, item.targetAmount)}</Text>
                </Column>
                <Column>
                    <Text type="secondary">{t('Buyer')}</Text>
                    <Text>{item.buyer != AddressZero ? accountEllipsis(item.buyer) : '-'}</Text>
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
                            message.success(t("Item delivery approved"));
                            refresh();
                        }).
                        catch(e => {
                            console.error(e);
                            message.error(t('Error while approving item delivery'));
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
                        danger
                        disabled={!isItemApprovable(item)}
                        size="large"
                        type="primary"
                        shape="round"
                    >
                        {t('Approve Delivery')}
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
            <Col xl={16} lg={22} md={22} sm={24} xs={24}>
                {
                    (items.length < 1 && !isLoading) ? <Empty /> :
                        <Collapse expandIconPosition="right" style={{ width: '100%', borderRadius: '20px 20px 0 0' }} >
                            {
                                isLoading ? renderSkeleton() : renderItems()
                            }
                        </Collapse>
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

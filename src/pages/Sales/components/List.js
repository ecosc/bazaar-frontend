import PropTypes from 'prop-types';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Col, Collapse, Row, Skeleton, Typography, Modal, Space, message, Button, Empty } from "antd";
import styled from "styled-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { accountEllipsis, secondsToTime, transformSourceAmount, transformTargetAmount } from "utils/transforms";
import { calcBuyFee, calcCancellationFee, calcGuaranteeAmount } from 'utils/fees';
import { useBazaarContract } from 'hooks/useContracts';
import { timestampInLocale } from 'utils/datetime';
import { orderStates, orderStateInString } from 'utils/order';
import { AddressZero } from '@ethersproject/constants'
import { getProfile } from 'state/profile/helpers';
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

    const isItemCancellable = (item) => {
        if (remainingTime(item) <= 0) {
            return false;
        }

        return item.state == orderStates.Placed;
    }

    const isItemWithdrawable = (item) => {
        if (remainingTime(item) > 0) {
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

        const cancellationFee = calcCancellationFee(targetAmount);
        const guaranteeAmount = calcGuaranteeAmount(targetAmount);
        const payback = guaranteeAmount.sub(cancellationFee);

        return (
            <Space direction="vertical">
                <div>
                    <Text type="secondary">{t('Guarantee Amount')}: </Text>
                    <Text>{transformTargetAmount(targetAsset, guaranteeAmount)}</Text>
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

    function renderConfirmWithdrawContent(item) {
        const {
            targetAmount,
            targetAsset
        } = item;

        const guaranteeAmount = calcGuaranteeAmount(targetAmount);

        return (
            <Space direction="vertical">
                <div>
                    <Text type="secondary">{t('Guarantee Amount')}: </Text>
                    <Text>{transformTargetAmount(targetAsset, guaranteeAmount)}</Text>
                </div>
            </Space>
        );
    }

    const handleCancelClick = (item) => {
        return () => {
            confirm({
                title: t('Confirm Transaction'),
                icon: <ExclamationCircleOutlined />,
                okButtonProps: { danger: true },
                content: renderConfirmContent(item),
                onOk() {
                    return bazaarContract.cancel(item.id).
                        then(() => {
                            message.success(t("Item cancelled"));
                            refresh();
                        }).
                        catch(e => {
                            console.error(e);
                            message.error(t('Error while cancelling item'));
                        });
                },
            });
        }
    }

    const handleWithdrawClick = (item) => {
        return () => {
            confirm({
                title: t('Confirm Withdraw'),
                content: renderConfirmWithdrawContent(item),
                onOk() {
                    return bazaarContract.withdraw(item.id).
                        then(() => {
                            message.success(t("Guarantee amount withdrew"));
                            refresh();
                        }).
                        catch(e => {
                            console.error(e);
                            message.error(t('Error while withdrew guarantee amount'));
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
                        onClick={handleCancelClick(item)}
                        danger
                        disabled={!isItemCancellable(item)}
                        size="large"
                        type="primary"
                        shape="round"
                    >
                        {t('Cancel Sale')}
                    </Button>
                    <Button
                        onClick={handleWithdrawClick(item)}
                        disabled={!isItemWithdrawable(item)}
                        size="large"
                        type="primary"
                        shape="round"
                    >
                        {t('Withdraw Guarantee Deposit')}
                    </Button>
                    {item.buyer != AddressZero &&
                        <ProfileInfoButton
                            address={item.buyer}
                            modalTitle={t('Buyer Info')}
                            buttonTitle={t('Buyer Info')}
                        />
                    }
                </Space>
            </StyledPanel>
        ));
    }

    return (
        <Row style={{ width: '100%', padding: "24px" }} align="center">
            <Col xl={16} lg={22} md={22} sm={24} xs={24}>
                {
                    (items.length < 1 && !isLoading) ? <Empty /> :
                        <Collapse expandIconPosition="right" style={{ width: '100%', borderRadius: '20px 20px 0 0', filter: 'drop-shadow(rgba(25, 19, 38, 0.15) 0px 1px 4px)' }} >
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

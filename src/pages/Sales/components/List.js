import PropTypes from 'prop-types';
import { DownOutlined } from '@ant-design/icons';
import { Col, Collapse, Row, Skeleton, Typography, Modal, Space, message, Button, Empty } from "antd";
import styled from "styled-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { accountEllipsis, transformSourceAmount, transformTargetAmount } from "utils/transforms";
import { calcCancellationFee, calcCloseFee, calcGuaranteeAmount } from 'utils/fees';
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

const LoadMoreButton = styled(Button)`
    self-align: center;
    margin-top: 10px;
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

function List({ isLoading, isLoadingMore, items, refresh, loadMore, hasMore }) {
    const { t } = useTranslation();
    const bazaarContract = useBazaarContract();

    const remainingTime = (item) => {
        const now = Date.now();

        return Math.floor(item.deadline - (now / 1000));
    }

    const timeToCancel = (item) => {
        const now = Date.now();

        return Math.floor(item.createdAt + maxDeliveryTime - (now / 1000));
    }

    const isItemClosable = (item) => {
        if (remainingTime(item) <= 0) {
            return false;
        }

        return item.state == orderStates.Placed;
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

    const isInWithdrawableState = (item) => {
        return item.state == orderStates.Placed;
    }

    const isItemWithdrawable = (item) => {
        if (remainingTime(item) > 0) {
            return false;
        }

        return isInWithdrawableState(item);
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

    function renderConfirmCloseContent(item) {
        const {
            targetAmount,
            targetAsset
        } = item;

        const closeFee = calcCloseFee(targetAmount);
        const guaranteeAmount = calcGuaranteeAmount(targetAmount);
        const payback = guaranteeAmount.sub(closeFee);

        return (
            <Space direction="vertical">
                <div>
                    <Text type="secondary">{t('Guarantee Amount')}: </Text>
                    <Text>{transformTargetAmount(targetAsset, guaranteeAmount)}</Text>
                </div>
                <div>
                    <Text type="secondary">{t('Order Close Fee')}: </Text>
                    <Text>{transformTargetAmount(targetAsset, closeFee)}</Text>
                </div>
                <div>
                    <Text type="secondary">{t('Payback')}: </Text>
                    <Text>{transformTargetAmount(targetAsset, payback)}</Text>
                </div>
            </Space>
        );
    }

    function renderConfirmCancelContent(item) {
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

    const handleCloseClick = (item) => {
        return () => {
            confirm({
                title: t('Confirm Transaction'),
                okButtonProps: { danger: true },
                content: renderConfirmCloseContent(item),
                onOk() {
                    return bazaarContract.close(item.id).
                        then(() => {
                            message.success(t("Order close requested"));
                            refresh();
                        }).
                        catch(e => {
                            console.error(e);
                            message.error(t('Error while closing order'));
                        });
                },
            });
        }
    }

    const handleCancelClick = (item) => {
        return () => {
            confirm({
                title: t('Confirm Transaction'),
                okButtonProps: { danger: true },
                content: renderConfirmCancelContent(item),
                onOk() {
                    return bazaarContract.cancelForSeller(item.id).
                        then(() => {
                            message.success(t("Order cancel requested"));
                            refresh();
                        }).
                        catch(e => {
                            console.error(e);
                            message.error(t('Error while cancelling order'));
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
                            message.success(t("Order withdrew requested"));
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
                    {
                        item.state === orderStates.Placed &&
                        <Button
                            onClick={handleCloseClick(item)}
                            danger
                            disabled={!isItemClosable(item)}
                            size="large"
                            type="primary"
                            shape="round"
                        >
                            {t('Close Sale')}
                        </Button>
                    }
                    {
                        item.state === orderStates.Sold &&
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
                    }
                    <Button
                        onClick={handleWithdrawClick(item)}
                        disabled={!isItemWithdrawable(item)}
                        size="large"
                        type="primary"
                        shape="round"
                    >
                        <span>{t('Withdraw Guarantee Deposit')}&nbsp;</span>
                        <span>{isInWithdrawableState(item) && remainingTime(item) > 0 && <Timer initialValue={remainingTime(item)} />}</span>
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

    const renderList = () => {
        if (items.length < 1 && !isLoading) {
            return <Empty />;
        }

        return (
            <>
                <StyledCollapse expandIconPosition="right">
                    {
                        isLoading ? renderSkeleton() : renderItems()
                    }
                </StyledCollapse>
                <LoadMoreButton
                    icon={<DownOutlined />}
                    shape="round"
                    type="dashed"
                    loading={isLoadingMore}
                    disabled={!hasMore}
                    onClick={() => loadMore()}
                >
                    {t('Load More')}
                </LoadMoreButton>
            </>
        )
    }

    return (
        <Row style={{ width: '100%', padding: "24px" }} align="center">
            <Col xl={18} lg={22} md={22} sm={24} xs={24} style={{ textAlign: 'center' }}>
                {renderList()}
            </Col>
        </Row>
    );
}

List.propTypes = {
    isLoading: PropTypes.bool,
    isLoadingMore: PropTypes.bool,
    hasMore: PropTypes.bool,
    items: PropTypes.array,
    refresh: PropTypes.func,
    loadMore: PropTypes.func,
};

export default List;

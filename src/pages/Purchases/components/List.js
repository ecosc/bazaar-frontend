import PropTypes from 'prop-types';
import { DownOutlined, CheckOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Collapse, Typography, Modal, Space, message, Button } from "antd";
import styled from "styled-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { accountEllipsis, transformSourceAmount, transformTargetAmount } from "utils/transforms";
import { calcBuyFee, calcCancellationFee } from 'utils/fees';
import { useBazaarContract } from 'hooks/useContracts';
import { timestampInLocale } from 'utils/datetime';
import { orderStates, orderStateInString, maxDeliveryTime } from 'utils/order';
import ProfileInfoButton from 'components/ProfileInfoButton';
import Timer from 'components/Timer';
import { getBazaarForAsset, sourceAssetNames } from 'config/assets';
import BazaarTable from 'components/BazaarTable';
import SuccessButton from 'components/SucessButton';
import { getTokenByAddress } from 'constants/tokens';

const { Text } = Typography;
const { confirm } = Modal;
const { Panel } = Collapse;

const Wrapper = styled.div`
    position: relative;
    width: 100%;
    padding: 16px 118px;

    @media (max-width: 1200px) {
        padding: 16px 60px;
    }
`;

const BazaarTableOuter = styled.div`
    width: 100%;
    max-width: 1300px;
    margin: auto;
    text-align: center;
`;

const BoldColumn = styled.span`
    font-weight: 700;
    color: #33303E;
`;

const LoadMoreButton = styled(Button)`
    margin-top: 10px;
`;

const AssetWrapper = styled.div`
    max-height: 40px;
    max-width: 40px;
    width: 100%;
    font-size: 18px;
    position: relative;
    
    &:after {
        content: "";
        display: block;
        padding-top: 100%;
        width: 40px;
        height: 32px;
    }
`;

const TargetAssetIcon = styled.img`
    position: absolute;
    width: 25px;
    z-index: 6;

    ${({ theme }) => theme.dir == 'ltr' && `
        inset: auto 0px 0px auto;
    `}

    ${({ theme }) => theme.dir == 'rtl' && `
        inset: auto auto 0px 0px;
    `}
`;

const AssetContainer = styled.div`
    width: 40px;
    height: 32px;

    ${({ theme }) => theme.dir == 'ltr' && `
        padding-right: 8px;
    `}

    ${({ theme }) => theme.dir == 'rtl' && `
        padding-left: 8px;
    `}
`;

function List({ isLoading, isLoadingMore, items, refresh, loadMore, hasMore }) {
    const { t } = useTranslation();
    const bazaarContract = useBazaarContract();

    const dataColumns = [
        {
            title: t('Asset'),
            dataIndex: 'sourceAsset',
            key: 'sourceAsset',
            width: '15%',
            ellipsis: true,
            render: (v, item) => {
                const BazaarIcon = getBazaarForAsset(item.sourceAsset)?.icon;
                const targetAssetAddress = getTokenByAddress(item.targetAsset)?.address;

                if (!BazaarIcon) return

                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <AssetContainer>
                            <AssetWrapper>
                                <TargetAssetIcon
                                    src={`/images/tokens/${targetAssetAddress}.png`}
                                />
                                <BazaarIcon className='target-asset-icon' />
                            </AssetWrapper>
                        </AssetContainer>
                        <span>{t(sourceAssetNames[item.sourceAsset])}</span>
                    </div>
                );
            }
        },
        {
            title: t('Amount'),
            dataIndex: 'sourceAmount',
            key: 'sourceAmount',
            width: '10%',
            ellipsis: true,
            render: (v, item) => <BoldColumn>{transformSourceAmount(item.sourceAsset, item.sourceAmount)}</BoldColumn>
        },
        {
            title: t('Price'),
            dataIndex: 'targetAmount',
            key: 'targetAmount',
            width: '12%',
            ellipsis: true,
            render: (v, item) => <BoldColumn>{transformTargetAmount(item.targetAsset, item.targetAmount)}</BoldColumn>
        },
        {
            title: t('OrderID'),
            dataIndex: 'id',
            width: '8%',
            ellipsis: true,
            key: 'id',
        },
        {
            title: t('CreatedAt'),
            key: 'created_at',
            width: '12%',
            render: (v, item) => timestampInLocale(item.createdAt)
        },
        {
            title: t('Status'),
            dataIndex: 'state',
            key: 'state',
            width: '12%',
            ellipsis: true,
            render: (v, item) => orderStateInString(item.state)
        },
        {
            title: t('Actions'),
            key: 'actions',
            render: (v, item) => {
                return (
                    <Space direction='horizontal'>
                        <SuccessButton
                            onClick={handleApproveClick(item)}
                            disabled={!isItemApprovable(item)}
                            size="middle"
                            type="primary"
                            shape="round"
                            icon={<CheckOutlined />}
                        >
                            {t('Approve')}
                        </SuccessButton>
                        <Button
                            onClick={handleCancelClick(item)}
                            danger
                            disabled={!isItemCancellable(item)}
                            size="middle"
                            type="primary"
                            shape="round"
                            icon={<CloseCircleOutlined />}
                        >
                            <span>{t('Cancel Sale')}&nbsp;</span>
                            {isInCancellableState(item) && timeToCancel(item) > 0 && <Timer initialValue={timeToCancel(item)} />}
                        </Button>
                        <ProfileInfoButton
                            address={item.seller}
                            modalTitle={t('Seller')}
                            buttonTitle={t('Seller')}
                            isSeller
                        />
                    </Space>
                )
            }
        }
    ];

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
                    <Text type="secondary">{t('Buy Commission')}: </Text>
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
                    <Text type="secondary">{t('Buy Commission')}: </Text>
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

    return (
        <Wrapper>
            <BazaarTableOuter>
                <BazaarTable
                    dataSource={items}
                    columns={dataColumns}
                    loading={isLoading}
                    pagination={false}
                    size={'small'}
                    rowKey={'id'}
                />
                {
                    hasMore &&
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
                }

            </BazaarTableOuter>
        </Wrapper>
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

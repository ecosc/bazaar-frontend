import PropTypes from 'prop-types';
import { DownOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Typography, Modal, Space, message, Button } from "antd";
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
import { getBazaarForAsset, sourceAssetNames } from 'config/assets';
import BazaarTable from 'components/BazaarTable';
import SuccessButton from 'components/SucessButton';
import { getTokenByAddress } from 'constants/tokens';

const { Text } = Typography;
const { confirm } = Modal;

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
            title: t('Buyer'),
            dataIndex: 'buyer',
            key: 'buyer',
            width: '10%',
            render: (v, item) => item.buyer != AddressZero ? accountEllipsis(item.buyer) : '-'
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
                        {
                            item.state === orderStates.Placed &&
                            <Button
                                onClick={handleCloseClick(item)}
                                danger
                                disabled={!isItemClosable(item)}
                                size="middle"
                                type="primary"
                                shape="round"
                                icon={<CloseCircleOutlined />}
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
                                size="middle"
                                type="primary"
                                shape="round"
                                icon={<CloseCircleOutlined />}
                            >
                                <span>{t('Cancel Sale')}&nbsp;</span>
                                {isInCancellableState(item) && timeToCancel(item) > 0 && <Timer initialValue={timeToCancel(item)} />}
                            </Button>
                        }
                        {
                            (isInWithdrawableState(item) && remainingTime(item) > 0) &&
                            <SuccessButton
                                onClick={handleWithdrawClick(item)}
                                disabled={!isItemWithdrawable(item)}
                                size="middle"
                                type="primary"
                                shape="round"
                            >
                                <span>{t('Withdraw')}&nbsp;</span>
                                <span>{isInWithdrawableState(item) && remainingTime(item) > 0 && <Timer initialValue={remainingTime(item)} />}</span>
                            </SuccessButton>
                        }
                        {item.buyer != AddressZero &&
                            <ProfileInfoButton
                                address={item.buyer}
                                modalTitle={t('Buyer Info')}
                                buttonTitle={t('Buyer')}
                            />
                        }
                    </Space>
                )
            }
        }
    ];

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

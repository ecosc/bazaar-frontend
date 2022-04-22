import PropTypes from 'prop-types';
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import {
    Typography,
    Modal,
    Space,
    message,
    Button,
    Alert,
    Table
} from "antd";
import styled from "styled-components";
import BuyButton from "components/BuyButton";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { accountEllipsis, secondsToTime, transformSourceAmount, transformTargetAmount } from "utils/transforms";
import { calcBuyFee } from 'utils/fees';
import { BAZAAR_ADDRESS } from 'constants/addresses';
import { getTokenBalance } from 'hooks/useTokenBalance';
import { useBazaarContract } from 'hooks/useContracts';
import { APPROVE_STATES, useApproveToken } from 'hooks/useApproveToken';
import { useNavigate } from 'react-router-dom';
import { orderStateInString, orderStates } from 'utils/order';
import { sourceAssetNames } from 'config/assets';
import ProfileInfoButton from 'components/ProfileInfoButton';
import { useWeb3React } from '@web3-react/core';
import { BIG_ZERO } from 'utils/bigNumber';

const { Text } = Typography;
const { confirm } = Modal;

const Wrapper = styled.div`
    position: relative;
    width: 100%;
    padding: 16px 118px;
`;

const BazaarTableOuter = styled.div`
    width: 100%;
    max-width: 1300px;
    margin: auto;
    text-align: center;
`;

const BazaarTable = styled(Table)`
    border-radius: 25px !important;
    overflow: hidden;
    background: ${({ theme }) => theme.colors.cardBackground} !important;

    & > .ant-spin-nested-loading {
        padding: 34px 24px !important;
    }

    & > .ant-spin-nested-loading > .ant-spin-container {
        position: unset !important;
    }

    & > .ant-spin-nested-loading > .ant-spin-container > .ant-table > .ant-table-container > .ant-table-content > table > thead > tr > th {
        background: ${({ theme }) => theme.colors.cardBackground} !important;
        border: unset !important;
        font-weight: 600;
        padding-bottom: 20px !important;
    }

    & > .ant-spin-nested-loading > .ant-spin-container > .ant-table > .ant-table-container > .ant-table-content > table > thead > tr > th:before {
        display: none !important;
    }

    & > .ant-spin-nested-loading > .ant-spin-container > .ant-table > .ant-table-container > .ant-table-content > table > tbody > tr {
        background: ${({ theme }) => theme.colors.cardBackground} !important;
        color: #8D8B95 !important;
    }
`;

const BoldColumn = styled.span`
    font-weight: 700;
    color: #33303E;
`;

const LoadMoreButton = styled(Button)`
    margin-top: 10px;
`;

function List({ isLoading, items, refresh, loadMore, isLoadingMore, hasMore }) {
    const { t } = useTranslation();
    const [loadingBalance, setLoadingBalance] = useState(false);
    const bazaarContract = useBazaarContract();
    const { account } = useWeb3React();
    const navigate = useNavigate();

    const { state: approveState, approve } = useApproveToken(handleOnApproved);

    const dataColumns = [
        {
            title: t('Asset'),
            dataIndex: 'sourceAsset',
            key: 'sourceAsset',
            // width: '150px',
            render: (v, item) => t(sourceAssetNames[item.sourceAsset])
        },
        {
            title: t('Amount'),
            dataIndex: 'sourceAmount',
            key: 'sourceAmount',
            render: (v, item) => <BoldColumn>{transformSourceAmount(item.sourceAsset, item.sourceAmount)}</BoldColumn>
        },
        {
            title: t('Price'),
            dataIndex: 'targetAmount',
            key: 'targetAmount',
            render: (v, item) => <BoldColumn>{transformTargetAmount(item.targetAsset, item.targetAmount)}</BoldColumn>
        },
        {
            title: t('Seller'),
            dataIndex: 'seller',
            key: 'seller',
            render: (v, item) => accountEllipsis(item.seller)
        },
        {
            title: t('OrderID'),
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: t('Status'),
            dataIndex: 'state',
            key: 'state',
            // ellipsis: true,
            render: (v, item) => orderStateInString(item.state)
        },
        {
            title: t('Remaining Time'),
            dataIndex: 'state',
            key: 'state',
            render: (v, item) => {
                const now = Date.now();
                const remainingTime = Math.floor(item.deadline - (now / 1000));

                if (remainingTime <= 0) {
                    return <span style={{ color: '#C63B3B' }}>{t('Expired')}</span>
                }

                return <span style={{ color: '#23A981' }}>{secondsToTime(remainingTime)}</span>
            }
        },
        {
            title: t('Actions'),
            key: 'actions',
            render: (v, item) => {
                return <Space direction='horizontal'>
                    <BuyButton
                        onClick={handleBuyClick(item)}
                        loading={approveState === APPROVE_STATES.APPROVING || loadingBalance}
                        disabled={!isItemBuyable(item)}
                    />
                    <ProfileInfoButton
                        address={item.seller}
                        modalTitle={t('Seller Info')}
                        buttonTitle={t('Seller')}
                        isSeller
                    />
                </Space>
            }
        }
    ];

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

    function renderConfirmContent(item, balance) {
        const {
            targetAmount,
            targetAsset
        } = item;

        const buyFee = calcBuyFee(targetAmount);
        const totalPrice = targetAmount.add(buyFee);
        const canAfford = balance.gte(totalPrice);

        return (
            <Space direction="vertical">
                {!canAfford && <Alert message={t("You don't have enough token for buying order")} type="error" />}
                <div>
                    <Text type="secondary">{t('Buy Commission')}: </Text>
                    <Text>{transformTargetAmount(targetAsset, buyFee)}</Text>
                </div>
                <div>
                    <Text type="secondary">{t('Total Price')}: </Text>
                    <Text>{transformTargetAmount(targetAsset, totalPrice)}</Text>
                </div>
                <div>
                    <Text type="secondary">{t('Your Balance')}: </Text>
                    <Text>{transformTargetAmount(targetAsset, balance)}</Text>
                </div>
            </Space>
        );
    }

    function handleOnApproved({ item, balance }) {
        const {
            targetAmount,
        } = item;

        const buyFee = calcBuyFee(targetAmount);
        const totalPrice = targetAmount.add(buyFee);
        const canAfford = balance.gte(totalPrice);

        confirm({
            title: t('Confirm Transaction'),
            icon: <ExclamationCircleOutlined />,
            content: renderConfirmContent(item, balance),
            okButtonProps: { disabled: !canAfford },
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
        return async () => {
            const { targetAmount, targetAsset } = item;
            const buyFee = calcBuyFee(targetAmount);
            const totalPrice = buyFee.add(targetAmount);
            let balance;

            setLoadingBalance(true);

            try {
                balance = await getTokenBalance(targetAsset, account);
            } catch {
                balance = BIG_ZERO;
            }

            approve(BAZAAR_ADDRESS, targetAsset, totalPrice, { item, balance });

            setLoadingBalance(false);
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

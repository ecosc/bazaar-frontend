import PropTypes from 'prop-types';
import { DownOutlined } from '@ant-design/icons';
import {
    Space,
    Button
} from "antd";
import styled from "styled-components";
import BuyButton from "components/BuyButton";
import React from "react";
import { useTranslation } from "react-i18next";
import { accountEllipsis, secondsToTime, transformSourceAmount, transformTargetAmount } from "utils/transforms";
import { orderStateInString, orderStates } from 'utils/order';
import { getBazaarByID, sourceAssetNames } from 'config/assets';
import ProfileInfoButton from 'components/ProfileInfoButton';
import BazaarTable from 'components/BazaarTable';
import { getTokenByAddress } from 'constants/tokens';

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

function List({ isLoading, items, refresh, loadMore, isLoadingMore, hasMore, currentBazaar }) {
    const { t } = useTranslation();

    const dataColumns = [
        {
            title: t('Asset'),
            dataIndex: 'sourceAsset',
            key: 'sourceAsset',
            width: '15%',
            ellipsis: true,
            render: (v, item) => {
                const BazaarIcon = getBazaarByID(currentBazaar).icon;
                const targetAssetAddress = getTokenByAddress(item.targetAsset)?.address;

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
            title: t('Seller'),
            dataIndex: 'seller',
            key: 'seller',
            width: '10%',
            render: (v, item) => accountEllipsis(item.seller)
        },
        {
            title: t('OrderID'),
            dataIndex: 'id',
            width: '8%',
            ellipsis: true,
            key: 'id',
        },
        {
            title: t('Status'),
            dataIndex: 'state',
            key: 'state',
            width: '10%',
            ellipsis: true,
            render: (v, item) => orderStateInString(item.state)
        },
        {
            title: t('Remaining Time'),
            dataIndex: 'state',
            key: 'state',
            width: '12%',
            ellipsis: true,
            render: (v, item) => {
                const now = Date.now();
                const remainingTime = Math.floor(item.deadline - (now / 1000));

                if (remainingTime <= 0 || item.state !== orderStates.Placed) {
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
                    <BuyButton item={item} />
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
                    scroll={{ x: 1000, y: '100%' }}
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
    currentBazaar: PropTypes.string,
};

export default List;

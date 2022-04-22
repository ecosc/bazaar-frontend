import PropTypes from 'prop-types';
import { Button, Modal, Space, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useState } from 'react';
import { getProfile } from 'state/profile/helpers';
import { getBazaarContract } from 'hooks/useContracts';
import { UserOutlined } from '@ant-design/icons'

const { info } = Modal;
const { Text } = Typography;

async function getSellerInfo(seller) {
    const bazaarContract = getBazaarContract();

    return bazaarContract.sellerMetrics(seller);
}

async function getBuyerInfo(buyer) {
    const bazaarContract = getBazaarContract();

    return bazaarContract.buyerMetrics(buyer);
}

function renderSellerMetrics(t, metrics) {
    return (
        <>
            <div>
                <Text type="secondary">{t('Total Sale Orders')}: </Text>
                <Text>{metrics.totalSaleOrders.toNumber()}</Text>
            </div>
            <div>
                <Text type="secondary">{t('Total Sold Orders')}: </Text>
                <Text>{metrics.soldOrders.toNumber()}</Text>
            </div>
            <div>
                <Text type="secondary">{t('Total Delivered Orders')}: </Text>
                <Text>{metrics.deliveredOrders.toNumber()}</Text>
            </div>
            <div>
                <Text type="secondary">{t('Total Cancelled Orders')}: </Text>
                <Text>{metrics.cancelledSeller.toNumber()}</Text>
            </div>
            <div>
                <Text type="secondary">{t('Total Cancelled Orders(By Buyer)')}: </Text>
                <Text>{metrics.cancelledBuyer.toNumber()}</Text>
            </div>
        </>
    );
}

function renderBuyerMetrics(t, metrics) {
    return (
        <>
            <div>
                <Text type="secondary">{t('Total Bought Orders')}: </Text>
                <Text>{metrics.boughtOrders.toNumber()}</Text>
            </div>
            <div>
                <Text type="secondary">{t('Total Delivered Orders')}: </Text>
                <Text>{metrics.deliveredOrders.toNumber()}</Text>
            </div>
            <div>
                <Text type="secondary">{t('Total Cancelled Orders')}: </Text>
                <Text>{metrics.cancelledBuyer.toNumber()}</Text>
            </div>
            <div>
                <Text type="secondary">{t('Total Cancelled Orders(By Seller)')}: </Text>
                <Text>{metrics.cancelledSeller.toNumber()}</Text>
            </div>
        </>
    );
}

function ProfileInfoButton({ address, onClosed, modalTitle, onClick, buttonTitle, isSeller, ...props }) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);

    const handleOnClick = (e) => {
        setIsLoading(true);
        onClick && onClick(e);

        const calls = [getProfile(address), isSeller ? getSellerInfo(address) : getBuyerInfo(address)];

        Promise.all(calls).then(([profile, metrics]) => {
            info({
                title: modalTitle,
                closable: true,
                width: '600px',
                content: (
                    <Space direction="vertical">
                        <div>
                            <Text type="secondary">{t('Wallet Address')}: </Text>
                            <Text copyable>{address}</Text>
                        </div>
                        <div>
                            <Text type="secondary">{t('Name')}: </Text>
                            <Text copyable>{profile.name}</Text>
                        </div>
                        <div>
                            <Text type="secondary">{t('Contact Info')}: </Text>
                            <Text copyable>{[profile.contact]}</Text>
                        </div>
                        {
                            isSeller ? renderSellerMetrics(t, metrics) : renderBuyerMetrics(t, metrics)
                        }
                    </Space>
                ),
                onOk() {
                    onClosed && onClosed();
                },
                onCancel() {
                    onClosed && onClosed();
                },
            })
        }).finally(() => setIsLoading(false));
    }

    return (
        <Button
            style={{ alignSelf: 'center' }}
            size="middle"
            type="primary"
            shape="round"
            loading={isLoading}
            onClick={handleOnClick}
            icon={<UserOutlined />}
            {...props}
        >
            {buttonTitle}
        </Button>
    );
}

ProfileInfoButton.propTypes = {
    address: PropTypes.string,
    onClosed: PropTypes.func,
    modalTitle: PropTypes.string,
    buttonTitle: PropTypes.string,
    isSeller: PropTypes.bool,
};

export default ProfileInfoButton;

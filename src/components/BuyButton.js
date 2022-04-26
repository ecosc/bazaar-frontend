import { useWeb3React } from "@web3-react/core";
import { ShoppingCartOutlined } from '@ant-design/icons'
import { useProfile } from "hooks/useProfile";
import { useTranslation } from "react-i18next";
import ConnectWalletButton from "./ConnectWalletButton";
import CreateProfileButton from "./CreateProfileButton";
import SuccessButton from "./SucessButton";
import { APPROVE_STATES, useApproveToken } from "hooks/useApproveToken";
import { useState } from "react";
import { useBazaarContract } from "hooks/useContracts";
import { orderStates } from "utils/order";
import { calcBuyFee } from "utils/fees";
import { transformTargetAmount } from "utils/transforms";
import { Alert, message, Modal, Space, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { getTokenBalance } from "hooks/useTokenBalance";
import { BIG_ZERO } from "utils/bigNumber";
import { BAZAAR_ADDRESS } from "constants/addresses";
import { notifyError, notifySuccess } from "utils/notification";

const { Text } = Typography;
const { confirm } = Modal;

function BuyButton({ item, ...props }) {
    const { t } = useTranslation();
    const { hasProfile } = useProfile();
    const { account } = useWeb3React();
    const [loadingBalance, setLoadingBalance] = useState(false);
    const bazaarContract = useBazaarContract();
    const { state: approveState, approve } = useApproveToken(handleOnApproved);
    const navigate = useNavigate();

    if (!account) {
        return <ConnectWalletButton size="middle" label={t('Connect')} />
    }

    if (!hasProfile) {
        return <CreateProfileButton size="middle" />
    }

    const now = Date.now();
    const remainingTime = Math.floor(item.deadline - (now / 1000));
    const isItemBuyable = remainingTime <= 0 ? false : item.state == orderStates.Placed;

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
            // icon: <ExclamationCircleOutlined />,
            content: renderConfirmContent(item, balance),
            okButtonProps: { disabled: !canAfford },
            onOk() {
                return bazaarContract.buy(item.id).
                    then(() => {
                        notifySuccess(
                            t("Order buy requested"),
                            t("Your order buy requested successfully"),
                        );
                        navigate('/purchases');
                    }).
                    catch(e => {
                        console.error(e);
                        notifyError(
                            t('Error'),
                            t('Error while buying order')
                        );
                    });
            },
        });
    }

    const handleBuyClick = async () => {
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

    return (
        <SuccessButton
            size="middle"
            type="primary"
            shape="round"
            icon={<ShoppingCartOutlined />}
            onClick={handleBuyClick}
            loading={approveState === APPROVE_STATES.APPROVING || loadingBalance}
            disabled={!isItemBuyable}
            {...props}
        >
            {t('Buy')}
        </SuccessButton>
    );
}

export default BuyButton;

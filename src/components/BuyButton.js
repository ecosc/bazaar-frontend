import { useWeb3React } from "@web3-react/core";
import { ShoppingCartOutlined } from '@ant-design/icons'
import { useProfile } from "hooks/useProfile";
import { useTranslation } from "react-i18next";
import ConnectWalletButton from "./ConnectWalletButton";
import CreateProfileButton from "./CreateProfileButton";
import SuccessButton from "./SucessButton";

function BuyButton({ ...props }) {
    const { t } = useTranslation();
    const { hasProfile } = useProfile();
    const { account } = useWeb3React();

    if (!account) {
        return <ConnectWalletButton size="middle" label={t('Connect')}/>
    }

    if (!hasProfile) {
        return <CreateProfileButton size="middle" />
    }

    return (
        <SuccessButton
            size="middle"
            type="primary"
            shape="round"
            icon={<ShoppingCartOutlined />}
            {...props}
        >
            {t('Buy')}
        </SuccessButton>
    );
}

export default BuyButton;

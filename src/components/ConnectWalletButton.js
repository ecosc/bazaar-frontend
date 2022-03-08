import { Button } from "antd";
import { useConnectWallet } from "hooks/useConnectWallet";
import { useTranslation } from "react-i18next";


function ConnectWalletButton() {
    const { t } = useTranslation();
    const { openModal } = useConnectWallet();

    return (
        <Button style={{ alignSelf: 'center' }} onClick={openModal} size="large" type="primary" shape="round">
            {t('Connect Wallet')}
        </Button>
    );
}

export default ConnectWalletButton;

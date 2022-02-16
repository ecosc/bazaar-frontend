import { Button } from "antd";
import connectors, { connectorLocalStorageKey, walletLocalStorageKey } from "constants/connectors";
import useAuth from "hooks/useAuth";
import { connectorNames } from "iweb3";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";


function ConnectWalletButton() {
    const { t } = useTranslation();
    const { login } = useAuth();
    const walletConfig = connectors[0];

    // TODO: centralize login logic
    const connectWallet = (walletConfig) => {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

        // Since iOS does not support Trust Wallet we fall back to WalletConnect
        if (walletConfig.title === "Trust Wallet" && isIOS) {
            login(connectorNames.WalletConnect);
        } else {
            login(walletConfig.connectorId);
        }

        localStorage.setItem(walletLocalStorageKey, walletConfig.title);
        localStorage.setItem(connectorLocalStorageKey, walletConfig.connectorId);
    }

    return (
        <Button style={{alignSelf: 'center'}} onClick={() => connectWallet(walletConfig)} size="large" type="primary" shape="round">
            {t('Connect Wallet')}
        </Button>
    );
}

export default ConnectWalletButton;

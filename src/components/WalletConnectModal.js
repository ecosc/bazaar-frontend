import { Modal } from 'antd';
import useAuth from 'hooks/useAuth';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import connectors, { connectorLocalStorageKey, walletLocalStorageKey } from "constants/connectors";
import { connectorNames } from 'iweb3';
import { useConnectWallet } from 'hooks/useConnectWallet';

const WalletList = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 15px;
    text-align: center;
`;

const WalletItem = styled.div`
    background: ${({ theme }) => theme.colors.inputBackground};
    padding: 10px;
    border-radius: 25px;
    text-align: center;
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:hover {
        background: ${({ theme }) => theme.colors.inputSecondary};
    }
`;

export function WalletConnectModal() {
    const { t } = useTranslation();
    const { login } = useAuth();
    const { closeModal, visible } = useConnectWallet();

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

    const handleConnectClick = (connector) => {
        return () => {
            closeModal();
            connectWallet(connector);
        }
    }

    const handleCancelClick = () => {
        closeModal();
    }

    return (
        <Modal
            footer={null}
            visible={visible}
            closable
            title={t('Connect Wallet')}
            onCancel={handleCancelClick}
        >
            <WalletList>
                {
                    connectors.map(connector => (
                        <WalletItem key={connector.title} onClick={handleConnectClick(connector)}>
                            <span style={{ margin: '0 5px' }}>{connector.title}</span>
                            {<connector.icon />}
                        </WalletItem>
                    ))
                }
            </WalletList>
        </Modal>
    );
}
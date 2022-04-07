import { Modal } from 'antd';
import useAuth from 'hooks/useAuth';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import connectors, { connectorLocalStorageKey, walletLocalStorageKey } from "constants/connectors";
import { connectorNames } from 'iweb3';
import { useConnectWallet } from 'hooks/useConnectWallet';
import { ReactComponent as WalletSvg } from 'assets/images/wallet-dark.svg';
import {
    ArrowLeftOutlined,
    ArrowRightOutlined
} from '@ant-design/icons';
import Icon from '@ant-design/icons';
import { getDirection } from 'localization';


const StyledModal = styled(Modal)`
    & > .ant-modal-content > .ant-modal-header {
        border: unset;
        text-align: center;
        padding-top: 40px;
    }

    & > .ant-modal-content > .ant-modal-header > .ant-modal-title {
        font-size: 22px;
        font-weight: 700;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
`;

const MainList = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 15px;
    text-align: center;
    margin-bottom: 15px;
`;

const WalletList = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 15px;
    text-align: center;
`;

const WalletItem = styled.div`
    background: ${({ theme }) => theme.colors.text};
    box-shadow: 0px 14px 24px -10px rgba(14, 12, 44, 0.16);
    padding: 10px;
    border-radius: 25px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-content: center;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:hover {
        opacity: 0.7;
    }
`;

const MainWalletItem = styled(WalletItem)`
    flex-direction: row;
    justify-content: space-evenly;
`;

export function WalletConnectModal() {
    const { t } = useTranslation();
    const { login } = useAuth();
    const { closeModal, visible } = useConnectWallet();
    const dir = getDirection();

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

    const mainIcon = dir === 'rtl' ? <ArrowLeftOutlined /> : <ArrowRightOutlined />;

    return (
        <StyledModal
            footer={null}
            visible={visible}
            closable={false}
            title={
                <>
                    <Icon component={WalletSvg} style={{ marginBottom: '8px', fontSize: '35px' }} />
                    {t('Connect Wallet')}
                </>
            }
            onCancel={handleCancelClick}
            width={'480px'}
        >
            <MainList>
                {
                    connectors.filter(conn => {
                        if (conn.title === 'Metamask' || conn.title === 'WalletConnect') {
                            return true;
                        }

                        return false;
                    }).map(connector => (
                        <MainWalletItem key={connector.title} onClick={handleConnectClick(connector)}>
                            {<connector.icon width={'40px'} />}
                            <span style={{ margin: '5px 0' }}>{connector.title}</span>
                            {mainIcon}
                        </MainWalletItem>
                    ))
                }
            </MainList>
            <WalletList>
                {
                    connectors.filter(conn => {
                        if (conn.title === 'Metamask' || conn.title === 'WalletConnect') {
                            return false;
                        }

                        return true;
                    }).map(connector => (
                        <WalletItem key={connector.title} onClick={handleConnectClick(connector)}>
                            {<connector.icon width={'40px'} />}
                            <span style={{ margin: '5px 0' }}>{connector.title}</span>
                        </WalletItem>
                    ))
                }
            </WalletList>
        </StyledModal>
    );
}
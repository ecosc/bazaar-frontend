import { Button } from "antd";
import Icon from '@ant-design/icons';
import { useConnectWallet } from "hooks/useConnectWallet";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { ReactComponent as WalletSvg } from 'assets/images/wallet.svg';

const StyledButton = styled(Button)`
    height: 44px;
    background: ${({ theme }) => theme.colors.connectWalletBackground};
    border: none !important;
    align-self: center;

    font-style: normal;
    font-weight: 700;
    font-size: 16px !important;
    line-height: 20px;

    &:hover, &:focus {
        background: ${({ theme }) => theme.colors.connectWalletBackgroundFocus};
    } 
`;


function ConnectWalletButton() {
    const { t } = useTranslation();
    const { openModal } = useConnectWallet();

    return (
        <StyledButton onClick={openModal} type="primary" shape="round" icon={<Icon component={WalletSvg} />}>
            {t('Connect Wallet')}
        </StyledButton>
    );
}

export default ConnectWalletButton;

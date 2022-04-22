import { useWeb3React } from "@web3-react/core";
import { Button } from "antd";
import { ShoppingCartOutlined } from '@ant-design/icons'
import { useProfile } from "hooks/useProfile";
import { useTranslation } from "react-i18next";
import ConnectWalletButton from "./ConnectWalletButton";
import CreateProfileButton from "./CreateProfileButton";
import styled from "styled-components";

const StyledButton = styled(Button)`
    background: #23A981 !important;
    border: 2px solid rgba(255, 255, 255, 0.1) !important;
    color: white !important;

    ${({ disabled }) => disabled && `
        opacity: 0.3;
    `}
`;

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
        <StyledButton
            size="middle"
            type="primary"
            shape="round"
            icon={<ShoppingCartOutlined />}
            {...props}
        >
            {t('Buy')}
        </StyledButton>
    );
}

export default BuyButton;

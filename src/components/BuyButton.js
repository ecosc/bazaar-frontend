import PropTypes from 'prop-types';
import { useWeb3React } from "@web3-react/core";
import { Button } from "antd";
import { ShoppingCartOutlined } from '@ant-design/icons'
import { useProfile } from "hooks/useProfile";
import { useTranslation } from "react-i18next";
import ConnectWalletButton from "./ConnectWalletButton";
import CreateProfileButton from "./CreateProfileButton";

function BuyButton({ ...props }) {
    const { t } = useTranslation();
    const { hasProfile } = useProfile();
    const { account } = useWeb3React();

    if (!account) {
        return <ConnectWalletButton />
    }

    if (!hasProfile) {
        return <CreateProfileButton />
    }

    return (
        <Button
            style={{ alignSelf: 'center' }}
            size="large"
            type="primary"
            shape="round"
            icon={<ShoppingCartOutlined />}
            {...props}
        >
            {t('Buy')}
        </Button>
    );
}

export default BuyButton;

import PropTypes from 'prop-types';
import { Button, Modal, Space, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useState } from 'react';
import { getProfile } from 'state/profile/helpers';

const { info } = Modal;
const { Text } = Typography;

function ProfileInfoButton({ address, onClosed, modalTitle, onClick, buttonTitle, ...props }) {
    const { t } = useTranslation();
    const [ isLoading, setIsLoading ] = useState(false);

    const handleOnClick = (e) => {
        setIsLoading(true);
        onClick && onClick(e);

        getProfile(address).then((profile) => {
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
                    </Space>

                ),
                onOk() {
                    onClosed && onClosed();
                },
                onCancel() {
                    onClosed && onClosed();
                },
            });
        }).finally(() => setIsLoading(false));
    }

    return (
        <Button
            style={{ alignSelf: 'center' }}
            size="large"
            type="primary"
            shape="round"
            loading={isLoading}
            onClick={handleOnClick}
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
};

export default ProfileInfoButton;

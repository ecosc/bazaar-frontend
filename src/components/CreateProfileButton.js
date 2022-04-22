import { Button } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { UserAddOutlined } from '@ant-design/icons'

function CreateProfileButton(props) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <Button
            style={{ alignSelf: 'center' }}
            onClick={() => navigate('/profile/create')}
            size="large"
            type="primary"
            shape="round" {...props}
            icon={<UserAddOutlined />}
        >
            {t('Create Profile')}
        </Button>
    );
}

export default CreateProfileButton;

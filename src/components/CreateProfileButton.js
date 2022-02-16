import { Button } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function CreateProfileButton() {
    const {t} = useTranslation();
    const navigate = useNavigate();
    
    return (
        <Button style={{alignSelf: 'center'}} onClick={() => navigate('/profile/create')} size="large" type="primary" shape="round">
            {t('Create Profile')}
        </Button>
    );
}

export default CreateProfileButton;

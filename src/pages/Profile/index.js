import { useWeb3React } from "@web3-react/core";
import { EditOutlined,
    UserOutlined,
    ArrowLeftOutlined,
    ArrowRightOutlined
} from '@ant-design/icons';
import { Card, Col, Typography, Space, Button } from "antd";
import CreateProfileButton from "components/CreateProfileButton";
import { useProfile } from "hooks/useProfile";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { getDirection } from "localization";

const { Text } = Typography;

const ProfileWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 32px 32px 0 32px;
`;

const ProfileCard = styled(Card)`
    text-align: center;
`;

function Profile() {
    const { t } = useTranslation();
    const { account } = useWeb3React();
    const navigate = useNavigate();
    const { hasProfile, profile, isLoading } = useProfile();
    const dir = getDirection();

    const backButton = () => {
        const icon = dir === 'rtl' ? <ArrowLeftOutlined /> : <ArrowRightOutlined />;

        return <Button onClick={() => navigate(-1)} icon={icon} type="primary" shape="circle" />
    }

    return (
        <ProfileWrapper>
            <Col span={8} xl={10} lg={16} md={16} sm={24} xs={24}>
                <ProfileCard
                    title={
                        <>
                            <UserOutlined />
                            <span>{t('Profile')}</span>
                        </>
                    }
                    bordered={false}
                    loading={isLoading}
                    actions={[
                        <EditOutlined key="edit" onClick={() => navigate('/profile/edit')} />
                    ]}
                    extra={backButton()}
                >
                    {
                        (!hasProfile || !account) ? <CreateProfileButton /> :
                            <Space direction="vertical">
                                <Text type="secondary">{t('Wallet Address')}:</Text>
                                <Text copyable>{account}</Text>
                                <Text type="secondary">{t('Name')}:</Text>
                                <Text>{profile.name}</Text>
                                <Text type="secondary">{t('Contact Info')}:</Text>
                                <Text copyable>{profile.contact}</Text>
                            </Space>
                    }
                </ProfileCard>
            </Col>
        </ProfileWrapper>
    );
}

export default Profile;

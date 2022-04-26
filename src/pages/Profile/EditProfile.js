import { useWeb3React } from "@web3-react/core";
import {
    ArrowLeftOutlined,
    ArrowRightOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Button, Card, Col, Divider, Form, Input } from "antd";
import ConnectWalletButton from "components/ConnectWalletButton";
import { useProfileContract } from "hooks/useContracts";
import { useProfile } from "hooks/useProfile";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setProfile } from "state/profile";
import styled from "styled-components";
import CreateProfileButton from "components/CreateProfileButton";
import { getDirection } from "localization";
import SubmitButton from "components/SubmitButton";
import { notifyError, notifySuccess } from "utils/notification";

const ProfileWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 32px 32px 0 32px;
`;

const ProfileCard = styled(Card)`
    & > .ant-card-head {
        text-align: center;
    }

    & > .ant-card-body {
        display: flex;
        flex-direction: column;
    }
`;

const UpdateAccountForm = styled(Form)`
    display: flex;
    flex-direction: column;

    & > div {
        margin-bottom: 16px;
    }
`;

function EditProfile() {
    const { t } = useTranslation();
    const { hasProfile, profile, isLoading: isProfileLoading } = useProfile();
    const { account } = useWeb3React();
    const profileContract = useProfileContract();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const [isTouched, setIsTouched] = useState(false);

    const dir = getDirection();

    useEffect(() => {
        if (account && hasProfile) {
            form.setFieldsValue({
                name: profile.name,
                contact: profile.contact,
            });
        }
    }, [account, hasProfile]);

    const handleOnSubmit = (values) => {
        setIsLoading(true);
        const name = values.name;
        const contact = values.contact;

        profileContract.updateAccount(name, contact).then(r => {
            notifySuccess(t('Account updated'), t('Your account info updated successfully'));
            dispatch(setProfile({ name, contact }));
            navigate('/profile');
        }).catch(e => {
            setIsLoading(false);
            notifyError(t('Error'), t('Error while updating account'));
        });
    }

    const handleOnChange = () => {
        const values = form.getFieldsValue();

        if (values.name != profile.name || values.contact != profile.contact) {
            setIsTouched(true);
        } else {
            setIsTouched(false);
        }
    }

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
                            <span>{t('Edit Profile')}</span>
                        </>
                    }
                    bordered={false}
                    loading={isProfileLoading}
                    extra={backButton()}
                >
                    {
                        !account ? <ConnectWalletButton /> : !hasProfile ? <CreateProfileButton /> : (
                            <UpdateAccountForm
                                form={form}
                                name="create-account-form"
                                onFinish={handleOnSubmit}
                                onChange={handleOnChange}
                                layout="vertical"
                                requiredMark={false}
                            >
                                <Form.Item name="name" label={t('Name')} rules={[{ required: true }]}>
                                    <Input placeholder={t('Enter your name')} />
                                </Form.Item>
                                <Form.Item name="contact" label={t('Contact Info')} rules={[{ required: true }]}>
                                    <Input placeholder={t('Enter your contact info')}/>
                                </Form.Item>
                                <Divider />
                                <SubmitButton type="primary" shape="round" size="large" htmlType="submit" loading={isLoading} disabled={!isTouched}>
                                    {t('Update Account')}
                                </SubmitButton>
                            </UpdateAccountForm>
                        )
                    }
                </ProfileCard>
            </Col>
        </ProfileWrapper>
    );
}

export default EditProfile;

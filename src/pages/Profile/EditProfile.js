import { useWeb3React } from "@web3-react/core";
import { Button, Card, Col, Form, Input, message } from "antd";
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
`;

const SubmitButton = styled(Button)`
    margin-top: 1rem;
    align-self: center;
    height: 56px !important;
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
            message.success(t('Account updated'));
            dispatch(setProfile({name,contact}));
            navigate('/profile');
        }).catch(e => {
            setIsLoading(false);
            message.error(t('Error while updating account'));
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

    return (
        <ProfileWrapper>
            <Col span={8} xl={10} lg={16} md={16} sm={24} xs={24}>
                <ProfileCard title={t('Edit Profile')} bordered={false} loading={isProfileLoading}>
                    {
                        !account ? <ConnectWalletButton /> : !hasProfile ? <CreateProfileButton /> : (
                            <UpdateAccountForm form={form} name="create-account-form" onFinish={handleOnSubmit} onChange={handleOnChange}>
                                <Form.Item name="name" label={t('Name')} rules={[{ required: true, message: t('name is required') }]}>
                                    <Input className="ltr-input" />
                                </Form.Item>
                                <Form.Item name="contact" label={t('Contact Info')} rules={[{ required: true, message: t('contact info is required') }]}>
                                    <Input className="ltr-input" />
                                </Form.Item>
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

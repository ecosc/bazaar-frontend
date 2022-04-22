import { useWeb3React } from "@web3-react/core";
import { Button, Card, Col, Form, Input, message, Typography, Modal, Space, Alert } from "antd";
import { UserOutlined } from '@ant-design/icons';
import ConnectWalletButton from "components/ConnectWalletButton";
import { useProfileContract } from "hooks/useContracts";
import { useProfile } from "hooks/useProfile";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setProfile } from "state/profile";
import styled from "styled-components";
import tokens from "constants/tokens";
import { CREATE_PROFILE_FEE } from "constants/fees";
import useTokenBalance from "hooks/useTokenBalance";
import { transformTargetAmount } from "utils/transforms";
import { APPROVE_STATES, useApproveToken } from "hooks/useApproveToken";
import { PROFILE_ADDRESS } from "constants/addresses";
import SubmitButton from "components/SubmitButton";

const { Text } = Typography;
const { confirm } = Modal;

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

const CreateAccountForm = styled(Form)`
    display: flex;
    flex-direction: column;
`;


function CreateProfile() {
    const { t } = useTranslation();
    const { hasProfile } = useProfile();
    const { account } = useWeb3React();
    const profileContract = useProfileContract();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const { balance: ecuBalance } = useTokenBalance(tokens.ecu.address);
    const { state: approveState, approve } = useApproveToken(handleOnApproved);

    useEffect(() => {
        if (hasProfile) {
            navigate('/profile');
        }
    }, [hasProfile]);

    function renderConfirmContent() {
        const canAfford = ecuBalance.gte(CREATE_PROFILE_FEE);

        return (
            <Space direction="vertical">
                {!canAfford && <Alert message={t("You don't have enough ECU token for creating account")} type="error" />}
                <div>
                    <Text type="secondary">{t('Create Profile Fee')}: </Text>
                    <Text>{transformTargetAmount(tokens.ecu.address, CREATE_PROFILE_FEE)}</Text>
                </div>
                <div>
                    <Text type="secondary">{t('Your Balance')}: </Text>
                    <Text>{transformTargetAmount(tokens.ecu.address, ecuBalance)}</Text>
                </div>
            </Space>
        );
    }

    function handleOnApproved({ name, contact }) {
        const canAfford = ecuBalance.gte(CREATE_PROFILE_FEE);

        confirm({
            title: t('Confirm Transaction'),
            content: renderConfirmContent(),
            closable: true,
            okButtonProps: { disabled: !canAfford },
            onOk() {
                return profileContract.createAccount(name, contact).then(r => {
                    message.success(t('Account created'));
                    dispatch(setProfile({
                        name,
                        contact
                    }));
                    navigate('/profile');
                }).catch(e => {
                    message.error(t('Error while creating account'));
                });
            },
        });
    }

    const handleOnSubmit = (values) => {
        const name = values.name;
        const contact = values.contact;

        approve(PROFILE_ADDRESS, tokens.ecu.address, CREATE_PROFILE_FEE, { name, contact });
    }

    return (
        <ProfileWrapper>
            <Col span={8} xl={10} lg={16} md={16} sm={24} xs={24}>
                <ProfileCard
                    title={
                        <>
                            <UserOutlined />
                            <span>{t('Create Profile')}</span>
                        </>
                    }
                    bordered={false}
                >
                    {
                        !account ? <ConnectWalletButton large/> : (
                            <CreateAccountForm
                                form={form}
                                name="create-account-form"
                                onFinish={handleOnSubmit}
                                layout="vertical"
                                requiredMark={false}
                            >
                                <Form.Item name="name" label={t('Name')} rules={[{ required: true }]}>
                                    <Input placeholder={t('Enter your name')} />
                                </Form.Item>
                                <Form.Item name="contact" label={t('Contact Info')} rules={[{ required: true }]}>
                                    <Input placeholder={t('Enter your contact info')}/>
                                </Form.Item>
                                <SubmitButton
                                    type="primary"
                                    shape="round"
                                    size="large"
                                    htmlType="submit"
                                    loading={approveState == APPROVE_STATES.APPROVING}
                                >
                                    {t('Create Account')}
                                </SubmitButton>
                            </CreateAccountForm>
                        )
                    }
                </ProfileCard>
            </Col>
        </ProfileWrapper >
    );
}

export default CreateProfile;

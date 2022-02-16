import { useWeb3React } from "@web3-react/core";
import { Button, Card, Col, Form, Input, message, Select, Space, Typography, Modal } from "antd";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ConnectWalletButton from "components/ConnectWalletButton";
import { useProfile } from "hooks/useProfile";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import tokens from "constants/tokens";
import { BAZAAR_ADDRESS } from "constants/addresses";
import { useBazaarContract } from "hooks/useContracts";
import CreateProfileButton from "components/CreateProfileButton";
import { parseUnits } from "ethers/lib/utils";
import { BigNumber } from "ethers";
import useTokenBalance, { FetchStatus } from "hooks/useTokenBalance";
import { sourceAssets, transformTargetAmount } from "utils/transforms";
import { calcGuaranteeAmount, calcSellFee } from "utils/fees";
import { APPROVE_STATES, useApproveToken } from "hooks/useApproveToken";
import { useEffect } from "react";

const { Option } = Select;
const { confirm } = Modal;
const { Text } = Typography;

const OrderWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 32px 32px 0 32px;
`;

const OrderCard = styled(Card)`
    & > .ant-card-head {
        text-align: center;
    }

    & > .ant-card-body {
        display: flex;
        flex-direction: column;
    }
`;

const CreateOrderForm = styled(Form)`
    display: flex;
    flex-direction: column;
`;

const SubmitButton = styled(Button)`
    margin-top: 1rem;
    align-self: center;
    height: 56px !important;
`;

const InlinedFormItem = styled(Form.Item)`
    &:first-child {
        ${({ theme }) => theme.dir == 'rtl' && `
            margin-right: 0 !important;
        `}
        ${({ theme }) => theme.dir == 'ltr' && `
            margin-left: 0 !important;
        `}
    }

    display: inline-block;
    width: calc(50% - 8px);
    ${({ theme }) => theme.dir == 'rtl' && `
        margin-right: 16px !important;
    `}
    ${({ theme }) => theme.dir == 'ltr' && `
        margin-left: 16px !important;
    `}
`


function CreateOrder() {
    const { t } = useTranslation();
    const { hasProfile, profile, isLoading: isProfileLoading } = useProfile();
    const { account } = useWeb3React();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const bazaarContract = useBazaarContract();
    const { balance: busdBalance, fetchStatus: busdBalanceStatus } = useTokenBalance(tokens.busd.address);
    const { state: approveState, approve } = useApproveToken(handleOnApproved);

    useEffect(() => {
        if (!isProfileLoading && !profile) {
            navigate('/');
        }
    }, [isProfileLoading, profile])

    const initialValues = {
        sourceAsset: sourceAssets.GOLD,
        targetAsset: tokens.busd.address
    };

    const getFormValues = () => {
        const values = form.getFieldsValue();

        const sourceAmount = BigNumber.from(values.sourceAmount);
        const targetAmount = parseUnits(values.targetAmount, tokens.busd.decimals);
        const timeout = BigNumber.from(parseInt(values.timeout) * 60); // minute to seconds
        const sourceAsset = values.sourceAsset;
        const targetAsset = values.targetAsset;

        return {
            sourceAmount,
            targetAmount,
            sourceAsset,
            targetAsset,
            timeout,
        };
    }

    const renderConfirmContent = () => {
        const {
            targetAmount,
            targetAsset
        } = getFormValues();

        const guaranteeAmount = calcGuaranteeAmount(targetAmount);
        const sellFee = calcSellFee(targetAmount);
        const totalIncome = targetAmount.sub(sellFee);

        return (
            <Space direction="vertical">
                <div>
                    <Text type="secondary">{t('Guarantee Amount')}: </Text>
                    <Text>{transformTargetAmount(targetAsset, guaranteeAmount)}</Text>
                </div>
                <div>
                    <Text type="secondary">{t('Sell Fee')}: </Text>
                    <Text>{transformTargetAmount(targetAsset, sellFee)}</Text>
                </div>
                <div>
                    <Text type="secondary">{t('Total Income')}: </Text>
                    <Text>{transformTargetAmount(targetAsset, totalIncome)}</Text>
                </div>
                <div>
                    <Text type="secondary">{t('Your Balance')}: </Text>
                    <Text>{transformTargetAmount(targetAsset, busdBalance)}</Text>
                </div>
                <Text type="warning">* {t("Guarantee amount will be returned to you if there were no conflicts")}</Text>
                <Text type="danger">* {t("In case of conflict between you and buyer, you guarantee amount will be blocked till jury voting ends")}</Text>
            </Space>
        );
    }

    function handleOnApproved() {
        const {
            sourceAsset,
            sourceAmount,
            targetAsset,
            targetAmount,
            timeout
        } = getFormValues();

        const guaranteeAmount = calcGuaranteeAmount(targetAmount);
        const canAfford = busdBalance.gte(guaranteeAmount);

        confirm({
            title: t('Confirm Transaction'),
            icon: <ExclamationCircleOutlined />,
            content: renderConfirmContent(),
            okButtonProps: { disabled: !canAfford },
            onOk() {
                return bazaarContract.placeOrder(
                    sourceAsset,
                    sourceAmount,
                    targetAsset,
                    targetAmount,
                    timeout
                ).then(() => {
                    message.success(t('Order created'));
                    navigate('/sales');
                }).catch(e => {
                    message.error(t('Error while placing order'));
                });
            },
        });
    }

    const handleOnSubmit = (values) => {
        const { targetAmount, targetAsset } = getFormValues();
        const guaranteeAmount = calcGuaranteeAmount(targetAmount);

        approve(BAZAAR_ADDRESS, targetAsset, guaranteeAmount);
    }

    return (
        <OrderWrapper>
            <Col xl={10} lg={14} md={14} sm={22} xs={22}>
                <OrderCard title={t('Create Order')} bordered={false}>
                    {
                        !account ? <ConnectWalletButton /> : !hasProfile ? <CreateProfileButton /> : (
                            <CreateOrderForm
                                form={form}
                                name="create-order-form"
                                onFinish={handleOnSubmit}
                                initialValues={initialValues}
                                layout="vertical"
                                requiredMark={false}
                            >
                                <Form.Item name="sourceAsset" label={t('Source Asset')} rules={[{ required: true }]}>
                                    <Select>
                                        <Option value={0}>{t('Gold')}</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item style={{ marginBottom: 0 }}>
                                    <InlinedFormItem style={{ margin: '0' }} name="sourceAmount" label={`${t('Source Amount')}(${t('Gram')})`} rules={[{ required: true }]}>
                                        <Input type={'number'} className="ltr-input" />
                                    </InlinedFormItem>
                                    <InlinedFormItem name="sourceAmountType" label={`${t('Source Amount Type')}(${t('Gram')})`} rules={[{ required: true }]}>
                                        <Select>
                                            <Option value={0}>{t('Gold')}</Option>
                                            <Option value={0}>{t('Gold')}</Option>
                                        </Select>
                                    </InlinedFormItem>
                                </Form.Item>
                                <Form.Item style={{ marginBottom: 0 }}>
                                    <InlinedFormItem name="targetAmount" label={t('Target Amount')} rules={[{ required: true }]}>
                                        <Input type={'number'} className="ltr-input" />
                                    </InlinedFormItem>
                                    <InlinedFormItem name="targetAsset" label={t('Target Asset')} rules={[{ required: true }]}>
                                        <Select>
                                            <Option value={tokens.busd.address}>{t('BUSD')}</Option>
                                        </Select>
                                    </InlinedFormItem>
                                </Form.Item>

                                <Form.Item style={{ marginBottom: 0 }}>
                                    <InlinedFormItem name="timeout" label={`${t('Valid For')}(${t('Minutes')})`} rules={[{ required: true }]}>
                                        <Input type={'number'} className="ltr-input" />
                                    </InlinedFormItem>
                                    <InlinedFormItem name="timeoutValueType" label={t('Target Asset')} rules={[{ required: true }]}>
                                        <Select>
                                            <Option value={'minutes'}>{t('Minutes')}</Option>
                                            <Option value={'hours'}>{t('Hours')}</Option>
                                            <Option value={'days'}>{t('Days')}</Option>
                                        </Select>
                                    </InlinedFormItem>
                                </Form.Item>
                                <SubmitButton type="primary" shape="round" size="large" htmlType="submit" loading={approveState == APPROVE_STATES.APPROVING}>
                                    {t('Place Order')}
                                </SubmitButton>
                            </CreateOrderForm>
                        )
                    }
                </OrderCard>
            </Col>
        </OrderWrapper>
    );
}

export default CreateOrder;

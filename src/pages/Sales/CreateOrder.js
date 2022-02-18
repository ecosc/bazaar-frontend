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
import { transformTargetAmount } from "utils/transforms";
import { calcGuaranteeAmount, calcSellFee } from "utils/fees";
import { APPROVE_STATES, useApproveToken } from "hooks/useApproveToken";
import { useEffect, useState } from "react";
import { bazaars, sourceAssetNames, sourceAssets, sourceAssetsUnits, units } from "config/assets";

const { Option, OptGroup } = Select;
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

const initialValues = {
    sourceAsset: sourceAssets.CARAT_GOLD_18,
    targetAsset: tokens.busd.address,
    timeoutValueUnit: 'minutes',
    sourceAmountUnit: units.GRAM.id,
};

function CreateOrder() {
    const { t } = useTranslation();
    const { hasProfile, profile, isLoading: isProfileLoading } = useProfile();
    const { account } = useWeb3React();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const bazaarContract = useBazaarContract();
    const { balance: busdBalance, fetchStatus: busdBalanceStatus } = useTokenBalance(tokens.busd.address);
    const { state: approveState, approve } = useApproveToken(handleOnApproved);
    const [sourceAsset, setSourceAsset] = useState(initialValues.sourceAsset);

    const getFormValues = () => {
        const values = form.getFieldsValue();

        let sourceAmount = BigNumber.from(values.sourceAmount);
        const targetAmount = parseUnits(values.targetAmount, tokens.busd.decimals);
        let timeout = BigNumber.from(parseInt(values.timeout));
        const sourceAsset = values.sourceAsset;
        const targetAsset = values.targetAsset;

        if (values.timeoutValueUnit === 'minutes') {
            timeout = timeout.mul(60);
        } else if (values.timeoutValueUnit === 'hours') {
            timeout = timeout.mul(60).mul(60);
        } else if (values.timeoutValueUnit === 'days') {
            timeout = timeout.mul(60).mul(60).mul(24);
        }

        if (values.sourceAmountUnit === units.KILOGRAM.id) {
            sourceAmount = sourceAmount.mul(1000);
        }

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
            closable: true,
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

    const handleSourceAssetChange = (value) => {
        setSourceAsset(value);
        const units = sourceAssetsUnits[value];

        form.setFieldsValue({ sourceAmountUnit: units[0].id });
    }

    const renderSourceAssets = () => {
        return Object.entries(bazaars).map(([id, b]) => (
            <OptGroup label={<span>{b?.icon} {t(b.symbol)}</span>} key={id}>
                {
                    b.assets.map((asset) => (
                        <Option value={asset} key={asset}>{t(sourceAssetNames[asset])}</Option>
                    ))
                }
            </OptGroup>
        ))
    }

    const renderSourceAmountUnit = () => {
        const units = sourceAssetsUnits[sourceAsset];

        return units.map(({ id, symbol }) => (
            <Option value={id} key={id}>{t(symbol)}</Option>
        ))
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
                                    <Select onChange={handleSourceAssetChange}>
                                        {renderSourceAssets()}
                                    </Select>
                                </Form.Item>
                                <Form.Item style={{ marginBottom: 0 }}>
                                    <InlinedFormItem style={{ margin: '0' }} name="sourceAmount" label={t('Source Amount')} rules={[{ required: true }]}>
                                        <Input type={'number'} className="ltr-input" />
                                    </InlinedFormItem>
                                    <InlinedFormItem name="sourceAmountUnit" label={t('Unit')} rules={[{ required: true }]}>
                                        <Select>
                                            {renderSourceAmountUnit()}
                                        </Select>
                                    </InlinedFormItem>
                                </Form.Item>
                                <Form.Item style={{ marginBottom: 0 }}>
                                    <InlinedFormItem name="targetAmount" label={t('Your Price')} rules={[{ required: true }]}>
                                        <Input type={'number'} className="ltr-input" />
                                    </InlinedFormItem>
                                    <InlinedFormItem name="targetAsset" label={t('Target Asset')} rules={[{ required: true }]}>
                                        <Select>
                                            <Option value={tokens.busd.address}>{t('BUSD')}</Option>
                                        </Select>
                                    </InlinedFormItem>
                                </Form.Item>
                                <Form.Item style={{ marginBottom: 0 }}>
                                    <InlinedFormItem name="timeout" label={t('Valid For')} rules={[{ required: true }]}>
                                        <Input type={'number'} className="ltr-input" />
                                    </InlinedFormItem>
                                    <InlinedFormItem name="timeoutValueUnit" label={t('Unit')} rules={[{ required: true }]}>
                                        <Select>
                                            <Option value='minutes' >{t('Minutes')}</Option>
                                            <Option value='hours'>{t('Hours')}</Option>
                                            <Option value='days'>{t('Days')}</Option>
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

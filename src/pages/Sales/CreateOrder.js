import { useWeb3React } from "@web3-react/core";
import { Button, Card, Col, Row, Form, Input, message, Select, Space, Typography, Modal, Alert, Divider } from "antd";
import {
    ExclamationCircleOutlined,
    AppstoreOutlined,
    AppstoreAddOutlined,
    CrownOutlined,
    FlagOutlined,
    FieldTimeOutlined,
} from '@ant-design/icons';
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
import { SOURCE_AMOUNT_DECIMALS, transformTargetAmount } from "utils/transforms";
import { calcGuaranteeAmount, calcSellFee } from "utils/fees";
import { APPROVE_STATES, useApproveToken } from "hooks/useApproveToken";
import { useState } from "react";
import { bazaars, sourceAssetNames, sourceAssets, sourceAssetsUnits, units } from "config/assets";
import { BIG_ZERO } from "utils/bigNumber";
import { getTokenBalance } from "hooks/useTokenBalance";
import SubmitButton from "components/SubmitButton";
import { notifyError, notifySuccess } from "utils/notification";

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

const GroupSelectInput = styled(Form.Item)`
    & > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content {
        display: flex !important;
        align-items: center !important;
    }
`;

const UnitSelectLabel = styled.span`
    color: ${({ theme }) => theme.colors.inputTitle} !important;

    &:after{
        content: ": ";
        white-space: pre;
    }
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

const TokenIcon = styled.img`
    width: 22px;
    ${({ theme }) => theme.dir == 'rtl' && `
        margin-left: 10px;
    `}
    ${({ theme }) => theme.dir == 'ltr' && `
        margin-right: 10px;
    `}
`;

const TokenOption = styled.div`
    display: flex;
    align-items: center;
`;

const initialValues = {
    sourceAsset: sourceAssets.CARAT_GOLD_18,
    targetAsset: tokens.busd.address,
    timeoutValueUnit: 'minutes',
    sourceAmountUnit: units.GRAM.id,
};

function CreateOrder() {
    const { t } = useTranslation();
    const { hasProfile } = useProfile();
    const { account } = useWeb3React();
    const [loadingBalance, setLoadingBalance] = useState(false);
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const bazaarContract = useBazaarContract();
    const { state: approveState, approve } = useApproveToken(handleOnApproved);
    const [sourceAsset, setSourceAsset] = useState(initialValues.sourceAsset);
    

    const getFormValues = () => {
        const values = form.getFieldsValue();

        let sourceAmount = parseUnits(values.sourceAmount, SOURCE_AMOUNT_DECIMALS);
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

    const renderConfirmContent = (balance) => {
        const {
            targetAmount,
            targetAsset
        } = getFormValues();

        const guaranteeAmount = calcGuaranteeAmount(targetAmount);
        const sellFee = calcSellFee(targetAmount);
        const totalIncome = targetAmount.sub(sellFee);
        const canAfford = balance.gte(guaranteeAmount);

        return (
            <Space direction="vertical">
                {!canAfford && <Alert message={t("You don't have enough token for placing order")} type="error" />}
                <div>
                    <Text type="secondary">{t('Guarantee Amount')}: </Text>
                    <Text>{transformTargetAmount(targetAsset, guaranteeAmount)}</Text>
                </div>
                <div>
                    <Text type="secondary">{t('Sell Commission')}: </Text>
                    <Text>{transformTargetAmount(targetAsset, sellFee)}</Text>
                </div>
                <div>
                    <Text type="secondary">{t('Total Income')}: </Text>
                    <Text>{transformTargetAmount(targetAsset, totalIncome)}</Text>
                </div>
                <div>
                    <Text type="secondary">{t('Your Balance')}: </Text>
                    <Text>{transformTargetAmount(targetAsset, balance)}</Text>
                </div>
                <Alert message={t("Guarantee amount will be returned to you if there were no conflicts")} type="info" />
                <Alert message={t("You can withdraw guarantee amount if no one accepted your order")} type="info" />
                <Alert message={t("If you cancel the order, guarantee amount will be returned to you after cutting cancellation commission")} type="info" />
            </Space>
        );
    }

    function handleOnApproved(balance) {
        const {
            sourceAsset,
            sourceAmount,
            targetAsset,
            targetAmount,
            timeout
        } = getFormValues();

        const guaranteeAmount = calcGuaranteeAmount(targetAmount);
        const canAfford = balance.gte(guaranteeAmount);

        confirm({
            title: t('Confirm Transaction'),
            icon: <ExclamationCircleOutlined />,
            content: renderConfirmContent(balance),
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
                    notifySuccess(t('Order created'), t('Your new order created successfully'));
                    navigate('/sales');
                }).catch(e => {
                    notifyError(t('Error'), t('Error while placing order'))
                });
            },
        });
    }

    const handleOnSubmit = async (values) => {
        const { targetAmount, targetAsset } = getFormValues();
        const guaranteeAmount = calcGuaranteeAmount(targetAmount);
        let balance;

        setLoadingBalance(true);

        try {
            balance = await getTokenBalance(targetAsset, account);
        } catch {
            balance = BIG_ZERO;
        }

        approve(BAZAAR_ADDRESS, targetAsset, guaranteeAmount, balance);

        setLoadingBalance(false);
    }

    const handleSourceAssetChange = (value) => {
        setSourceAsset(value);
        const units = sourceAssetsUnits[value];

        form.setFieldsValue({ sourceAmountUnit: units[0].id });
    }

    const renderSourceAssets = () => {
        return Object.entries(bazaars).map(([id, b]) => (
            <OptGroup label={<span>{<b.icon />} {t(b.symbol)}</span>} key={id}>
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

    const renderTokenOption = (id, token) => {
        return (
            <Option
                key={id}
                value={token.address}
                label={(
                    <>
                        <TokenIcon src={`/images/tokens/${token.address}.png`} />
                        {token.symbol}
                    </>
                )}
            >
                <TokenOption>
                    <TokenIcon src={`/images/tokens/${token.address}.png`} />
                    <div>
                        <div>{token.symbol}</div>
                        <Text type="secondary">{token.name}</Text>
                    </div>
                </TokenOption>
            </Option>
        );
    }

    return (
        <OrderWrapper>
            <Col xl={14} lg={16} md={20} sm={22} xs={22} style={{ maxWidth: '768px' }}>
                <OrderCard
                    title={
                        <>
                            <AppstoreAddOutlined />
                            <span>{t('New Order')}</span>
                        </>
                    }
                    bordered={false}
                >
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
                                <Form.Item
                                    name="sourceAsset"
                                    label={
                                        <>
                                            <AppstoreOutlined />
                                            <span>{t('Source Asset')}</span>
                                        </>
                                    }
                                    rules={[{ required: true }]}
                                >
                                    <Select onChange={handleSourceAssetChange}>
                                        {renderSourceAssets()}
                                    </Select>
                                </Form.Item>
                                <Row style={{ marginBottom: 0 }} gutter={{md: 16, sm: 8, xs: 4}}>
                                    <Col md={12} sm={16} xs={24}>
                                        <GroupSelectInput
                                            style={{ marginBottom: 0 }}
                                            label={
                                                <>
                                                    <CrownOutlined />
                                                    <span>{t('Source Amount')}</span>
                                                </>
                                            }
                                        >
                                            <InlinedFormItem
                                                style={{ margin: '0' }}
                                                name="sourceAmount"
                                                noStyle
                                                rules={[{ required: true, message: t('Amount is required') }]}
                                            >
                                                <Input type={'number'} className="ltr-input" placeholder={t('Enter amount')} />
                                            </InlinedFormItem>
                                            <Divider type="vertical" />
                                            <UnitSelectLabel>{t('Unit')}</UnitSelectLabel>
                                            <InlinedFormItem noStyle name="sourceAmountUnit" rules={[{ required: true }]}>
                                                <Select dropdownMatchSelectWidth={false}>
                                                    {renderSourceAmountUnit()}
                                                </Select>
                                            </InlinedFormItem>
                                        </GroupSelectInput>
                                    </Col>
                                    <Col md={12} sm={16} xs={24}>
                                        <GroupSelectInput
                                            style={{ marginBottom: 0 }}
                                            label={
                                                <>
                                                    <FlagOutlined />
                                                    <span>{t('Your Price')}</span>
                                                </>
                                            }
                                        >
                                            <InlinedFormItem
                                                name="targetAmount"
                                                rules={[{ required: true, message: t('Price is required') }]}
                                                noStyle
                                            >
                                                <Input type={'number'} className="ltr-input" placeholder={t('Enter your price')} />
                                            </InlinedFormItem>
                                            <Divider type="vertical" />
                                            <InlinedFormItem
                                                name="targetAsset"
                                                noStyle
                                            >
                                                <Select optionLabelProp="label" dropdownMatchSelectWidth={false}>
                                                    {
                                                        Object.entries(tokens).map(([id, token]) => {
                                                            return renderTokenOption(id, token);
                                                        })
                                                    }
                                                </Select>
                                            </InlinedFormItem>
                                        </GroupSelectInput>
                                    </Col>
                                </Row>
                                <Row gutter={{md: 16, sm: 8, xs: 4}}>
                                    <Col md={12} sm={16} xs={24}>
                                        <GroupSelectInput
                                            style={{ marginBottom: 0 }}
                                            label={
                                                <>
                                                    <FieldTimeOutlined />
                                                    <span>{t('Lifetime')}</span>
                                                </>
                                            }
                                        >
                                            <InlinedFormItem
                                                noStyle
                                                name="timeout"
                                                rules={[{ required: true, message: t('Lifetime is required') }]}
                                            >
                                                <Input type={'number'} className="ltr-input" placeholder={t('Enter lifetime')} />
                                            </InlinedFormItem>
                                            <Divider type="vertical" />
                                            <UnitSelectLabel>{t('Unit')}</UnitSelectLabel>
                                            <InlinedFormItem noStyle name="timeoutValueUnit">
                                                <Select dropdownMatchSelectWidth={false}>
                                                    <Option value='minutes' >{t('Minutes')}</Option>
                                                    <Option value='hours'>{t('Hours')}</Option>
                                                    <Option value='days'>{t('Days')}</Option>
                                                </Select>
                                            </InlinedFormItem>
                                        </GroupSelectInput>
                                    </Col>
                                </Row>
                                <Divider />
                                <SubmitButton
                                    type="primary"
                                    shape="round"
                                    size="large"
                                    htmlType="submit"
                                    loading={approveState == APPROVE_STATES.APPROVING || loadingBalance}
                                >
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

import { message, Modal } from "antd";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useState } from "react";
import { useTranslation } from "react-i18next";
import useActiveWeb3React from "./useActiveWeb3React";
import { getBep20Contract } from "./useContracts";
import { MaxUint256 } from '@ethersproject/constants';
import { BigNumber } from "ethers";
import { BIG_ZERO } from "utils/bigNumber";

export const APPROVE_STATES = {
    NONE: 0,
    APPROVING: 1,
    APPROVED: 2,
    REJECTED: 3,
    ERROR: 4,
};

const { confirm } = Modal;

export function useApproveToken(onApproved, onRejected) {
    const [state, setState] = useState(APPROVE_STATES.NONE);
    const { library, account } = useActiveWeb3React();
    const { t } = useTranslation();

    function showConfirm(spender, tokenContract, additionalParams) {
        confirm({
            title: t('Approve Token'),
            content: t('You need to approve our contract, so we can withdraw from your wallet!'),
            closable: true,
            onOk() {
                return tokenContract.approve(spender, MaxUint256).
                    then(() => {
                        setState(APPROVE_STATES.APPROVED);
                        onApproved && onApproved(additionalParams);
                    }).catch(e => {
                        message.error(t('Token approve error'));
                        setState(APPROVE_STATES.ERROR);
                        onRejected && onRejected(e, additionalParams);
                    })
            },
            onCancel() {
                setState(APPROVE_STATES.REJECTED);
                onRejected && onRejected(null, additionalParams);
            },
        });
    }

    const approve = (spender, token, amount, additionalParams = null) => {
        setState(APPROVE_STATES.APPROVING);

        const tokenContract = getBep20Contract(token, library.getSigner());

        tokenContract.allowance(account, spender).
            then(r => {
                if (r.lt(amount)) {
                    showConfirm(spender, tokenContract, additionalParams);

                    return;
                }

                setState(APPROVE_STATES.APPROVED);
                onApproved && onApproved(additionalParams);
            }).catch(e => {
                console.error(e);
                message.error(t('Error while approving token'));
                setState(APPROVE_STATES.ERROR);
                onRejected && onRejected(e, additionalParams);
            });
    }

    return {
        state,
        approve
    }
}

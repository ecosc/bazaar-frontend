import { BIG_TEN, ethersToBigNumber } from "./bigNumber"
import BigNumber from 'bignumber.js'

export const getBalanceAmount = (amount, decimals = 18) => {
    const v = ethersToBigNumber(BIG_TEN.pow(decimals));
    const _amount = ethersToBigNumber(amount);

    return new BigNumber(_amount).dividedBy(v);
}

export function getBalanceAmountInFloat(balance, decimals = 18, displayDecimals = 3) {
    return parseFloat(getFullDisplayBalance(balance, decimals, displayDecimals));
}

export const getFullDisplayBalance = (balance, decimals = 18, displayDecimals = 3) => {
    return getBalanceAmount(balance, decimals).toFixed(displayDecimals);
}
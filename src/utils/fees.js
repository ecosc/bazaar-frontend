import { BUY_FEE, CANCELLATION_FEE, CLOSE_FEE, GUARANTEE_PERCENT, SELL_FEE } from "constants/fees";

export function calcGuaranteeAmount(targetAmount) {
    return targetAmount.mul(GUARANTEE_PERCENT).div(100000);
}

export function calcSellFee(targetAmount) {
    return targetAmount.mul(SELL_FEE).div(100000);
}

export function calcBuyFee(targetAmount) {
    return targetAmount.mul(BUY_FEE).div(100000);
}

export function calcCloseFee(targetAmount) {
    return targetAmount.mul(CLOSE_FEE).div(100000);
}

export function calcCancellationFee(targetAmount) {
    return targetAmount.mul(CANCELLATION_FEE).div(100000);
}


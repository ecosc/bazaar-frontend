import { sourceAssets } from "config/assets";
import tokens from "constants/tokens";
import i18n from "i18next";
import { getBalanceAmountInFloat } from "./formatBalance";

export function transformGoldAmount(amount) {
    const amountInK = amount.toNumber() / 1000;
    const amountInKRem = amount.toNumber() % 1000;
    const { t } = i18n;

    if (amountInK < 1) {
        return `${amount} ${t('Gram')}`
    }

    if (amountInKRem === 0) {
        return `${toLocaleNumber(amountInK)} ${t('Kilogram')}`;
    }

    return `${toLocaleNumber(Math.floor(amountInK))} ${t('Kilo')} ${t('And')} ${Math.floor(amountInKRem)} ${t('Gram')}`;
}

export function transformSourceAmount(sourceAsset, amount) {
    switch (sourceAsset) {
        case sourceAssets.CARAT_GOLD_18:
            return transformGoldAmount(amount);
        default:
            return transformGoldAmount(amount);
    }
}

export function transformTargetAmount(targetAssetAddress, amount) {
    switch (targetAssetAddress) {
        case tokens.busd.address:
            return toLocaleNumber(getBalanceAmountInFloat(amount, tokens.busd.decimals)) + ' ' + tokens.busd.symbol;
        default:
            return "";
    }
}

export function toLocaleNumber(num = 0) {
    return num.toLocaleString();
}


export function accountEllipsis(account) {
    return account ? `${account.substring(0, 2)}...${account.substring(account.length - 4)}` : null;
}

function pad(n, z) {
    z = z || 2;
    return ('00' + n).slice(-z);
}

export function secondsToTime(s) {
    const secs = s % 60;
    s = (s - secs) / 60;
    const mins = s % 60;
    const hrs = (s - mins) / 60;

    return pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
}

export function millisecondsToTime(s) {
    const ms = s % 1000;
    s = (s - ms) / 1000;
    const secs = s % 60;
    s = (s - secs) / 60;
    const mins = s % 60;
    const hrs = (s - mins) / 60;

    return pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
}

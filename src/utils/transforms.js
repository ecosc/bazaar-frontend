import { sourceAssets, sourceAssetsUnits } from "config/assets";
import tokens, { getTokenByAddress } from "constants/tokens";
import i18n from "i18next";
import { getLocale } from "localization";
import { getBalanceAmountInFloat } from "./formatBalance";

export const SOURCE_AMOUNT_DECIMALS = 10;

export function transformWeight(amount, displayDecimals = 5) {
    const amountInK = amount / 1000;
    const amountInKRem = amount % 1000;
    const { t } = i18n;

    if (amountInK < 1) {
        return `${toLocaleNumber(amount, displayDecimals)} ${t('Gram')}`
    }

    if (amountInKRem === 0) {
        return `${toLocaleNumber(amountInK, displayDecimals)} ${t('Kilogram')}`;
    }

    return `${toLocaleNumber(Math.floor(amountInK), displayDecimals)} ${t('Kilo')} ${t('And')} ${Math.floor(amountInKRem)} ${t('Gram')}`;
}

export function transformUnit(sourceAsset, amount, displayDecimals = 5) {
    const { t } = i18n;

    const unit = sourceAssetsUnits[sourceAsset][0].symbol;

    return `${toLocaleNumber(amount, displayDecimals)} ${t(unit)}`;
}

export function transformSourceAmount(sourceAsset, amount, displayDecimals = 5) {
    const adjustedAmount = getBalanceAmountInFloat(amount, SOURCE_AMOUNT_DECIMALS, displayDecimals);

    switch (sourceAsset) {
        case sourceAssets.CARAT_GOLD_18:
        case sourceAssets.CARAT_GOLD_24:
        case sourceAssets.GOLD_MELTED_CASH:
        case sourceAssets.MELTED_BANKING_GOLD:
        case sourceAssets.MELTED_GOLD:
            return transformWeight(adjustedAmount);
        default:
            return transformUnit(sourceAsset, adjustedAmount);
    }
}

export function transformTargetAmount(targetAssetAddress, amount, displayDecimals = 4) {
    const token = getTokenByAddress(targetAssetAddress);

    if (!token) return "";

    return toLocaleNumber(getBalanceAmountInFloat(amount, token.decimals, displayDecimals), displayDecimals) + ' ' + token.symbol;
}

export function toLocaleNumber(num = 0, displayDecimals = 4) {
    const locale = getLocale();

    return num.toLocaleString(locale, { maximumFractionDigits: displayDecimals });
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

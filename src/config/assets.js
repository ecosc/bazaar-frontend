import { DollarCircleOutlined, GoldOutlined } from '@ant-design/icons';

export const sourceAssets = {
    GOLD_OUNCE: 0,
    SILVER_OUNCE: 1,
    CARAT_GOLD_18: 2,
    USDT: 3,
};

export const sourceAssetNames = {
    [sourceAssets.GOLD_OUNCE]: 'Ounce of Gold',
    [sourceAssets.SILVER_OUNCE]: 'Ounce of Silver',
    [sourceAssets.CARAT_GOLD_18]: '18 Carat Gold',
    [sourceAssets.USDT]: 'USA Dollar'
};

export const units = {
    KILOGRAM: {
        id: 'KILOGRAM',
        symbol: 'Kilogram'
    },
    GRAM: {
        id: 'GRAM',
        symbol: 'Gram'
    },
    MESGHAL: {
        id: 'MESGHAL',
        symbol: 'Mesghal'
    },
    OUNCE: {
        id: 'OUNCE',
        symbol: 'Ounce'
    },
    DOLLAR: {
        id: 'DOLLARS',
        symbol: 'Dollar'
    }
};

export const sourceAssetsUnits = {
    [sourceAssets.CARAT_GOLD_18]: [units.GRAM, units.KILOGRAM],
    [sourceAssets.GOLD_OUNCE]: [units.OUNCE],
    [sourceAssets.SILVER_OUNCE]: [units.OUNCE],
    [sourceAssets.USDT]: [units.DOLLAR],
};

export const bazaars = {
    GOLD: {
        id: 'GOLD',
        symbol: 'Gold',
        icon: <GoldOutlined />,
        assets: [
            sourceAssets.GOLD_OUNCE,
            sourceAssets.SILVER_OUNCE,
            sourceAssets.CARAT_GOLD_18,
        ]
    },
    FIAT: {
        id: 'FIAT',
        symbol: 'Fiat',
        icon: <DollarCircleOutlined />,
        assets: [
            sourceAssets.USDT,
        ]
    },
};

export function getUnitByID(id = 'KILOGRAM') {
    return units[id];
}

export function getBazaarByID(id = 'GOLD') {
    return bazaars[id];
}

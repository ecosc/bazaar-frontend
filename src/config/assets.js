import { DollarCircleOutlined, GoldOutlined } from '@ant-design/icons';

export const sourceAssets = {
    GOLD_OUNCE: 0,
    SILVER_OUNCE: 1,
    CARAT_GOLD_18: 2,
    CARAT_GOLD_24: 3,
    GOLD_MESGHAL: 4,
    GOLD_MELTED_CASH: 5,
    MELTED_BANKING_GOLD: 6,
    MELTED_GOLD: 7,
    GOLD_COIN_CASH: 8,
    GOLD_COIN: 9,
    USD: 10,
    MANAT: 11,
    DIRHAM: 12,
    DINAR_IRAQI: 13
};

export const sourceAssetNames = {
    [sourceAssets.GOLD_OUNCE]: 'Ounce of Gold',
    [sourceAssets.SILVER_OUNCE]: 'Ounce of Silver',
    [sourceAssets.CARAT_GOLD_18]: '18 Carat Gold',
    [sourceAssets.CARAT_GOLD_24]: '24 Carat Gold',
    [sourceAssets.GOLD_MESGHAL]: 'Mesghal of Gold',
    [sourceAssets.GOLD_MELTED_CASH]: 'Melted Cash Gold',
    [sourceAssets.MELTED_BANKING_GOLD]: 'Melted Banking Gold',
    [sourceAssets.MELTED_GOLD]: 'Melted Gold',
    [sourceAssets.GOLD_COIN_CASH]: 'Gold Coin Cash',
    [sourceAssets.GOLD_COIN]: 'Gold Coin',
    [sourceAssets.USD]: 'USA Dollar',
    [sourceAssets.MANAT]: 'Manat',
    [sourceAssets.DIRHAM]: 'Dirham',
    [sourceAssets.DINAR_IRAQI]: 'Iraqi Dinar',
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
        id: 'DOLLAR',
        symbol: 'Dollar'
    },
    DIRHAM: {
        id: 'DIRHAM',
        symbol: 'Dirham'
    },
    DINAR: {
        id: 'DINAR',
        symbol: 'Dinar'
    },
    MANAT: {
        id: 'MANAT',
        symbol: 'Manat'
    },
    COIN: {
        id: 'COIN',
        symbol: 'Coin'
    },
};

export const sourceAssetsUnits = {
    [sourceAssets.GOLD_OUNCE]: [units.OUNCE],
    [sourceAssets.SILVER_OUNCE]: [units.OUNCE],
    [sourceAssets.CARAT_GOLD_18]: [units.GRAM, units.KILOGRAM],
    [sourceAssets.CARAT_GOLD_24]: [units.GRAM, units.KILOGRAM],
    [sourceAssets.GOLD_MELTED_CASH]: [units.GRAM, units.KILOGRAM],
    [sourceAssets.MELTED_BANKING_GOLD]: [units.GRAM, units.KILOGRAM],
    [sourceAssets.MELTED_GOLD]: [units.GRAM, units.KILOGRAM],
    [sourceAssets.GOLD_MESGHAL]: [units.MESGHAL],
    [sourceAssets.GOLD_COIN_CASH]: [units.COIN],
    [sourceAssets.GOLD_COIN]: [units.COIN],
    [sourceAssets.USD]: [units.DOLLAR],
    [sourceAssets.MANAT]: [units.MANAT],
    [sourceAssets.DIRHAM]: [units.DIRHAM],
    [sourceAssets.DINAR_IRAQI]: [units.DINAR],
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
            sourceAssets.CARAT_GOLD_24,
            sourceAssets.GOLD_MESGHAL,
            sourceAssets.GOLD_MELTED_CASH,
            sourceAssets.MELTED_BANKING_GOLD,
            sourceAssets.MELTED_GOLD,
            sourceAssets.GOLD_COIN_CASH,
            sourceAssets.GOLD_COIN,
        ]
    },
    FIAT: {
        id: 'FIAT',
        symbol: 'Fiat',
        icon: <DollarCircleOutlined />,
        assets: [
            sourceAssets.USD,
            sourceAssets.MANAT,
            sourceAssets.DIRHAM,
            sourceAssets.DINAR_IRAQI,
        ]
    },
};

export function getUnitByID(id = 'KILOGRAM') {
    return units[id];
}

export function getBazaarByID(id = 'GOLD') {
    return bazaars[id];
}

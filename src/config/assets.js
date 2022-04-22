import Icon from '@ant-design/icons';
import { ReactComponent as GoldSVG } from 'assets/images/gold.svg';
import { ReactComponent as FiatSVG } from 'assets/images/fiat.svg';
import { ReactComponent as MetalSVG } from 'assets/images/metal.svg';
import { ReactComponent as PetroSVG } from 'assets/images/petrochemical.svg';


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
    DINAR_IRAQI: 13,
    TURKISH_LIRA: 14,
    POLYSTYRENE: 15,
    BITUMEN: 16,
    BASE_OIL: 17,
    POLYPROPYLENE: 18,
    HDPE: 19, // High Density Polyethylene
    LDPE: 20, // Low Density Polyethylene
    NITRIC_ACID: 21,
    SODIUM_HYDROXIDE: 22,
    UREA: 23,
    SODIUM_CARBONATE: 24,
    SODIUM_SULFATE: 25,
    PARAFFIN_WAX: 26,
    EPOXY_RESIN: 27,
    STYRENE: 28,
    STEEL: 29,
    IRON_ORE: 30,
    CONCENTRATE: 31,
    IRON_PELLET: 32,
    COPPER: 33,
    ZINC: 34,
    ALUMINIUM: 35,
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
    [sourceAssets.MANAT]: 'Turkmen Manat',
    [sourceAssets.DIRHAM]: 'Emirates Dirham',
    [sourceAssets.DINAR_IRAQI]: 'Iraqi Dinar',
    [sourceAssets.TURKISH_LIRA]: 'Turkish Lira',
    [sourceAssets.POLYSTYRENE]: 'Polystyrene',
    [sourceAssets.BITUMEN]: 'Industrial Bitumen',
    [sourceAssets.BASE_OIL]: 'Base Oil',
    [sourceAssets.POLYPROPYLENE]: 'Polypropylene',
    [sourceAssets.HDPE]: 'High Density Polyethylene',
    [sourceAssets.LDPE]: 'Low Density Polyethylene',
    [sourceAssets.NITRIC_ACID]: 'Nitric Acid',
    [sourceAssets.SODIUM_HYDROXIDE]: 'Sodium Hydroxide',
    [sourceAssets.UREA]: 'Urea',
    [sourceAssets.SODIUM_CARBONATE]: 'Sodium Carbonate',
    [sourceAssets.SODIUM_SULFATE]: 'Sodium Sulfate',
    [sourceAssets.PARAFFIN_WAX]: 'Paraffin Wax',
    [sourceAssets.EPOXY_RESIN]: 'Epoxy Resin',
    [sourceAssets.STYRENE]: 'Styrene',
    [sourceAssets.STEEL]: 'Steel',
    [sourceAssets.IRON_ORE]: 'Iron Ore',
    [sourceAssets.CONCENTRATE]: 'Concentrate',
    [sourceAssets.IRON_PELLET]: 'Iron Pellet',
    [sourceAssets.COPPER]: 'Copper',
    [sourceAssets.ZINC]: 'Zinc',
    [sourceAssets.ALUMINIUM]: 'Aluminium',
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
    LIRA: {
        id: 'LIRA',
        symbol: 'Lira'
    },
    COIN: {
        id: 'COIN',
        symbol: 'Coin'
    },
    TONNAGE: {
        id: 'TONNAGE',
        symbol: 'Tonnage'
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
    [sourceAssets.TURKISH_LIRA]: [units.LIRA],
    [sourceAssets.POLYSTYRENE]: [units.TONNAGE],
    [sourceAssets.BITUMEN]: [units.TONNAGE],
    [sourceAssets.BASE_OIL]: [units.TONNAGE],
    [sourceAssets.POLYPROPYLENE]: [units.TONNAGE],
    [sourceAssets.HDPE]: [units.TONNAGE],
    [sourceAssets.LDPE]: [units.TONNAGE],
    [sourceAssets.NITRIC_ACID]: [units.TONNAGE],
    [sourceAssets.SODIUM_HYDROXIDE]: [units.TONNAGE],
    [sourceAssets.UREA]: [units.TONNAGE],
    [sourceAssets.SODIUM_CARBONATE]: [units.TONNAGE],
    [sourceAssets.SODIUM_SULFATE]: [units.TONNAGE],
    [sourceAssets.PARAFFIN_WAX]: [units.TONNAGE],
    [sourceAssets.EPOXY_RESIN]: [units.TONNAGE],
    [sourceAssets.STYRENE]: [units.TONNAGE],
    [sourceAssets.STEEL]: [units.TONNAGE],
    [sourceAssets.IRON_ORE]: [units.TONNAGE],
    [sourceAssets.CONCENTRATE]: [units.TONNAGE],
    [sourceAssets.IRON_PELLET]: [units.TONNAGE],
    [sourceAssets.COPPER]: [units.TONNAGE],
    [sourceAssets.ZINC]: [units.TONNAGE],
    [sourceAssets.ALUMINIUM]: [units.TONNAGE],
};

export const bazaars = {
    GOLD: {
        id: 'GOLD',
        symbol: 'Gold',
        icon: (props) => <Icon component={GoldSVG} {...props} />,
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
        icon: (props) => <Icon component={FiatSVG} {...props} />,
        assets: [
            sourceAssets.USD,
            sourceAssets.MANAT,
            sourceAssets.DIRHAM,
            sourceAssets.DINAR_IRAQI,
            sourceAssets.TURKISH_LIRA
        ]
    },
    PETROCHEMICAL: {
        id: 'PETROCHEMICAL',
        symbol: 'Petrochemical',
        icon: (props) => <Icon component={PetroSVG} {...props} />,
        assets: [
            sourceAssets.POLYSTYRENE,
            sourceAssets.BITUMEN,
            sourceAssets.BASE_OIL,
            sourceAssets.POLYPROPYLENE,
            sourceAssets.HDPE,
            sourceAssets.LDPE,
            sourceAssets.NITRIC_ACID,
            sourceAssets.SODIUM_HYDROXIDE,
            sourceAssets.UREA,
            sourceAssets.SODIUM_CARBONATE,
            sourceAssets.SODIUM_SULFATE,
            sourceAssets.PARAFFIN_WAX,
            sourceAssets.EPOXY_RESIN,
            sourceAssets.STYRENE,
        ],
    },
    METAL: {
        id: 'METAL',
        symbol: 'Metal',
        icon: (props) => <Icon component={MetalSVG} {...props} />,
        assets: [
            sourceAssets.STEEL,
            sourceAssets.IRON_ORE,
            sourceAssets.CONCENTRATE,
            sourceAssets.IRON_PELLET,
            sourceAssets.COPPER,
            sourceAssets.ZINC,
            sourceAssets.ALUMINIUM
        ]
    },
};

export function getUnitByID(id = 'KILOGRAM') {
    return units[id];
}

export function getBazaarByID(id = 'GOLD') {
    return bazaars[id];
}

export function getBazaarForAsset(assetID) {
    const foundBazaar = Object.entries(bazaars).find(([id, bazaar]) => {
        if (bazaar.assets.find(asset => asset == assetID)) {
            return true;
        }

        return false;
    });

    if (!foundBazaar) return null;

    return foundBazaar[1];
}

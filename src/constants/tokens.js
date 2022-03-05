const tokens = {
    busd: {
        address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
        decimals: 18,
        symbol: 'BUSD',
        name: 'Binance USD',
        link: 'https://www.paxos.com/busd/',
    },
    ecu: {
        address: '0xdc49f7e090206f25563d0a8a8190388e92148a1d',
        decimals: 18,
        symbol: 'ECU',
        name: 'ECOSCU',
        link: 'https://ecosc.net/',
    },
    usdt: {
        address: '0x55d398326f99059fF775485246999027B3197955',
        decimals: 18,
        symbol: 'USDT',
        name: 'Tether USD',
        link: 'https://www.binance.com/',
    },
    eth: {
        address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
        decimals: 18,
        symbol: 'ETH',
        name: 'Binance-Peg Ethereum Token',
        link: 'https://ethereum.org/en/',
    },
    dai: {
        address: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
        decimals: 18,
        symbol: 'DAI',
        name: 'Dai Stablecoin',
        link: 'https://www.makerdao.com/',
    },
    btcb: {
        address: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
        decimals: 18,
        symbol: 'BTCB',
        name: 'Binance BTC',
        link: 'https://www.binance.com/',
    }
};

export default tokens;

export function getTokenByAddress(add) {
    const foundToken = Object.entries(tokens).find(([id, token]) => {
        return token.address.toLowerCase() === add.toLowerCase();
    });

    if (!foundToken) return null;

    return foundToken[1];
}

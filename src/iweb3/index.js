import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { BscConnector } from '@binance-chain/bsc-connector'
import network from 'constants/network';
import { ethers } from 'ethers';

const chainId = network.chainId;
const rpcURL = network.rpcUrls[0];
const POLLING_INTERVAL = 12000;

const bscConnector = new BscConnector({ supportedChainIds: [chainId] });
const injected = new InjectedConnector({ supportedChainIds: [chainId] });
const walletconnect = new WalletConnectConnector({
    rpc: { [chainId]: rpcURL },
    qrcode: true,
    pollingInterval: POLLING_INTERVAL,
});

const connectorNames = {
    Injected: "injected",
    WalletConnect: "walletconnect",
    BSC: "bsc",
}

const connectorsByName = {
    [connectorNames.Injected]: injected,
    [connectorNames.WalletConnect]: walletconnect,
    [connectorNames.BSC]: bscConnector,
}

function getLibrary(provider) {
    const library = new ethers.providers.Web3Provider(provider);
    library.pollingInterval = POLLING_INTERVAL;

    return library;
}

/**
 * BSC Wallet requires a different sign method
 * @see https://docs.binance.org/smart-chain/wallet/wallet_api.html#binancechainbnbsignaddress-string-message-string-promisepublickey-string-signature-string
 */
async function signMessage(provider, account, message) {
    if (window.BinanceChain) {
        const { signature } = await window.BinanceChain.bnbSign(account, message);

        return signature;
    }

    /**
     * Wallet Connect does not sign the message correctly unless you use their method
     * @see https://github.com/WalletConnect/walletconnect-monorepo/issues/462
     */
    if (provider.provider?.wc) {
        const wcMessage = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(message))
        const signature = await provider.provider?.wc.signPersonalMessage([wcMessage, account])

        return signature
    }

    return provider.getSigner(account).signMessage(message);
}


export {
    connectorNames,
    connectorsByName,
    getLibrary
};

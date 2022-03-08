import { useCallback } from 'react'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux';
import { NoBscProviderError } from '@binance-chain/bsc-connector'
import {
    NoEthereumProviderError,
    UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector'
import {
    UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
    WalletConnectConnector,
} from '@web3-react/walletconnect-connector'
import { connectorLocalStorageKey } from 'constants/connectors';
import { connectorNames, connectorsByName } from 'iweb3';
import { setupNetwork } from 'iweb3/wallet';
import { useTranslation } from 'react-i18next'
import { message } from 'antd'
import { resetProfile } from 'state/profile';

const useAuth = () => {
    const { t } = useTranslation();
    const { chainId, activate, deactivate } = useWeb3React();
    const dispatch = useDispatch();

    const login = useCallback(
        (connectorID) => {
            const connector = connectorsByName[connectorID];

            if (connector) {
                activate(connector, async (error) => {
                    if (error instanceof UnsupportedChainIdError) {
                        const hasSetup = await setupNetwork();
                        if (hasSetup) {
                            activate(connector);
                        }
                    } else {
                        window.localStorage.removeItem(connectorLocalStorageKey);

                        if (error instanceof NoEthereumProviderError || error instanceof NoBscProviderError) {
                            message.error(t('No provider was found'));
                        } else if (
                            error instanceof UserRejectedRequestErrorInjected ||
                            error instanceof UserRejectedRequestErrorWalletConnect
                        ) {
                            if (connector instanceof WalletConnectConnector) {
                                connector.walletConnectProvider = null;
                            }
                            message.error(t('Please authorize to access your account'));
                        } else {
                            message.error(t(error.message));
                        }
                    }
                })
            } else {
                message.error(t('The connector config is wrong'));
            }
        },
        [t, activate],
    )

    const logout = useCallback(() => {
        deactivate()
        // This localStorage key is set by @web3-react/walletconnect-connector
        if (window.localStorage.getItem('walletconnect')) {
            console.log('close')
            connectorsByName[connectorNames.WalletConnect].close();
            connectorsByName[connectorNames.WalletConnect].walletConnectProvider = null;
        }

        window.localStorage.removeItem(connectorLocalStorageKey);

        if (chainId) {
            dispatch(resetProfile());
        }
    }, [deactivate, chainId])

    return { login, logout }
}

export default useAuth;

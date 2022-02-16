import useActiveWeb3React from "./useActiveWeb3React"
import ProfileContract from 'contracts/Profile.json';
import BazaarContract from 'contracts/Bazaar.json';
import ERC20Contract from 'contracts/ERC20.json';
import { BAZAAR_ADDRESS, PROFILE_ADDRESS } from 'constants/addresses';
import { useMemo } from "react";
import { simpleRpcProvider } from "utils/providers";
import { ethers } from "ethers";
import { getAddress } from "ethers/lib/utils";

function getContract(address, abi, signer) {
    const signerOrProvider = signer ?? simpleRpcProvider;

    return new ethers.Contract(address, abi, signerOrProvider);
}

export function isAddress(value) {
    try {
        return getAddress(value)
    } catch {
        return false
    }
}

// account is not optional
export function getSigner(library, account) {
    return library.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(library, account = null) {
    return account ? getSigner(library, account) : library
}

export function getProfileContract(signer) {
    return getContract(PROFILE_ADDRESS, ProfileContract.abi, signer);
}

export function getBazaarContract(signer) {
    return getContract(BAZAAR_ADDRESS, BazaarContract.abi, signer);
}

export function getBep20Contract(address, signer) {
    return getContract(address, ERC20Contract.abi, signer);
}

export function useContract(address, abi, withSignerIfPossible = true) {
    const { library, account } = useActiveWeb3React()

    return useMemo(() => {
        if (!address || !abi || !library) return null;

        try {
            return getContract(address, abi, library)
        } catch (error) {
            console.error('Failed to get contract', error)
            return null
        }
    }, [address, abi, library, withSignerIfPossible, account])
}

export const useProfileContract = () => {
    const { library } = useActiveWeb3React();

    return useMemo(() => getProfileContract(library.getSigner()), [library]);
}

export const useTokenContract = (tokenAddress) => {
    const { library } = useActiveWeb3React();

    return useMemo(() => getBep20Contract(tokenAddress, library.getSigner()), [library]);
}

export const useBazaarContract = () => {
    const { library } = useActiveWeb3React();

    return useMemo(() => getBazaarContract(library.getSigner()), [library]);
}

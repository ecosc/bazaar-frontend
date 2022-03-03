import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { BIG_ZERO } from 'utils/bigNumber'
import { simpleRpcProvider } from 'utils/providers'
import useLastUpdated from './useLastUpdated'
import useRefresh from 'hooks/useRefresh'
import tokens from 'constants/tokens'
import { getBep20Contract } from './useContracts'

export const FetchStatus = {
  NOT_FETCHED: 'not-fetched',
  SUCCESS: 'success',
  FAILED: 'failed',
}

export const getTokenBalance = async (tokenAddress, account) => {
  const contract = getBep20Contract(tokenAddress);

  return contract.balanceOf(account);
}

const useTokenBalance = (tokenAddress) => {
  const { NOT_FETCHED, SUCCESS, FAILED } = FetchStatus
  const [balanceState, setBalanceState] = useState({
    balance: BIG_ZERO,
    fetchStatus: NOT_FETCHED,
  })
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh();

  useEffect(() => {
    const fetchBalance = async () => {
      const contract = getBep20Contract(tokenAddress)
      try {
        const res = await contract.balanceOf(account);
        setBalanceState({ balance: res, fetchStatus: SUCCESS })
      } catch (e) {
        console.error(e)
        setBalanceState((prev) => ({
          ...prev,
          fetchStatus: FAILED,
        }))
      }
    }

    if (account) {
      fetchBalance()
    }
  }, [account, tokenAddress, fastRefresh, SUCCESS, FAILED])

  return balanceState
}

export const useBurnedBalance = (tokenAddress) => {
  const [balance, setBalance] = useState(BIG_ZERO)
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      const contract = getBep20Contract(tokenAddress)
      const res = await contract.balanceOf('0x000000000000000000000000000000000000dEaD')
      setBalance(res)
    }

    fetchBalance()
  }, [tokenAddress, slowRefresh])

  return balance
}

export const useGetBnbBalance = () => {
  const [fetchStatus, setFetchStatus] = useState(FetchStatus.NOT_FETCHED)
  const [balance, setBalance] = useState(ethers.BigNumber.from(0))
  const { account } = useWeb3React()
  const { lastUpdated, setLastUpdated } = useLastUpdated()

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const walletBalance = await simpleRpcProvider.getBalance(account)
        setBalance(walletBalance)
        setFetchStatus(FetchStatus.SUCCESS)
      } catch {
        setFetchStatus(FetchStatus.FAILED)
      }
    }

    if (account) {
      fetchBalance()
    }
  }, [account, lastUpdated, setBalance, setFetchStatus])

  return { balance, fetchStatus, refresh: setLastUpdated }
}

export const useGetEcuBalance = () => {
  const { balance, fetchStatus } = useTokenBalance(tokens.ecu.address)

  return { balance: ethers.BigNumber.from(balance.toString()), fetchStatus }
}

export default useTokenBalance

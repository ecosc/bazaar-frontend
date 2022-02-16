import { useMemo, useState } from 'react';
import { useTokenContract } from './useContracts'

function useTokenAllowance(token, owner, spender) {
  const contract = useTokenContract(token?.address, false);
  const [allowance, setAllowance] = useState();

  const fetch = async () => {
    const res = await contract?.allowance(owner, spender);

    setAllowance(res);
  }

  return useMemo(
    () => {
      fetch();

      return token && allowance ? allowance : undefined;
    },
    [token, allowance, owner],
  )
}

export default useTokenAllowance

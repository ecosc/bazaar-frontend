import { BigNumber } from "ethers"
import BigNumberJs from 'bignumber.js'

export const BIG_ZERO = BigNumber.from(0)
export const BIG_ONE = BigNumber.from(1)
export const BIG_NINE = BigNumber.from(9)
export const BIG_TEN = BigNumber.from(10)

export const ethersToBigNumber = (ethersBn) => new BigNumberJs(ethersBn.toString())

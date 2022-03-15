import { expandTo18Decimals } from "utils/bigNumber";

const { BigNumber } = require("ethers");

export const GUARANTEE_PERCENT = BigNumber.from(3500);
export const CANCELLATION_FEE = BigNumber.from(2000);
export const CLOSE_FEE = BigNumber.from(10);
export const SELL_FEE = BigNumber.from(125);
export const BUY_FEE = BigNumber.from(125);
export const CREATE_PROFILE_FEE = expandTo18Decimals(50);

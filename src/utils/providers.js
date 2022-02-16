import network from 'constants/network';
import { ethers } from 'ethers';

const RPC_URL = network.rpcUrls[0];

export const simpleRpcProvider = new ethers.providers.StaticJsonRpcProvider(RPC_URL)

import { ethers } from 'ethers';
import { BUNDLER, RPC } from '../../constants';

export const provider = new ethers.providers.StaticJsonRpcProvider(RPC);
export const bundler = new ethers.providers.StaticJsonRpcProvider(BUNDLER);
// export const paymasterProvider = new ethers.providers.StaticJsonRpcProvider(PAYMASTER);

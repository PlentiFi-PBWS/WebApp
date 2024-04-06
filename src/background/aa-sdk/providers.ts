import { ethers } from 'ethers';
import { RPC } from '../../constants';

export const provider = new ethers.providers.StaticJsonRpcProvider(RPC);

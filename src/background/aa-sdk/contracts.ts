import { ethers, Contract } from 'ethers';
import walletFactory from './abis/webauthnWalletFactory.json';
import simpleAccount from './abis/simpleAccount.json';
import entrypoint from './abis/entrypoint.json';
import { provider } from './providers';
import { ENTRYPOINT_CONTRACT, WALLETFACTORY_CONTRACT } from '../../constants';

export const simpleAccountAbi = new ethers.utils.Interface(simpleAccount.abi);
export const entrypointContract = new Contract(ENTRYPOINT_CONTRACT!, entrypoint.abi, provider);
export const walletFactoryContract = new Contract(
  WALLETFACTORY_CONTRACT!,
  walletFactory.abi,
  provider,
);

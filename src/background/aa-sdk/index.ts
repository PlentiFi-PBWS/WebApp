import { ethers } from "ethers";
import { ENTROPY, RPC } from "../../constants";
import { walletFactoryContract } from "./contracts";

export const getEthBalance = async (address: string) => {
  const provider = new ethers.providers.StaticJsonRpcProvider(RPC);
  return await provider.getBalance(address);
}

export const getAddress = async (login: string, entropy?: number) => {
  return await walletFactoryContract.getAddress(
    login,
    entropy !== undefined ? entropy : ENTROPY
  );
}

export { sendTransaction as sendUserOp } from "./sdk";
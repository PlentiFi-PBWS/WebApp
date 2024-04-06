import { ENTROPY, RPC } from "../../constants";

export const getXrpBalance = async (address: string) => {
  // todo
  return 'balance'; // todo
}

export const getAddress = async (login: string, entropy?: number) => {
  throw Error('Not implemented');
  // todo
}

export { sendTransaction as sendUserOp } from "./sdk";
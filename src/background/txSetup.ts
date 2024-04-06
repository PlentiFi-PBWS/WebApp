import { deployWallet, sendTransaction } from "./aa-sdk/sdk";
import { AVAILABLE_TOKENS, SMART_ACCOUNT_KEY } from "../constants";


export async function swap(login: string, tokenIn: string, tokenOut: string, amountIn: bigint, amountOut: bigint, account: string, ammAddr: string): Promise<string> {
  // localStorage.clear();

  // swap with amm
  return 'txResult'; // tx hash
}

export const deploySmartWallet = async (login: string, fund = true) => {
  localStorage.clear();

  const hash = await deployWallet(login);
  console.log("Registered account: ", localStorage.getItem(SMART_ACCOUNT_KEY), "\nwith login: ", login, "\nTx hash: ", hash);

  // for demo purposes: fund the account with some XRP
  if (fund) {
    // fund the account with some XRP
  }

  return hash;
}


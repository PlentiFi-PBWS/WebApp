import { ethers } from "ethers";
import { provider } from "./aa-sdk/providers";
import { deployWallet, sendTransaction } from "./aa-sdk/sdk";
import { AVAILABLE_TOKENS, SMART_ACCOUNT_KEY } from "../constants";


export async function swap(login: string, tokenIn: string, tokenOut: string, amountIn: bigint, amountOut: bigint, account: string, ammAddr: string): Promise<string> {
  // localStorage.clear();

  const amm = new ethers.Contract(ammAddr, ["function swap(uint256 amountIn, uint256 amountOut, address tokenIn, address tokenOut, address to) external"], provider);


  const txResult = await sendTransaction(login, account, amm.interface.encodeFunctionData('swap', [amountIn, amountOut, tokenIn, tokenOut, account]), ammAddr, BigInt(0));

  console.log("account ", account, " swapped ", amountIn, " of ", tokenIn, " for ", amountOut, " of ", tokenOut, " for ", account, "\nTx hash: ", txResult);

  return txResult; // tx hash
}

export const deploySmartWallet = async (login: string, fund = true) => {
  localStorage.clear();

  const hash = await deployWallet(login);
  console.log("Registered account: ", localStorage.getItem(SMART_ACCOUNT_KEY), "\nwith login: ", login, "\nTx hash: ", hash);

  // for demo purposes: fund the account with some USDT
  if (fund) {
    const usdtAddress = AVAILABLE_TOKENS.find(token => token.ticker === 'USD')?.address;
    if (usdtAddress !== undefined) {
      const usdt = new ethers.Contract(
        usdtAddress!,
        ["function mint(address to, uint256 amount) external"],
        provider
      );

      const account = localStorage.getItem(SMART_ACCOUNT_KEY) || '';
      if (account !== '') {
        const fundTxResult = await sendTransaction(login, account, usdt.interface.encodeFunctionData('mint', [account, "2000000000000000000000"]), usdtAddress!, BigInt(0));
        console.log("Funded account: ", account, " with 2000 USDT\nTx hash: ", fundTxResult);
        console.log("usd contract address: ", usdtAddress);
      }
    }
  }

  return hash;
}


import { ethers } from "ethers";
import { LoginData, provider, SmartAccount, UserOp } from "./smartAccountSdk";
import { AVAILABLE_TOKENS, SMART_ACCOUNT_KEY } from "../constants";


export async function swap(loginData: LoginData, tokenIn: string, tokenOut: string, amountIn: bigint, amountOut: bigint, account: string, ammAddr: string): Promise<string> {

  const smartAccount = await SmartAccount.new(loginData);

  const amm = new ethers.Contract(ammAddr, ["function swap(uint256 amountIn, uint256 amountOut, address tokenIn, address tokenOut, address to) external"], provider);

  const txResult = await smartAccount.execute({
    targetAddress: amm.address,
    callData: amm.interface.encodeFunctionData('swap', [amountIn, amountOut, tokenIn, tokenOut, account]),
    value: '0'
  } satisfies UserOp)

  console.log("account ", account, " swapped ", amountIn, " of ", tokenIn, " for ", amountOut, " of ", tokenOut, " for ", account, "\nTx hash: ", txResult);

  return txResult.hash !== '' ? txResult.hash : (txResult as { message: string}).message ; // tx hash or error msg
}


import { ethers, Wallet } from "ethers";
import { LOGIN_KEY, RPC, XRPL_BASE_LOGIN_SERVICE_URL } from "../../constants";
import { webAuthn } from "../aa-sdk/sdk";

export interface Account {
  multisigAddress: string,
  signers: string[],
  yourSeed: string,
}

export interface Tx {
  txType: "Payment" | "Swap";
}

export interface MultisigSwapData extends Tx {
  login: string;
  password: string;
  tokenIn: { currency: string | null, amount: string, issuer: string | undefined };
  tokenOut: { currency: string | null, amount: string, issuer: string | undefined };
  poolSeed: string;
}

export async function XRPLSetupUserAccount(login: string, password: string): Promise<Account> {
  const loginData = {
    login,
    password
  }

  const response = await fetch(`${XRPL_BASE_LOGIN_SERVICE_URL}/setup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });

  const data: {
    multisigAddress: string,
    signers: string[],
    yourSeed: string,
  } = await response.json();
  console.log(data);

  return data;
}


export async function xrplTx(login: string, password: string, multisigAddress: string, receiver: string, dropsAmount: string): Promise<{ txHash: string }> {
  // const response3 = await fetch(`${XRPL_BASE_LOGIN_SERVICE_URL}/tx`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     txType: "Payment",
  //     multisigAddress,
  //     loginData: {
  //       login: "string",
  //       password: "string",
  //     },
  //     destination: receiver,
  //     amount: dropsAmount, // in drops (smallest unit of XRP)
  //     loginService: "true",
  //     fee: "12000",
  //   }),
  // });
  const response3 = await fetch("http://localhost:3002/tx", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      txType: "Payment",
      multisigAddress: multisigAddress,
      loginData: {
        login: login,
        password: password,
      },
      destination: receiver,
      amount: "11000000", // in drops (smallest unit of XRP)
      loginService: "true",
      fee: "12000",
    }),
  });

  const jsonResponse = await response3.json();

  console.log("xrpl tx response: ", jsonResponse);

  return jsonResponse.hash ?? "An error occurred while sending the transaction. Please try again.";
}

export async function swapXrpl(
  login: string,
  password: string,
  tokenIn: { currency: string, amount: string, issuer: null | string },
  tokenOut: { currency: string, amount: string, issuer: null | string },
  masterSeed: string,
  multisigAddress: string,
): Promise<string[] | string> {

  const userId = await webAuthn(
    localStorage.getItem(LOGIN_KEY)!,
    "0x6b51d431df5d7f141cbececcf79edf3dd861c3b4069f0b11661a3eefacbba918" // todo: use real op hash
  );
  const response = await fetch("http://localhost:3002/tx", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      txType: "Swap",
      login: login,
      password: password,
      tokenIn: tokenIn,
      tokenOut: tokenOut,
      poolSeed: masterSeed,
      multisigAddress,
      userId,
    }),
  });
  console.log("swap ended");
  const jsonResponse = (await response.json()) as {
    message: string,
    hash: [string, string],
  }
  console.log("swap ended: ", jsonResponse.hash);

  return jsonResponse.hash ?? "An error occurred while swapping. Please try again.";
}








export async function getTotalXrpBalance(xrplAddress: string, evmAddress: string): Promise<string> {
  try {
    const apiResponse = await fetch(`${XRPL_BASE_LOGIN_SERVICE_URL}/xrpBalance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ xrplAddress }),
    });

    const jsonResponse = await apiResponse.json();
    console.log("xrpl balance: ", jsonResponse);

    const xrplBalance = Number(jsonResponse.xrplBalance);

    const evmSidechainProvider = new ethers.providers.JsonRpcProvider(RPC);
    // console.log("evm address: ", evmAddress);
    // console.log("evm provider: ", RPC);
    const evmBalance = (await evmSidechainProvider.getBalance(evmAddress));
    // console.log("evm balance: ", evmBalance);

    return ((xrplBalance / 1000000) + (Number(evmBalance) / 1000000000000000000)).toString();
  } catch (error) {
    console.error("Error while fetching total balance: ", error);
    return "0";
  }
}

export async function getWHTBalance(xrplAddress: string): Promise<string> {
  const apiResponse = await fetch(`${XRPL_BASE_LOGIN_SERVICE_URL}/wheatBalance`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ xrplAddress }),
  });

  const jsonResponse = await apiResponse.json();
  console.log("wheat balance: ", jsonResponse);

  return (Number(jsonResponse.whtBalance) / 1000000).toString();
}
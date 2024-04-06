import { Wallet } from "ethers";
import { XRPL_BASE_LOGIN_SERVICE_URL } from "../../constants";
import { json } from "stream/consumers";

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

export async function setupXrplAmm(login: string, password: string, multisigAddress: string): Promise<{
  masterSeed: string,
  userSeed: string,
  currency: {
    currency: string,
    issuer: string,
    value: string,
  },
}> {
  const response0 = await fetch(`${XRPL_BASE_LOGIN_SERVICE_URL}/setupAmm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      login: login,
      password: password,
      multisigAddress: multisigAddress,
    }),
  });
  const response0Data = await response0.json();
  console.log("init ended: ", response0Data);

  return response0Data as {
    masterSeed: string,
    userSeed: string,
    currency: {
      currency: string,
      issuer: string,
      value: string,
    },
  };
}

export async function swapXrpl(
  login: string,
  password: string,
  tokenIn: { currency: string, amount: string, issuer: null | string },
  tokenOut: { currency: string, amount: string, issuer: null | string },
  masterSeed: string
): Promise<string[] | string> {
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
    }),
  });
  console.log("swap ended");
  const jsonResponse = (await response.json()) as {
    message: string,
    hash: [string, string],
  }
  console.log("swap ended: ", await response.json());

  return jsonResponse.hash ?? "An error occurred while swapping. Please try again.";
}
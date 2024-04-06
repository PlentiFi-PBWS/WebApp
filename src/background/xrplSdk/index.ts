import { XRPL_BASE_LOGIN_SERVICE_URL } from "../../constants";

export interface Account {
  multisigAddress: string,
  signers: string[],
  yourSeed: string,
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
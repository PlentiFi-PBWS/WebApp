import { LOGIN_KEY, RPC, SMART_ACCOUNT_KEY } from "../../constants";



export const deployWallet = async (login: string): Promise<string> => {
  if (!login) throw Error('Login not set');

  // todo: deploy

  const smartAccountAddress = ''; // todo
  console.log('wallet deployed at: ', smartAccountAddress);

  localStorage.setItem(SMART_ACCOUNT_KEY, smartAccountAddress);
  localStorage.setItem(LOGIN_KEY, login);

  return 'accountData' // todo: return address, pubkey and seed as object
};

export const sendTransaction = async (login: string, account: string, callData: string, target: string, value: bigint) => {

  if (!login) throw Error('Login not set');
  // todo: send tx
  throw Error('Not implemented');
};


export async function getAddress(login: string): Promise<string> {
  console.log("get address: login value: ", login)
  return 'address'; // todo
};


// broadcast tx to the bundler
export async function broadcastTx(smartAccount: string, target: string, value: bigint, callData: string, signature: string, userOpHash: string) {
  // todo: broadcast
  return 'txHash'; // todo
}
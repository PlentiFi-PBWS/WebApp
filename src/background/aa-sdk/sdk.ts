import { Contract, ethers } from "ethers";
import { signUserOp, signUserOpWithCreate } from "./walletTools";
import { BUNDLER_BASE_URL, ENTRYPOINT_CONTRACT, LOGIN_KEY, MASTER_SEED_KEY, RPC, SMART_ACCOUNT_KEY, WALLETFACTORY_CONTRACT, XRPL_SMART_ACCOUNT_KEY, XRPL_TOKEN } from "../../constants";
import entrypoint from './abis/entrypoint.json';
import walletFactory from './abis/webauthnWalletFactory.json';
import { ENTROPY } from "../../constants";
import { setupXrplAmm, XRPLSetupUserAccount } from "../xrplSdk";


export const provider = new ethers.providers.StaticJsonRpcProvider(RPC);
export const entrypointContract = new Contract(ENTRYPOINT_CONTRACT!, entrypoint.abi, provider);
export const walletFactoryContract = new Contract(
  WALLETFACTORY_CONTRACT!,
  walletFactory.abi,
  provider,
);

export const deployWallet = async (login: string) => {
  if (!login) throw Error('Login not set');

  const bundler_url = `${BUNDLER_BASE_URL}/bundler/deploySmartAccount`;

  const body = JSON.stringify({
    factory: WALLETFACTORY_CONTRACT!,
    login,
    entropy: ENTROPY!,
  } satisfies {
    factory: string, // target address
    login: string, // amount to send (in wei)
    entropy: number, // call data
  });

  console.log('broadcasting tx\n', body);

  const response = await fetch(bundler_url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });

  const json = await response.json();
  console.log('broadcast response: ', json);
  const smartAccountAddress = await walletFactoryContract.getAddress(login, ENTROPY);
  console.log('wallet deployed at: ', smartAccountAddress);
  const password = 'passwordd'; // todo: add in form and request at each tx
  const userAccount = await XRPLSetupUserAccount(login, password);
  console.log('xrpl userAccount: ', userAccount);
  localStorage.setItem(SMART_ACCOUNT_KEY, smartAccountAddress);
  localStorage.setItem(XRPL_SMART_ACCOUNT_KEY, userAccount.multisigAddress);
  localStorage.setItem(LOGIN_KEY, login);

  const ammData = await setupXrplAmm(login, password, userAccount.multisigAddress);
  // localStorage.setItem()
  console.log('xrpl ammData: ', ammData);
  localStorage.setItem(MASTER_SEED_KEY, ammData.masterSeed);
  localStorage.setItem(XRPL_TOKEN, JSON.stringify(ammData.currency));

  return json.message;
};

export const sendTransaction = async (login: string, account: string, callData: string, target: string, value: bigint) => {
  // try {
    if (!login) throw Error('Login not set');

    // const smartAccount = new ethers.Contract(account, ["function execute(address dest, uint256 value, bytes calldata func, bytes memory signature, bytes32 userOpHash) external"], signer);

    console.log('yo login', login);

    const walletAddress = await getAddress(login);
    console.log('yo walletAddress', walletAddress);

    const walletCode = await provider.getCode(walletAddress);
    console.log('yo walletCode', walletCode);
    const walletExists = walletCode !== '0x';
    console.log('yo walletExists', walletExists);
    console.log({ walletExists });

    if (!walletExists) {
      // deploy wallet from factory
      throw new Error('Smart Wallet is not deployed at ' + walletAddress);
    }

    // hash callData var using abi.encode and keccak256 from ethers
    const userOpHash = ethers.utils.keccak256(callData);

    console.log('TO SIGN', { userOpHash });
    const loginPasskeyId = localStorage.getItem(`${login}_passkeyId`);

    console.log('retrieved passkeyId', loginPasskeyId);
    const signature = loginPasskeyId
      ? await signUserOp(userOpHash, loginPasskeyId)
      : await signUserOpWithCreate(userOpHash, login);

    if (!signature) throw new Error('Signature failed');

    console.log("signedUserOp:\n", { callData, signature });

    // const tx = await smartAccount.execute(target, value, callData, signature, userOpHash);
    // console.log('Transaction submitted:', tx);
    // await tx.wait();
    // console.log('Transaction confirmed');

    return await broadcastTx(account, target, value, callData, signature, userOpHash);
  // } catch (error) {
  //   console.error('Failed to send userOp:', error);
  //   return 'Failed to send userOp';
  // }
};


export async function getAddress(login: string): Promise<string> {
  console.log("get address: login value: ", login)
  return walletFactoryContract.getAddress(login, ENTROPY);
};


// broadcast tx to the bundler
export async function broadcastTx(smartAccount: string, target: string, value: bigint, callData: string, signature: string, userOpHash: string) {
  const bundler_url = `${BUNDLER_BASE_URL}/bundler/broadcastUserOp`;

  const body = JSON.stringify({
    smartAccount: smartAccount,
    target,
    value: value.toString(),
    callData,
    signature,
    userOpHash,
  } satisfies {
    smartAccount: string, // smart account address
    target: string, // target address
    value: string, // amount to send (in wei)
    callData: string, // call data
    signature: string, // signature
    userOpHash: string, // user operation hash
  });

  console.log('broadcasting tx\n', body);

  const response = await fetch(bundler_url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });

  const json = await response.json();
  console.log('broadcast response: ', json);

  return json.message;
}

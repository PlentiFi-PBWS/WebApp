import { entrypointContract, walletFactoryContract } from "./contracts";
import { ethers } from "ethers";
import { IUserOperation, Presets, UserOperationBuilder } from "userop";
import { bundler, provider } from "./providers";
import { getGasLimits, getPaymasterData, signUserOp, signUserOpWithCreate, userOpToSolidity, waitForUserOp } from "./walletTools";
import { ENTRYPOINT_CONTRACT } from "../../constants";
import { LoginData, TxResponse } from "./sdk";

// todo: check why yuobi keys sig are invalid
export async function sendUserOperation( // todo: handle revert when estimating gas
  loginData: LoginData,
  userOpBuilder: UserOperationBuilder,
): Promise<TxResponse> {

  const { login, entropy } = loginData;
  try {
    alert("starting with login: " + login);

    if (!login) throw Error('Login not set');
    console.log('yo login', login);

    const walletAddress = await getAddress(loginData);
    console.log('yo walletAddress', walletAddress);
    alert("yo walletAddress: " + walletAddress);

    const walletCode = await provider.getCode(walletAddress);
    console.log('yo walletCode', walletCode);
    const walletExists = walletCode !== '0x';
    console.log('yo walletExists', walletExists);
    console.log({ walletExists });

    if (!walletExists) {
      userOpBuilder.setInitCode(
        walletFactoryContract.address +
        walletFactoryContract.interface.encodeFunctionData('createAccount(string, uint256)', [login, entropy]).slice(2),
        // walletFactoryContract.interface.encodeFunctionData('createAccount(string, bytes, uint256[2], uint256)', [login, credId, pubKeyCoordinates, 0]).slice(2) ///////
      );
      // string calldata login,
      // bytes calldata credId,
      // uint256[2] calldata pubKeyCoordinates,
      // uint256 salt
    }

    const { chainId } = await provider.getNetwork();
    const userOpToEstimateNoPaymaster = await userOpBuilder.buildOp(ENTRYPOINT_CONTRACT!, chainId);
    const paymasterAndData = await getPaymasterData(userOpToEstimateNoPaymaster);
    const userOpToEstimate = {
      ...userOpToEstimateNoPaymaster,
      paymasterAndData,
    };
    console.log({ userOpToEstimate });
    console.log('estimated userop', userOpToSolidity(userOpToEstimate));

    const [gasLimits, baseUserOp] = await Promise.all([
      getGasLimits(userOpToEstimate),
      userOpBuilder.buildOp(ENTRYPOINT_CONTRACT!, chainId),
    ]);
    console.log({
      gasLimits: Object.fromEntries(
        Object.entries(gasLimits).map(([key, value]) => [key, ethers.BigNumber.from(value).toString()]),
      ),
    });
    // alert("preVerifLimit: " + gasLimits.preVerificationGas);
    const userOp: IUserOperation = {
      ...baseUserOp,
      callGasLimit: gasLimits.callGasLimit,
      preVerificationGas: (parseInt(gasLimits.preVerificationGas) + 71804).toString(), // todo: need to be fixed. original: gasLimits.preVerificationGas,
      verificationGasLimit: gasLimits.verificationGasLimit,
      paymasterAndData,
    };

    console.log("userop: \n", { userOp });
    // console.log('to sign', userOpToSolidity(userOp));
    const userOpHash = await entrypointContract.getUserOpHash(userOp);
    console.log('TO SIGN', { userOpHash });
    const loginPasskeyId = localStorage.getItem(`${login}_passkeyId`);
    console.log('retrieved passkeyId', loginPasskeyId);
    alert("retrieved passkeyId: " + loginPasskeyId);
    const signature = loginPasskeyId
      ? await signUserOp(userOpHash, loginPasskeyId)
      : await signUserOpWithCreate(userOpHash, login);
    alert("signature: " + signature);
    if (!signature) throw new Error('Signature failed');
    const signedUserOp: IUserOperation = {
      ...userOp,
      paymasterAndData: await getPaymasterData(userOp),
      signature,
    };
    console.log("signedUserOp:\n", { signedUserOp });
    console.log('signed\n', userOpToSolidity(signedUserOp));
    alert("signedUserOp: " + JSON.stringify(signedUserOp));
    const receipt = await sendUserOp(signedUserOp);

    return receipt;
  } catch (e) {
    alert("error: " + e);
    return { hash: '', message: "error: " + e };
  }
};


export const getAddress = async (loginData: LoginData): Promise<string> => {
  console.log("get address: for login: ", loginData);
  return walletFactoryContract.getAddress(loginData.login, loginData.entropy);
};

export const sendUserOp = async (userOp: IUserOperation): Promise<ethers.providers.TransactionResponse> => {
  console.log("yo userOp", userOp)
  console.log("yo entrypoint", entrypointContract.address)
  const userOpHash = await bundler.send('eth_sendUserOperation', [userOp, entrypointContract.address]);
  return waitForUserOp(userOpHash, userOp);
};


// sendTransaction().then(() => {
//   console.log('done');
// });
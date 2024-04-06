import axios from 'axios';
import { ethers } from 'ethers';
import base64url from 'base64url';
import { v4 as uuid } from 'uuid';
import { IUserOperation } from 'userop';
import { startAuthentication, startRegistration } from '@simplewebauthn/browser';
import { authResponseToSigVerificationInput } from './debugger/authResponseToSigVerificationInput';
import { decodeAuthenticationCredential } from './debugger/decodeAuthenticationCredential';
import { decodeRegistrationCredential } from './debugger/decodeRegistrationCredential';
import { entrypointContract, walletFactoryContract } from './contracts';
import { provider } from './providers';
import { LOGIN_SERVICE_PORT } from '../../constants';
// import { LOGIN_SERVICE_PORT } from './constants';


enum SignatureTypes {
  NONE,
  WEBAUTHN_UNPACKED,
  LOGIN_SERVICE,
  WEBAUTHN_UNPACKED_WITH_LOGIN_SERVICE,
}

export const getGasLimits = async (
  userOp: IUserOperation,
): Promise<{
  callGasLimit: string;
  preVerificationGas: string;
  verificationGasLimit: string;
}> => {
  console.log('ESTIMATING', userOp);
  return {
    callGasLimit: "0x88b8",
    verificationGasLimit: "0x011170",
    preVerificationGas: "0x5208",
  };

};

export const getPaymasterData = async (userOp: IUserOperation): Promise<string> => {
  // return paymasterProvider.send('pm_sponsorUserOperation', [userOp]);
  return '0x';
};

export const waitForUserOp = async (
  userOpHash: string,
  userOp: IUserOperation,
  maxRetries = 50,
): Promise<ethers.providers.TransactionResponse> => {
  if (maxRetries < 0) {
    throw new Error("Couldn't find the userOp broadcasted: " + userOpHash);
  }

  const lastBlock = await provider.getBlock('latest');
  const events = await entrypointContract.queryFilter(
    entrypointContract.filters.UserOperationEvent(userOpHash),
    lastBlock.number - 100,
  );

  if (events[0]) {
    const transaction = await events[0].getTransaction();
    return transaction;
  }

  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
  return waitForUserOp(userOpHash, userOp, --maxRetries);
};


export const signUserOp = async (userOpHash: string, passkeyIdHex: string): Promise<string> => {
  // console.log({ userOpHash });

  // const challenge = Buffer.from(userOpHash.slice(2), 'hex');
  // console.log('base6url challenge', base64url.encode(challenge));

  // const signatureResponse = await startAuthentication({
  //   challenge: base64url.encode(challenge),
  //   allowCredentials: [
  //     {
  //       id: base64url.encode(Buffer.from(passkeyIdHex.slice(2), 'hex')),
  //       type: 'public-key',
  //       transports: ['internal'],
  //     },
  //   ],
  // });
  // console.log('webauthn response', signatureResponse);

  // const { response: decodedResponse } = decodeAuthenticationCredential(signatureResponse);
  // console.log('decoded webauthn response', decodedResponse);

  // const ecVerifyInputs = authResponseToSigVerificationInput({}, signatureResponse.response);
  // console.log('verify inputs', ecVerifyInputs);

  // const challengeOffsetRegex = new RegExp(`(.*)${Buffer.from(base64url.encode(challenge)).toString('hex')}`);
  // const challengePrefix = challengeOffsetRegex.exec(
  //   base64url.toBuffer(signatureResponse.response.clientDataJSON).toString('hex'),
  // )?.[1];
  // console.log({ challengeOffsetRegex, challengePrefix });

  // console.log('webauthn verify inputs', [
  //   SignatureTypes.WEBAUTHN_UNPACKED,
  //   decodedResponse.authenticatorData.flagsMask,
  //   `0x${base64url.toBuffer(signatureResponse.response.authenticatorData).toString('hex')}`,
  //   `0x${base64url.toBuffer(signatureResponse.response.clientDataJSON).toString('hex')}`,
  //   userOpHash,
  //   Buffer.from(challengePrefix || '', 'hex').length,
  //   ecVerifyInputs.signature[0],
  //   ecVerifyInputs.signature[1],
  //   Buffer.from(passkeyIdHex.slice(2), 'hex').toString('hex'),
  // ]);

  // return ethers.utils.defaultAbiCoder.encode(
  //   ['bytes1', 'bytes1', 'bytes', 'bytes', 'bytes', 'uint256', 'uint256', 'uint256', 'bytes'],
  //   [
  //     SignatureTypes.WEBAUTHN_UNPACKED,
  //     decodedResponse.authenticatorData.flagsMask,
  //     base64url.toBuffer(signatureResponse.response.authenticatorData),
  //     base64url.toBuffer(signatureResponse.response.clientDataJSON),
  //     Buffer.from(userOpHash.slice(2), 'hex'),
  //     Buffer.from(challengePrefix || '', 'hex').length,
  //     ecVerifyInputs.signature[0],
  //     ecVerifyInputs.signature[1],
  //     Buffer.from(passkeyIdHex.slice(2), 'hex'),
  //   ],
  // );

  console.log({ userOpHash });

  const challenge = Buffer.from(userOpHash.slice(2), 'hex');
  console.log('base6url challenge', base64url.encode(challenge));

  const signatureResponse = await startAuthentication({
    challenge: base64url.encode(challenge),
    allowCredentials: [
      {
        id: base64url.encode(Buffer.from(passkeyIdHex.slice(2), 'hex')),
        type: 'public-key',
        transports: ['internal'],
      },
    ],
  });
  console.log('webauthn response', signatureResponse);

  const { response: decodedResponse } = decodeAuthenticationCredential(signatureResponse);
  console.log('decoded webauthn response', decodedResponse);

  const ecVerifyInputs = authResponseToSigVerificationInput({}, signatureResponse.response);
  console.log('verify inputs', ecVerifyInputs);

  const challengeOffsetRegex = new RegExp(`(.*)${Buffer.from(base64url.encode(challenge)).toString('hex')}`);
  const challengePrefix = challengeOffsetRegex.exec(
    base64url.toBuffer(signatureResponse.response.clientDataJSON).toString('hex'),
  )?.[1];
  console.log({ challengeOffsetRegex, challengePrefix });

  console.log('webauthn verify inputs', [
    SignatureTypes.WEBAUTHN_UNPACKED,
    decodedResponse.authenticatorData.flagsMask,
    `0x${base64url.toBuffer(signatureResponse.response.authenticatorData).toString('hex')}`,
    `0x${base64url.toBuffer(signatureResponse.response.clientDataJSON).toString('hex')}`,
    userOpHash,
    Buffer.from(challengePrefix || '', 'hex').length,
    ecVerifyInputs.signature[0],
    ecVerifyInputs.signature[1],
    Buffer.from(passkeyIdHex.slice(2), 'hex').toString('hex'),
  ]);

  return ethers.utils.defaultAbiCoder.encode(
    ['bytes1', 'bytes1', 'bytes', 'bytes', 'bytes', 'uint256', 'uint256', 'uint256', 'bytes'],
    [
      SignatureTypes.WEBAUTHN_UNPACKED,
      decodedResponse.authenticatorData.flagsMask,
      base64url.toBuffer(signatureResponse.response.authenticatorData),
      base64url.toBuffer(signatureResponse.response.clientDataJSON),
      Buffer.from(userOpHash.slice(2), 'hex'),
      Buffer.from(challengePrefix || '', 'hex').length,
      ecVerifyInputs.signature[0],
      ecVerifyInputs.signature[1],
      Buffer.from(passkeyIdHex.slice(2), 'hex'),
    ],
  );
};

export const signUserOpWithCreate = async (userOpHash: string, login: string): Promise<string> => {
  console.log("signUserOpWithCreate");
  console.log({ userOpHash });

  const challenge = Buffer.from(userOpHash.slice(2), 'hex');
  const encodedChallenge = base64url.encode(challenge);
  console.log('base6url challenge', base64url.encode(challenge));

  const passkey = await startRegistration({
    rp: {
      name: 'WebAuthn.io (Dev)',
      id: 'localhost',
    },
    user: {
      id: base64url.encode(uuid()),
      name: `${login} ${new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })}`,
      displayName: login,
    },
    challenge: base64url.encode(challenge),
    pubKeyCredParams: [
      {
        type: 'public-key',
        alg: -7, // ES256
      },
      {
        type: 'public-key',
        alg: -257, // RS256
      },
    ],
    timeout: 60000,
    authenticatorSelection: {
      // authenticatorAttachment: 'platform', // can prevent simulator from running the webauthn request
    },
    attestation: 'direct',
  });
  const credId = `0x${base64url.toBuffer(passkey.id).toString('hex')}`;
  // localStorage.setItem(`${login}_passkeyId`, credId); /////
  console.log('yo passkeyId', credId);
  // setCustomPasskeyId(login, credId);
  console.log({ credId });
  console.log('webauthn response', passkey);
  const decodedPassKey = decodeRegistrationCredential(passkey);

  console.log('decoded webauthn response', decodedPassKey);

  const supportsDirectAttestation = !!decodedPassKey.response.attestationObject.attStmt.sig;
  console.log({ supportsDirectAttestation });

  const pubKeyCoordinates = [
    '0x' +
    base64url
      .toBuffer(decodedPassKey.response.attestationObject.authData.parsedCredentialPublicKey?.x || '')
      .toString('hex'),
    '0x' +
    base64url
      .toBuffer(decodedPassKey.response.attestationObject.authData.parsedCredentialPublicKey?.y || '')
      .toString('hex'),
  ];
  console.log('pubKeyCoordinates', pubKeyCoordinates);

  const { data: loginServiceData } = await axios.request({
    method: 'POST',
    url: `http://localhost:${LOGIN_SERVICE_PORT}/login`,
    data: {
      login,
      credId,
      pubKeyCoordinates,
    },
  });

  if (supportsDirectAttestation) {
    const ecVerifyInputs = authResponseToSigVerificationInput(
      decodedPassKey.response.attestationObject.authData.parsedCredentialPublicKey,
      {
        authenticatorData: decodedPassKey.response.authenticatorData!,
        clientDataJSON: passkey.response.clientDataJSON,
        signature: decodedPassKey.response.attestationObject.attStmt.sig!,
      },
    );
    console.log('verify inputs', ecVerifyInputs);
    console.log('signaturee:\n', decodedPassKey);
    const challengeOffsetRegex = new RegExp(`(.*)${Buffer.from(encodedChallenge).toString('hex')}`);
    const challengePrefix = challengeOffsetRegex.exec(
      base64url.toBuffer(passkey.response.clientDataJSON).toString('hex'),
    )?.[1];
    console.log({ challengeOffsetRegex, challengePrefix });

    console.log('webauthn verify inputs', [
      SignatureTypes.WEBAUTHN_UNPACKED_WITH_LOGIN_SERVICE,
      decodedPassKey.response.attestationObject.authData.flagsMask,
      `0x${base64url.toBuffer(passkey.response.authenticatorData!).toString('hex')}`,
      `0x${base64url.toBuffer(passkey.response.clientDataJSON).toString('hex')}`,
      userOpHash,
      Buffer.from(challengePrefix || '', 'hex').length,
      ecVerifyInputs.signature[0],
      ecVerifyInputs.signature[1],
      loginServiceData,
    ]);

    return ethers.utils.defaultAbiCoder.encode(
      ['bytes1', 'bytes1', 'bytes', 'bytes', 'bytes', 'uint256', 'uint256', 'uint256', 'bytes'],
      [
        SignatureTypes.WEBAUTHN_UNPACKED_WITH_LOGIN_SERVICE,
        decodedPassKey.response.attestationObject.authData.flagsMask,
        `0x${base64url.toBuffer(passkey.response.authenticatorData!).toString('hex')}`,
        `0x${base64url.toBuffer(passkey.response.clientDataJSON).toString('hex')}`,
        userOpHash,
        Buffer.from(challengePrefix || '', 'hex').length,
        ecVerifyInputs.signature[0],
        ecVerifyInputs.signature[1],
        loginServiceData,
      ],
    );
  }

  console.log(
    'login service inputs',
    ethers.utils.defaultAbiCoder.decode(['bytes1', 'string', 'bytes', 'uint256[2]', 'bytes'], loginServiceData),
  );
  return loginServiceData;
};

export const getAddress = async (login: string): Promise<string> => {
  return walletFactoryContract.getAddress(login, 0);
};

export const userOpToSolidity = (userOp: IUserOperation): string =>
  `
sender: ${userOp.sender},
nonce: ${ethers.BigNumber.from(userOp.nonce).toHexString()},
initCode: hex"${userOp.initCode.toString().slice(2)}",
callData: hex"${userOp.callData.toString().slice(2)}",
callGasLimit: ${ethers.BigNumber.from(userOp.callGasLimit).toHexString()},
verificationGasLimit: ${ethers.BigNumber.from(userOp.verificationGasLimit).toHexString()},
preVerificationGas: ${ethers.BigNumber.from(userOp.preVerificationGas).toHexString()},
maxFeePerGas: ${ethers.BigNumber.from(userOp.maxFeePerGas).toHexString()},
maxPriorityFeePerGas: ${ethers.BigNumber.from(userOp.maxPriorityFeePerGas).toHexString()},
paymasterAndData: hex"${userOp.paymasterAndData.toString().slice(2)}",
signature: hex"${userOp.signature.toString().slice(2)}"`;

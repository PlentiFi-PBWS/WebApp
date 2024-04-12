import { ethers } from "ethers";
import { getAddress, sendUserOperation } from "./sendUserOp";
import { provider } from "./providers";
import { Presets, UserOperationBuilder } from "userop";
import { entrypointContract, simpleAccountAbi } from "./contracts";

enum SignatureTypes {
  NONE,
  WEBAUTHN_UNPACKED,
  LOGIN_SERVICE,
  WEBAUTHN_UNPACKED_WITH_LOGIN_SERVICE,
}

////////////////////////////////////////////////////////////
export async function loginService(params: any) {
  const { login, credId, pubKeyCoordinates } = params;

  const message = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ["bytes1", "string", "bytes", "uint256[2]"],
      [SignatureTypes.LOGIN_SERVICE, login, credId, pubKeyCoordinates]
    )
  );
  const signer = new ethers.Wallet("0x799e37f8ffbc46330f906c4dead6d9367eb91c7a7f1eb4eee27ae612bae9950b");
  const signature = await signer.signMessage(Buffer.from(message.slice(2), "hex"));
  const payload = ethers.utils.defaultAbiCoder.encode(
    ["bytes1", "string", "bytes", "uint256[2]", "bytes"],
    [SignatureTypes.LOGIN_SERVICE, login, credId, pubKeyCoordinates, signature]
  );
  console.log({ message, messageHashed: ethers.utils.hashMessage(message), signature, payload });
  return payload;
}
///////////////////////////////////////////////////////////

export type TxResponse = ethers.providers.TransactionResponse | { hash: string, message: string };

export interface LoginData {
  login: string,
  entropy: number,
}

export interface UserOp {
  targetAddress: string,
  value: string,
  callData: string,
}

/**
 * All the base methods that a smart account should implement
 */
export interface BaseSmartAccount {
  execute(userOp: UserOp): Promise<TxResponse>;
  batchUserOp(userOp: UserOp): void;
  removeBatchedUserOp(index: number): void;
  executeBatch(): Promise<TxResponse>;
  recover(): Promise<void>;
  balance(humanReadable?: boolean): Promise<string>;
  balanceOf(targetAddress: string, humanReadable?: boolean): Promise<string>;
  transfer(targetAddress: string, amount: string): Promise<TxResponse>;
  transferToken(targetAddress: string, to: string, amount: string): Promise<TxResponse>;
  approve(targetAddress: string, spender: string, amount: string): Promise<TxResponse>;
  deploy(bytecode: string, value: string): Promise<TxResponse>;
}

export class SmartAccount implements BaseSmartAccount {
  private loginData: LoginData;
  private batchedUserOp: UserOp[] = [];
  private address?: string;

  // todo: if alice deploys a contract 'alice' + '0123' as entropy,
  // i need to be sure that bob cannot deploy the same contract on another chain.
  constructor(loginData: LoginData, address?: string) {
    this.loginData = loginData;
    this.address = address;
  }

  static async new(loginData: LoginData) { // todo: test
    const address = await getAddress(loginData);
    return new SmartAccount(loginData, address);
  }

  async getAddress() {
    return this.address ?? await getAddress(this.loginData);
  }

  /**
   * Send a specific user operation
   * 
   * @param userOp - the user operation to send
   * 
   * @returns the transaction receipt if the operation was successful, otherwise an error message
   */
  async execute(userOp: UserOp): Promise<TxResponse> {
    if (!this.address) this.address = await getAddress(this.loginData);

    const { targetAddress, value, callData } = userOp;

    const userOpBuilder = new UserOperationBuilder()
      .useDefaults({
        sender: this.address,
      })
      .useMiddleware(Presets.Middleware.getGasPrice(provider))
      .setCallData(
        simpleAccountAbi.encodeFunctionData('execute', [
          targetAddress,
          value,
          callData,
        ]),
      )
      .setNonce(await entrypointContract.getNonce(this.address, this.loginData.entropy));
    return await sendUserOperation(this.loginData, userOpBuilder);
  }

  /**
   * add a specific user operation to the batch
   * 
   * @param userOp - the user operation to add to the batch
   * 
   * @returns void
   */
  batchUserOp(userOp: UserOp | UserOp[]) { // todo: test
    if (Array.isArray(userOp)) {
      this.batchedUserOp.push(...userOp);
      return;
    }
    this.batchedUserOp.push(userOp);
  }

  /**
   * remove a specific user operation from the batch
   * 
   * @param index - the index of the user operation to remove from the batch
   * 
   * @returns void
   */
  removeBatchedUserOp(index: number) { // todo: test
    this.batchedUserOp.splice(index, 1);
  }

  /**
   * Execute all the user operations in the batch
   * 
   * @remarks
   * - The operations in order of addition to the batch
   * - The operations are executed in a single transaction
   * 
   * @return the transaction receipts of the executed operations
   */
  async executeBatch(): Promise<TxResponse> { // todo: test
    // executeBatch(address[] calldata dest, uint256[] calldata value, bytes[] calldata func)
    const userOpBuilder = new UserOperationBuilder()
      .useDefaults({
        sender: this.address,
      })
      .useMiddleware(Presets.Middleware.getGasPrice(provider))
      .setCallData(
        simpleAccountAbi.encodeFunctionData('executeBatch', [
          this.batchedUserOp.map(op => op.targetAddress),
          this.batchedUserOp.map(op => op.value),
          this.batchedUserOp.map(op => op.callData),
        ]),
      )
      .setNonce(await entrypointContract.getNonce(this.address, this.loginData.entropy));

    const response = await sendUserOperation(this.loginData, userOpBuilder);

    this.batchedUserOp = [];

    return response;
  }

  /**
   * Allow a new WebAuthn signer to interact with the smart account
   * 
   * @param credId - the credential id of the new signer
   * @param pubKeyCoordinates - the public key coordinates of the new signer [hex(x), hex(y)]
   * 
   * @returns the transaction receipt if the addition was successful, otherwise an error message
   */
  async addWebAuthnSigner( // todo: test
    credId: string,
    pubKeyCoordinates: [string, string]
  ) {

    if (!this.address) this.address = await getAddress(this.loginData);

    const userOpBuilder = new UserOperationBuilder()
      .useDefaults({
        sender: this.address,
      })
      .useMiddleware(Presets.Middleware.getGasPrice(provider))
      .setCallData(
        simpleAccountAbi.encodeFunctionData('addSigner', [
          credId,
          pubKeyCoordinates,
        ]),
      )
      .setNonce(await entrypointContract.getNonce(this.address, this.loginData.entropy));

    return await sendUserOperation(this.loginData, userOpBuilder);
  }

  /**
   * Remove a WebAuthn signer from the smart account
   * 
   * @param credId - the credential id of the signer to remove
   * 
   * @returns the transaction receipt if the removal was successful, otherwise an error message
   */
  async removeWebAuthnSigner(credId: string) { // todo: test
    throw Error('Not implemented');
  }

  /**
   * Recover the smart account in case of loss of the WebAuthn device
   */
  async recover() { // todo: test
    throw Error('Not implemented');
  }





  // general methods

  /**
   * Get the smart account's balance in the native currency
   * 
   * @param humanReadable - whether to return the balance in human readable format or in the smallest unit
   * 
   * @returns the balance of the smart account in the native currency
   */
  async balance(humanReadable = false): Promise<string> {
    if (!this.address) this.address = await getAddress(this.loginData);

    const balance = await provider.getBalance(this.address);

    if (humanReadable) {
      return ethers.utils.formatEther(balance);
    }

    return balance.toString();
  }

  /**
   * Get the smart accounts's balance of a specific token 
   * @remarks
   * this token's contract should at least handle the balanceOf method and
   * should support the decimals method if withDecimals is set to true.
   * Here are the function signatures:
   * - "function balanceOf(address account) public view returns (uint256)",
   * - "function decimals() public view returns (uint8)"
   * 
   * @param targetAddress - the token's contract address
   * @param humanReadable - whether to return the balance in human readable format or in the smallest unit
   * 
   * @returns the balance of the smart account in the token
   */
  async balanceOf(targetAddress: string, humanReadable = false): Promise<string> { // todo: test
    const token = new ethers.Contract(
      targetAddress,
      [
        "function balanceOf(address account) public view returns (uint256)",
        "function decimals() public view returns (uint8)"
      ], provider);

    const balance = await token.balanceOf(this.address ?? await getAddress(this.loginData));

    if (humanReadable) {
      const decimals = await token.decimals();
      return ethers.utils.formatUnits(balance, decimals);
    }

    return balance.toString();
  }

  /**
   * Transfer a specific amount of the native currency to a target address
   * 
   * @param targetAddress - the address to send the amount to
   * @param amount - the amount to send (in the smallest unit of the native currency)
   * 
   * @returns the transaction receipt if the transfer was successful, otherwise an error message
   */
  async transfer(
    targetAddress: string,
    amount: string
  ): Promise<TxResponse> {  // todo: test
    return await this.execute({
      targetAddress,
      value: amount,
      callData: ''
    } satisfies UserOp);
  }

  /**
   * Transfer a specific amount of a specific token to a target address
   * 
   * @remarks
   * this token's contract should at least handle the transfer method. 
   * Here is the expected signature:
   * "function transfer(address to, uint256 amount) public"
   * 
   * @param targetAddress - the token's contract address
   * @param to - the address to send the amount to
   * @param amount - the amount to send (in the smallest unit of the token)
   * 
   * @returns the transaction receipt if the transfer was successful, otherwise an error message
   */
  async transferToken(targetAddress: string, to: string, amount: string): Promise<TxResponse> { // todo: test
    const token = new ethers.Contract(
      targetAddress,
      [
        "function transfer(address to, uint256 amount) public"
      ], provider);

    return await this.execute({
      targetAddress,
      value: '0',
      callData: token.interface.encodeFunctionData('transfer', [to, amount])
    } satisfies UserOp);
  }

  /**
   * Execute the "approve" function of a specific token contract
   * 
   * @remarks
   * this token's contract should at least handle the approve method.
   * Here is the expected signature:
   * "function approve(address spender, uint256 amount) public"
   * 
   * @param targetAddress - the token's contract address
   * @param spender - the address allowed to spend the amount
   * @param amount - the amount to allow the spender to spend (in the smallest unit of the token)
   * 
   * @returns the transaction receipt if the approval was successful, otherwise an error message
   */
  async approve(targetAddress: string, spender: string, amount: string): Promise<TxResponse> { // todo: test
    const token = new ethers.Contract(
      targetAddress,
      [
        "function approve(address spender, uint256 amount) public"
      ], provider);

    return await this.execute({
      targetAddress,
      value: '0',
      callData: token.interface.encodeFunctionData('approve', [spender, amount])
    } satisfies UserOp);
  }

  /**
   * Deploy a smart contract on the blockchain
   * 
   * @param bytecode - the bytecode of the contract to deploy
   * @param value - the amount of the native currency to send with the deployment
   * 
   * @returns the transaction receipt if the deployment was successful, otherwise an error message
   */
  async deploy(bytecode: string, value: string): Promise<TxResponse> { // todo: test
    if (!this.address) this.address = await getAddress(this.loginData);
    const account = new ethers.Contract(
      this.address,
      [
        "function deployContract(bytes memory bytecode) public payable returns (address)"
      ],
      provider
    );

    return await this.execute({
      targetAddress: this.address,
      value,
      callData: account.interface.encodeFunctionData('deployContract', [bytecode])
    } satisfies UserOp);
  }
}














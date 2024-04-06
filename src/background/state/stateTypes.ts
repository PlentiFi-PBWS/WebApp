

// representation of an account in the state
export interface Account {
  // EVM network where the account is deployed. We can deploy multiple accounts on the same network
  address: string, // Address of the account
  privateKey: string | object, // Private key of the account or encrypted account
  name: string, // Name of the account
  data: {
    balances: {
      [tokenAddress: string]: string, // tokenAddress = token Address or native currency ticker and Amount of the token (in the smallest unit), bigint as base10 string
    }
    nonce: number, // Nonce of the account
    txHistory: {
      [txHash: string]: Transaction, // txHash = transaction hash and txData = transaction data
    }
  },
}

export interface Transaction {
  from: string, // Address of the sender
  to: string, // Address of the receiver
  amount: string, // Amount of the transaction (in the smallest unit), bigint as base10 string
  type: string, // Type of the transaction (transfer, approve, ...)
  confirmed: boolean, // True if the transaction is confirmed, false otherwise
}

export type NetworkFamily = 'EVM';

/**
 * Base asset of the network
 * Should be structurally compatible with FungibleAsset
 */
export type NetworkBaseAsset = {
  symbol: string;
  name: string;
  decimals: number;
  contractAddress?: string;
  image?: string;
};

/**
 * Represents a cryptocurrency network; these can potentially be L1 or L2.
 */
export type Network = {
  // two Networks must never share a name.
  name: string;
  baseAsset: NetworkBaseAsset;
  family: NetworkFamily;
  chainID?: string;
  provider: string;
  bundler?: string;
  entryPointAddress: string;
  factoryAddress?: string;
};

/**
 * An EVM-style network which *must* include a chainID.
 */
export type EVMNetwork = Network & {
  chainID: string;
  family: 'EVM';
};


export interface State {
  version: string;
  accounts: {
    current: string, // address of the current account, empty if no account set
    available: { // list of all accounts available
      [chainId: string]: {
        [address: string]: Account, // address of the account and Account
      },
    }
  }
  networks: {
    activeNetwork: EVMNetwork,
    supportedNetworks: {
      [chainId: string]: EVMNetwork,
    }
  };
  signing: string[]; // list of messages and transactions waiting to be signed. Maybe the type string[] is not the best option. we'll see
  transactions: {
    [txHash: string]: Transaction, // unconfirmed transactions or transactions waiting to be confirmed/batched
  }
}

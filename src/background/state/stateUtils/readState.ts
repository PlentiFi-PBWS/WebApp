import { EVMNetwork, State, StateManager } from "../.";
import { Account, Transaction } from "../stateTypes";

/**
 * Get the current account
 * 
 * @param state - the state (optional, if net set, it will use the current one)
 * @returns { string } - the current account
 */
export function getCurrentAccount(state?: State): Account | undefined {
  if (state && !state.accounts.current) return undefined;
  console.log("1");
  if (!state && !(new StateManager()).getState().accounts.current) return undefined;

  const state_ = state ? state : (new StateManager()).getState();
  const address = state_.accounts.current;
  console.log("address from get current account", address);
  const networkId = getNetworks(state).activeNetwork.chainID;
  console.log("network id from get current account", networkId);
  return state_.accounts.available[networkId][address];
}

/**
 * Get all accounts from state
 * 
 * @param state - the state (optional, if net set, it will use the current one)
 * @returns { [chainId: string]: { [address: string]: Account } } - all accounts
 */
export function getAllAccounts(state?: State): {
  [chainId: string]: {
    [address: string]: Account
  }
} {
  if (state) return state.accounts.available;

  return (new StateManager()).getState().accounts.available;
}

/**
 * Get all the accounts with the wanted chainId and/or name
 * 
 * @param chainId - the chainId of the accounts
 * @param name - the name of the accounts
 * @param state - the state (optional, if net set, it will use the current one)
 * 
 * @returns { Account[] } - the accounts with the wanted chainId and/or name (if no chainId or name is set, it will return an empty array)
 */
export function getAccounts(chainId?: string, name?: string, state?: State): Account[] {
  if (!chainId && !name) return [];

  if (!state) state = (new StateManager()).getState();

  const accounts = getAllAccounts();

  let out: Account[] = [];

  for (const chain in accounts) {
    if (chainId && chain !== chainId) continue;

    for (const address in accounts[chain]) {
      if (name && accounts[chain][address].name !== name) continue;

      out.push(accounts[chain][address]);
    }
  }

  return out;
}

/**
 * Get the networks information from state
 * 
 * @param state - the state (optional, if net set, it will use the current one)
 * @returns { EVMNetwork } - the networks information
 */
export function getNetworks(state?: State): {
  activeNetwork: EVMNetwork,
  supportedNetworks: {
    [chainId: string]: EVMNetwork,
  }
} {
  if (state) return state.networks;

  return (new StateManager()).getState().networks;
}

/**
 * Get the state version
 * 
 * @param state - the state (optional, if net set, it will use the current one)
 * @returns { string } - the state version
 */
export function getStateVersion(state?: State): string {
  if (state) return state.version;

  return (new StateManager()).getState().version;
}

/**
 * Get the pending signatures requests from state
 * 
 * @param state - the state (optional, if net set, it will use the current one)
 * @returns { string[] } - the pending signatures requests
 */
export function getDataToSign(state?: State): string[] {
  if (state) return state.signing;

  return (new StateManager()).getState().signing;
}

/**
 * Get the unconfirmed transactions from state
 * 
 * @param state - the state (optional, if net set, it will use the current one)
 * @returns { { [txHash: string]: Transaction } } - the transactions
 */
export function getUnconfirmedTransactions(state?: State): {
  [txHash: string]: Transaction
} {
  if (state) return state.transactions;

  return (new StateManager()).getState().transactions;
}


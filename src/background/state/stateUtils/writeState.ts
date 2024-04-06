import { State, StateManager } from "..";
import { Account, EVMNetwork } from "../stateTypes";

/* ----------------------------ACCOUNT MANAGEMENT---------------------------- */
/**
 * Adds an account to the state if it doesn't already exist.
 * If the account already exists, does nothing.
 * If there are no account, sets the account as the current account
 * 
 * @param state 
 * @param account 
 * @param chainId 
 * @returns 
 */
export function addAccountToState(account: Account, chainId: string, state?: State): State {
  if(!state) state = (new StateManager()).getState();
  if (!state.accounts.available[chainId]) {
    state.accounts.available[chainId] = {};
  }
  console.log("2");
  if (!state.accounts.available[chainId][account.address]) {
    state.accounts.available[chainId][account.address] = account;
    console.log("3: ", state.accounts.current);
    if (!state.accounts.current) {
      console.log("setting current account to", account.address);
      state.accounts.current = account.address;
    }

    (new StateManager()).updateState(state);
  }

  return state;
}

/**
 * Update and account in the state. Add it if it doesn't exist
 * if there are no accounts, sets the updated account as the current account
 */
export function updateAccountInState(state: State, account: Account, chainId: string): State {
  if (!state.accounts.available[chainId]) {
    state.accounts.available[chainId] = {};
  }

  state.accounts.available[chainId][account.address] = account;

  if (!state.accounts.current) {
    console.log("Setting current account to", account.address);
    state.accounts.current = account.address;
  }

  (new StateManager()).updateState(state);

  return state;
}

/**
 * Remove an account from the state
 * Does nothing if the account doesn't exist
 * 
 * @param state - the state
 * @param account - the account to remove or its address
 * @param chainId - the chainId of the account
 * 
 * @returns { State } - the updated state
 */
export function removeAccountFromState(state: State, account: Account | string, chainId: string): State {

  let address = '';

  if (typeof account === 'string') {
    address = account;
  } else {
    address = account.address;
  }

  if (state.accounts.available[chainId] && state.accounts.available[chainId][address]) {
    delete state.accounts.available[chainId][address];

    (new StateManager()).updateState(state);
  }

  return state;
}

/* ----------------------------NETWORK MANAGEMENT---------------------------- */

/**
 * Add a network to the state
 * If the network already exists, does nothing
 */
export function addNetworkToState(state: State, network: EVMNetwork): State {
  if (!state.networks.supportedNetworks[network.chainID]) {
    state.networks.supportedNetworks[network.chainID] = network;

    (new StateManager()).updateState(state);
  }

  return state;
}

/**
 * Update a network in the state
 * If the network doesn't exist, adds it
 */
export function updateNetworkInState(state: State, network: EVMNetwork): State {
  state.networks.supportedNetworks[network.chainID] = network;

  (new StateManager()).updateState(state);

  return state;
}

/**
 * Remove a network from the state
 * Does nothing if the network doesn't exist
 * 
 * @param state - the state
 * @param network - the network to remove or its chainId
 * 
 * @returns { State } - the updated state
 */
export function removeNetworkFromState(state: State, network: EVMNetwork | string): State {

  let id = '';

  if (typeof network === 'string') {
    id = network;
  } else {
    id = network.chainID;
  }

  if (state.networks.supportedNetworks[id]) {
    delete state.networks.supportedNetworks[id];

    (new StateManager()).updateState(state);
  }

  return state;
}
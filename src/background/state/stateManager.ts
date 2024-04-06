
import { sepolia } from './initialState';
import { LATEST_STATE_VERSION, UPDATE_STATE } from './stateConstants';
import { State } from './stateTypes';



/* state manager: contains the state of the application, automatically:
- saves changes to localStorage
- loads from localStorage on initialization
- provides a way to subscribe to state changes
- provides a way to unsubscribe from state changes
- auto update when receives a 'state-update' event
*/
export class StateManager {
  state: State;
  subscribers: Function[];

  constructor(state?: State) {
    this.state = state ? state : this.loadState();
    this.subscribers = [];
  }

  loadState(): State {
    const state = localStorage.getItem('state');
    if (state) {
      return JSON.parse(state) as State;
    }
    // if no state is found, return the initial state
    return {
      version: LATEST_STATE_VERSION,
      accounts: {
        current: "", // address of the current account, empty if no account set
        available: {} // list of all accounts available
      },
      networks: {
        activeNetwork: sepolia,
        supportedNetworks: {
          [sepolia.chainID]: sepolia,
        }
      },
      signing: [], // list of messages and transactions waiting to be signed. Maybe the type string[] is not the best option. we'll see
      transactions: {},
    } satisfies State;
  }

  /**
   * Save the state to localStorage
   * 
   * @remarks
   * If the current account is not deployed on the active network, it will set the current network to on matching the current account. 
   * If there are no known networks matching the current account's network, it will set the current account to empty.
   */
  private saveState() {

    // if the current account is not deployed on the active network, set the current network to on matching the current account
    if (this.state.accounts.current && !this.state.accounts.available[this.state.networks.activeNetwork.chainID]) {
      const networks = this.state.networks.supportedNetworks;
      for (const chainId in networks) {
        if (this.state.accounts.available[chainId] && this.state.accounts.available[chainId][this.state.accounts.current]) {
          this.state.networks.activeNetwork = networks[chainId];
          break;
        }
      }
    }

    // if there are no known networks matching the current account's network, set the current account to empty
    if (this.state.accounts.current && !this.state.accounts.available[this.state.networks.activeNetwork.chainID]) {
      this.state.accounts.current = '';
    }

    localStorage.setItem('state', JSON.stringify(this.state));
    window.dispatchEvent(new CustomEvent(UPDATE_STATE, { detail: this.state }));
    this.subscribers.forEach((s) => s(this.state));
  }

  /**
   * Update the state
   */
  updateState(changes: State): void {
    this.state = changes;
    this.saveState();
  }

  /**
   * Subscribe to state changes.
   * When there is a state change, each subscribed function will be called
   * 
   * @param callback - the function to call when the state changes 
   */
  subscribe(callback: Function) {
    this.subscribers.push(callback);
  }

  unsubscribe(callback: Function) {
    this.subscribers = this.subscribers.filter((s) => s !== callback);
  }

  getState(): State {
    return this.state;
  }

}

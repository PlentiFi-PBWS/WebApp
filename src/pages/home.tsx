import React, { useEffect } from 'react';
import '../App.css';
import Sidebar from '../components/Sidebar';
import CryptoBalance from '../components/Wallet-balance';
import Navbar from '../components/Navbar/Navbar';
import TabNavigation from '../components/tab/TabNavigation';
import {
  StateManager,
} from '../background/state';
import { State } from '../background/state/stateTypes';
import { LOGIN_KEY, SMART_ACCOUNT_KEY, XRPL_SMART_ACCOUNT_KEY } from '../constants';
import Popup from 'reactjs-popup';
import ControlledPopup from '../components/popup/Popup';
import TransitionsSnackbar from '../components/snackbar/Snackbar';
import AssetDisplay from '../components/listAsset/AssetDisplay';
import { xrplTx } from '../background/xrplSdk';


async function testTx() {
  console.log("test tx ...");
  const multisigAddress = localStorage.getItem(XRPL_SMART_ACCOUNT_KEY);
  const login = localStorage.getItem(LOGIN_KEY),
    password = 'passwordd'; // todo
  if (!multisigAddress || !login || !password) throw Error('No multisig address found');
  console.log("multisig address: ", multisigAddress);
  const txHash = await xrplTx(login, password, multisigAddress, 'rfWXxBzVobVFNYZumxgnrnzbqoAsstwUEU', '10000000');
  console.log("tx hash: ", txHash);
}

function Home() {

  const [state, setState] = React.useState<State | undefined>(undefined);
  const [stateManager, setStateManager] = React.useState<StateManager | undefined>(undefined);
  const [userAddress, setUserAddress] = React.useState<string | undefined>(undefined);

  useEffect(() => {
    console.log("local xrpl address: ", localStorage.getItem(XRPL_SMART_ACCOUNT_KEY));
    if (!stateManager) {
      setStateManager(new StateManager());
    }
  }, []);

  useEffect(() => {
    setUserAddress(userAddress ?? '');
    
  }, []);

  // const addresses = localStorage.getItem(SMART_ACCOUNT_KEY)? [localStorage.getItem(SMART_ACCOUNT_KEY)!].concat(localStorage.getItem(XRPL_SMART_ACCOUNT_KEY) ? [localStorage.getItem(XRPL_SMART_ACCOUNT_KEY)]: []): [];
  const addresses = localStorage.getItem(SMART_ACCOUNT_KEY)
    ? [localStorage.getItem(SMART_ACCOUNT_KEY)!]
      .concat(localStorage.getItem(XRPL_SMART_ACCOUNT_KEY) ? [localStorage.getItem(XRPL_SMART_ACCOUNT_KEY)!] : [])
      .filter((address) => address !== null) // Filter out null values
    : [];
  return (
    <div className="App">
      <Sidebar address={addresses.length>0 ? addresses[0] + "|" + addresses[1]: "no address registered"} name='PlentiFi'/>
      <Navbar address={addresses.length>0 ? addresses[0]: "no address registered"} name='testt'/>
      <CryptoBalance addresses={[addresses.length>0 ? addresses[0] + "|" + addresses[1]: "no address registered"]} />
      <TabNavigation/>
      <div className='assets'>
        <AssetDisplay />
      </div>
      <ControlledPopup title='This is a popup' content={'frbjfrbffr'} />
      <TransitionsSnackbar />
      <button onClick={testTx}>yo</button>
    </div>
  );
}

export default Home;

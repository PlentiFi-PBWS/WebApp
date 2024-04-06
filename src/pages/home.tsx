import React, { useEffect } from 'react';
import '../App.css';
import Sidebar from '../components/Sidebar';
import CryptoBalance from '../components/Wallet-balance';
import Navbar from '../components/Navbar/Navbar';
import TabNavigation from'../components/tab/TabNavigation';
import {
  StateManager,
} from '../background/state';
import { State } from '../background/state/stateTypes';
import { SMART_ACCOUNT_KEY, XRPL_SMART_ACCOUNT_KEY } from '../constants';
import Popup from 'reactjs-popup';
import ControlledPopup from '../components/popup/Popup';
import TransitionsSnackbar from '../components/snackbar/Snackbar';


function Home() {

  const [state, setState] = React.useState<State | undefined>(undefined);
  const [stateManager, setStateManager] = React.useState<StateManager | undefined>(undefined);
  const [userAddress, setUserAddress] = React.useState<string | undefined>(undefined);

  useEffect(() => {
    if (!stateManager) {
      setStateManager(new StateManager());
    }
  }, []);

  useEffect(() => {
    setUserAddress(userAddress?? '');
  }, []);
  
  const addresses = localStorage.getItem(SMART_ACCOUNT_KEY)? [localStorage.getItem(SMART_ACCOUNT_KEY)!, localStorage.getItem(XRPL_SMART_ACCOUNT_KEY)!]: [];
  return (
    <div className="App">
      <Sidebar address={addresses.length>1 ? addresses[0] + "|" + addresses[1]: "no address registered"} name='PlentiFi'/>
      <Navbar address={addresses.length>0 ? addresses[0]: "no address registered"} name='testt'/>
      <CryptoBalance addresses={addresses} />
      <TabNavigation/>
      <ControlledPopup title='ee' content={'frbjfrbffr'}/>
      <TransitionsSnackbar/>
   </div>
  );
}

export default Home;

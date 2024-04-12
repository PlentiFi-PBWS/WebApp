import React, { useEffect, useState } from "react";
import "../App.css";
import Sidebar from "../components/Sidebar";
import CryptoBalance from "../components/Wallet-balance";
import Navbar from "../components/Navbar/Navbar";
import TabNavigation from "../components/tab/TabNavigation";
import { StateManager } from "../background/state";
import { State } from "../background/state/stateTypes";
import {
  LOGIN_DATA_KEY,
  SMART_ACCOUNT_KEY,
} from "../constants";
import AssetDisplay from "../components/listAsset/AssetDisplay";


function Home() {
  const [state, setState] = React.useState<State | undefined>(undefined);
  const [stateManager, setStateManager] = React.useState<
    StateManager | undefined
  >(undefined);
  const [userAddress, setUserAddress] = React.useState<string | undefined>(
    undefined
  );
  const [txUrl, setTxUrl] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    console.log("all local storage: \n", localStorage);
    if (!stateManager) {
      setStateManager(new StateManager());
    }
  }, []);

  useEffect(() => {
    setUserAddress(userAddress ?? "");
  }, []);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const address = localStorage.getItem(SMART_ACCOUNT_KEY); // todo: handle multiple addresses

  return (
    <div className={`App ${isPopupOpen ? "blur-effect" : ""}`}>
      <Sidebar
        address={address ?? "no address registered"}
        name="PlentiFi"
      />
      <Navbar
        address={address ?? "no address registered"}
        name="testt"
      />
      <CryptoBalance
        address={address ?? "no address registered"}
      />
      <TabNavigation />
      <div className="assets">
        <AssetDisplay />
      </div>
      {/* <ControlledPopup title="This is a popup" content={"frbjfrbffr"} /> */}
      {/* <button onClick={handleTestTx}>Test Transaction</button>
      <TransitionsSnackbar
        data={
          txUrl && (
            <a href={txUrl} target="_blank" rel="noopener noreferrer">
              View Transaction on Explorer
            </a>
          )
        }
      />
      <button onClick={testTx}>yo</button> */}
    </div>
  );
}

export default Home;

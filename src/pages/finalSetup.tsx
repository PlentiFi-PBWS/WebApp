import React, { useState, useEffect } from "react";
import "../styles/finalSetup.scss"; // make sure to create a corresponding CSS file
import { useNavigate } from "react-router-dom";
import logo from "../assets/icons/plentifi.png";
import creditCardLogo from "../assets/icons/credit-card.svg"; // replace with actual path to credit card logo
import binanceLogo from "../assets/icons/binance.png"; // replace with actual path to Binance logo
import coinbaseLogo from "../assets/icons/coinbase.png"; // replace with actual path to Coinbase logo
import { getAddress } from "../background/aa-sdk";
import { ENTROPY, LOGIN_KEY, XRPL_SMART_ACCOUNT_KEY } from "../constants";

function Setup() {
  let navigate = useNavigate();
  const [addy, setAddy] = useState("");
  const [xrplAddress, setXrplAddress] = useState(""); // add this line

  const routeChange = () => {
    navigate("/Home");
  };

  useEffect(() => {
    async function fetchAddress() {
      try {
        console.log("local storage: ", localStorage);
        console.log("login key: ", localStorage.getItem(LOGIN_KEY));

        const address = await getAddress(localStorage.getItem(LOGIN_KEY)!, ENTROPY);
        const xrplAddr = localStorage.getItem(XRPL_SMART_ACCOUNT_KEY);

        console.log("xrpl Address: ", xrplAddr);
        setAddy(address);
        setXrplAddress(xrplAddr || "No XRPL address found");
      } catch (error) {
        console.error("Failed to fetch address:", error);
        // Handle error appropriately
      }
    }
    fetchAddress();
  }, []);

  return (
    <div className="full-page-container">
      <div className="content">
        <img src={logo} alt="Logo" className="logo" />
        <p className="sub-message">Your account is ready.</p>
        <p className="sub-message">Here is your personal addresses:</p>
        <p className="sub-message">XRPL:</p>
        <p className="addy">{xrplAddress}</p>
        <p className="sub-message">EVM:</p>
        <p className="addy">{addy}</p>
        <h3 className="main-message">Fund your wallet</h3>
        <p className="sub-message">with your favorite platform</p>
        <div className="logo-row">
          <img
            src={creditCardLogo}
            alt="Credit Card"
            className="payment-logo"
          />
          <img src={binanceLogo} alt="Binance" className="payment-logo" />
          <img src={coinbaseLogo} alt="Coinbase" className="payment-logo" />
        </div>
        <button className="subscribe-button" onClick={routeChange}>
          Let's explore PlentiFi
        </button>
      </div>
    </div>
  );
}

export default Setup;

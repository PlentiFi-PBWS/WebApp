import React, { useEffect } from 'react';
import '../styles/landing-page.scss'; // make sure to create a corresponding CSS file
import { useNavigate } from 'react-router-dom';
import logo from '../assets/icons/plentifi.png';
import Popup from 'reactjs-popup';

function Lp() {

  useEffect(() => {
    // clear local storage
    localStorage.clear();
    console.log('cleared local storage');
  }
  , []);

  let navigate = useNavigate();
  const routeChange = () => {
    let path = `newPath`;
    navigate("/Form");

  }
  return (
    <div className="full-page-container">
      <div className="content">
        <img src={logo} alt="Logo" className="logo" />
        <h1 className="main-message">Welcome to PlentiFi</h1>
        <p className="sub-message">PlentiFi wallet is an all-in-one, non-custodial application designed for users interested in buying and exchanging a variety of tokenized assets including cryptocurrencies, stocks, and raw materials.</p>
        <p className="sub-message">The platform operates entirely on-chain, ensuring that every transaction is irreversible. Due to its non-custodial nature, <strong>PlentiFi emphasizes the importance of personal responsibility for asset security, as it cannot assist in retrieving funds if they are lost.</strong></p>
        <button className="subscribe-button" onClick={routeChange} >Let's Start</button>
      </div>
    </div>

  );
}

export default Lp;
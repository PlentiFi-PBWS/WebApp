import React, { useEffect, useState } from 'react';
import { IoIosShareAlt, IoIosSend, IoMdCopy } from "react-icons/io";
import './Wallet-balance.scss'; // Ensure this is the correct path to your styles
import { AVAILABLE_TOKENS, LOGIN_DATA_KEY, SMART_ACCOUNT_KEY } from '../constants';
// Importing the WebP image
import myWebPImage from "../images/pdp.png";
import { ethers } from 'ethers';
import { provider, SmartAccount } from '../background/smartAccountSdk';


type Props = {
  address: string;
};

const CryptoBalance = (props: Props) => {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
    // return address;
  };

  // Initialize selectedAddress with the formatted address
  const [selectedAddress, setSelectedAddress] = useState(
    props.address ?? "no address registered"
  );

  const onCopyToClipboard = (text: string) => {
    // typescript don't recognize clipboard as a navigator method :/
    (navigator as any).clipboard.writeText(text)
  }

  /////////////////////////////////////////
  const [sum, setSum] = useState(new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(0));

  useEffect(() => {
    // Define the function that fetches assets
    const fetchAssets = async () => {
      const assetOwner = localStorage.getItem(SMART_ACCOUNT_KEY);

      if (!assetOwner) {
        console.log("Asset owner not set");
        return;
      }
      const assetsData = await Promise.all(AVAILABLE_TOKENS.map(async (tokenData) => {
        const token = new ethers.Contract(tokenData.address, ["function balanceOf(address account) public view returns (uint256)"], provider);
        const balance = await token.balanceOf(assetOwner);
        const amount = ethers.utils.formatUnits(balance, tokenData.decimals);
        // console.log("Amount: ", amount);
        return {
          price: tokenData.price,
          amount: amount,
        };
      }));
      const total = assetsData.map((assetData) => {
        return parseFloat(assetData.price) * parseFloat(assetData.amount);
      }).reduce((a, b) => a + b, 0);

      setSum(new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(total));
    };

    // Call fetchAssets immediately to populate data on component mount
    fetchAssets();

    // Set up an interval to update assets every 5 seconds
    const intervalId = setInterval(fetchAssets, 5000);

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // The empty dependency array ensures this setup is run only once on mount

  // Check if addresses is an array and has more than one address
  const isMultiple = false; // Array.isArray(props.addresses) && props.addresses.length > 1;

  ///////////////////////////////////////////////////

  const addSigner = async () => {

    const loginData = JSON.parse(localStorage.getItem(LOGIN_DATA_KEY) ?? "{}");

    const smartAccount = await SmartAccount.new(loginData);

    const credId = "0x123456789",
      pubKey = ["0x123456789a", "0x123456789b"] as [string, string];

      console.log("addsigner: ", smartAccount.addWebAuthnSigner(credId, pubKey));
  }

  /////////////////////////////////////////////


  return (
    <div className="crypto-balance">
      <div className="crypto-info">
        <img src={myWebPImage} alt="Crypto Icon" className="crypto-icon" />
      </div>
      <div className="balance-info">
        {isMultiple ? (
          <div className="address-container">
            {/* <select className="address-dropdown" value={selectedAddress} onChange={handleAddressChange}>
              {props.addresses.map((addr, index) => (
                <option key={index} value={addr}>
                  {formatAddress(addr)}
                </option>
              ))}
            </select> */}
            <IoMdCopy className="copy-iconn" onClick={() => onCopyToClipboard(selectedAddress)} />
          </div>
        ) : (
          <div className="address">{
            JSON.parse(localStorage.getItem(LOGIN_DATA_KEY) ?? "{}")?.login
            ?? 'No Account set'
          } <IoMdCopy className="icon" onClick={() => onCopyToClipboard(props.address)} /></div>
        )}
        <div className="balance">{sum}</div>
        <div>{"todo: get native balance"} ETH</div>
        <div className={`change ${1 >= 0 ? 'positive' : 'negative'}`}>
        </div>
      </div>
      <div className="actions">
        <button className="action-button"><IoIosShareAlt /></button>
        <button className="action-button"><IoIosSend /></button>
      </div>
        

        <button className="action-button" onClick={addSigner}>Add Signer</button>
    </div>
  );
};

export default CryptoBalance;

import React, { useEffect, useState } from 'react';
import { IoIosShareAlt, IoIosSend, IoMdCopy } from "react-icons/io";
import './Wallet-balance.scss'; // Ensure this is the correct path to your styles
import { AVAILABLE_TOKENS, LOGIN_KEY, SMART_ACCOUNT_KEY } from '../constants';
// Importing the WebP image
import myWebPImage from "../images/pdp.png";
import { get } from 'http';


type Props = {
  addresses: string[];
};

const CryptoBalance = (props: Props) => {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
    // return address;
  };

  // Initialize selectedAddress with the formatted address
  const [selectedAddress, setSelectedAddress] = useState(
    props.addresses && props.addresses.length > 0
      ? formatAddress(props.addresses[0])
      : ''
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
        const balance = "0"; // todo: get token balance
        // console.log("Amount: ", amount);
        return {
          price: tokenData.price,
          amount: balance,
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


  /////////////////////////////////////////////////

  // Function to handle address selection from the dropdown
  const handleAddressChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAddress((event.target.value));
  };

  // Check if addresses is an array and has more than one address
  const isMultiple = Array.isArray(props.addresses) && props.addresses.length > 1;

  return (
    <div className="crypto-balance">
      <div className="crypto-info">
        <img src={myWebPImage} alt="Crypto Icon" className="crypto-icon" />
      </div>
      <div className="balance-info">
        {isMultiple ? (
          <div className="address-container">
            <select className="address-dropdown" value={selectedAddress} onChange={handleAddressChange}>
              {props.addresses.map((addr, index) => (
                <option key={index} value={addr}>
                  {formatAddress(addr)}
                </option>
              ))}
            </select>
            <IoMdCopy className="copy-iconn" onClick={() => onCopyToClipboard(selectedAddress)} />
          </div>
        ) : (
          <div className="address">{localStorage.getItem(LOGIN_KEY) ?? 'No Account set'} <IoMdCopy className="icon" onClick={() => onCopyToClipboard(props.addresses[0])} /></div>
        )}
        <div className="balance">{sum}</div>
        <div className={`change ${1 >= 0 ? 'positive' : 'negative'}`}>
        </div>
      </div>
      <div className="actions">
        <button className="action-button"><IoIosShareAlt /></button>
        <button className="action-button"><IoIosSend /></button>
      </div>
    </div>
  );
};

export default CryptoBalance;

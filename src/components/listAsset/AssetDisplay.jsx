import { useState, useEffect } from 'react';
import DynamicTable from './DynamicTable';
import './AssetDisplay.scss';
import { AVAILABLE_TOKENS, SMART_ACCOUNT_KEY } from '../../constants';


const AssetDisplay = () => {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    // Define the function that fetches assets
    const fetchAssets = async () => {
      const assetOwner = localStorage.getItem(SMART_ACCOUNT_KEY);
      if(!assetOwner) {
        console.log("Asset owner not set");
        return;
      }
      const assetsData = await Promise.all(AVAILABLE_TOKENS.map(async (tokenData) => {
        const balance = "0"; // todo: get token balance
        // console.log("Amount: ", amount);
        return {
          name: tokenData.name,
          ticker: tokenData.ticker,
          price: tokenData.price,
          amount: balance,
          decimals: tokenData.decimals
        };
      }));

      setAssets(assetsData);
      console.log("Assets updated");
    };

    // Call fetchAssets immediately to populate data on component mount
    fetchAssets();

    // Set up an interval to update assets every 5 seconds
    const intervalId = setInterval(fetchAssets, 5000);

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // The empty dependency array ensures this setup is run only once on mount

  return (
    <div>
      <h3 className='title'>Assets</h3>
      <div className='assetbox'>
        <DynamicTable assets={assets} />
      </div>
    </div>
  );
};

export default AssetDisplay;

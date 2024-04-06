
import React, { useEffect, useState } from 'react';
// import FavDynamicTable from './FavDynamicTable'; 
import './AssetDisplay.scss';
import { AVAILABLE_TOKENS, SMART_ACCOUNT_KEY } from '../../constants';
import DynamicTable from '../listAsset/DynamicTable';

const FavAssetDisplay = () => {
  const [assets, setAssets] = useState<any[]>([]);

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


      setAssets(
        // sort the available tokens by amount * price from highest to lowest and take the top 4
        assetsData.sort((a, b) => (parseFloat(b.amount) * parseFloat(b.price)) - (parseFloat(a.amount) * parseFloat(a.price))).slice(0, 4)
        );
      console.log("Assets updated");
    };

    // Call fetchAssets immediately to populate data on component mount
    fetchAssets();

    // Set up an interval to update assets every 5 seconds
    const intervalId = setInterval(fetchAssets, 5000);

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // The empty dependency array ensures this setup is run only once on mount
  

  // sort the available tokens by 
  // const assets = .sort

  return ( 
    <div>
      <h4 className='title'>Favorite Assets</h4>
      <div className='assetbox'>
        <DynamicTable assets={assets} />
      </div>
    </div>
  );
}

export default FavAssetDisplay;

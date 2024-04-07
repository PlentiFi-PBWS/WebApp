import { useState, useEffect } from 'react';
import DynamicTable from './DynamicTable';
import './AssetDisplay.scss';
import { provider } from '../../background/aa-sdk/sdk';
import { ethers } from 'ethers';
import { AVAILABLE_TOKENS, SMART_ACCOUNT_KEY, XRPL_SMART_ACCOUNT_KEY } from '../../constants';
import { getTotalXrpBalance, getWHTBalance } from '../../background/xrplSdk';


const AssetDisplay = () => {
  const [assets, setAssets] = useState<{
    name: string,
    ticker: string,
    price: string,
    amount: string,
    decimals: number
  }[]>([]);

  useEffect(() => {
    // Define the function that fetches assets
    const fetchAssets = async () => {
      const assetOwner = localStorage.getItem(SMART_ACCOUNT_KEY);

      // console.log("Asset owner: ", assetOwner);
      if(!assetOwner) {
        console.log("Asset owner not set");
        return;
      }
      const assetsData = await Promise.all(AVAILABLE_TOKENS.map(async (tokenData) => {
        const token = new ethers.Contract(tokenData.address, ["function balanceOf(address account) public view returns (uint256)"], provider);
        const balance = await token.balanceOf(assetOwner);
        const amount = ethers.utils.formatUnits(balance, tokenData.decimals);
        // console.log("Amount: ", amount);
        return {
          name: tokenData.name,
          ticker: tokenData.ticker,
          price: tokenData.price,
          amount: amount,
          decimals: tokenData.decimals
        };
      }));

       // add XRP and WHT to the list of assets
       console.log("XRPL_SMART_ACCOUNT_KEY: ", localStorage.getItem(XRPL_SMART_ACCOUNT_KEY));
       console.log("assetOwner: ", assetOwner);
       const xrpBalance = await getTotalXrpBalance(localStorage.getItem(XRPL_SMART_ACCOUNT_KEY)!, assetOwner);
 
       assetsData.push({
         name: "XRP",
         ticker: "XRP",
         price: "0.89",
         amount: xrpBalance,
         decimals: 6
       });
 
       const whtBalance = await getWHTBalance(localStorage.getItem(XRPL_SMART_ACCOUNT_KEY)!);
 
       assetsData.push({
         name: "WHEAT",
         ticker: "WHT",
         price: "73",
         amount: whtBalance,
         decimals: 6
       });
 

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

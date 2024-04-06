import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import { CryptoChart } from "../components/TokenChart/index";
import Card from "../components/TokenInfos/Cards";
import SwapComponent from "../components/swap/Swap";
import { FaStar, FaRegStar } from "react-icons/fa";
import bitcoinIcon from "../assets/icons/Bitcoin.png";
import "../styles/invest.scss";
import Sidebar from "../components/Sidebar";
import Swap from "../components/swap/Swap";
import { useParams } from "react-router-dom";
import FavAssetDisplay from "../components/listFavAsset/FavAssetDisplay";
import { AVAILABLE_TOKENS } from "../constants";
import AssetCard from "../components/AssetCards/AssetCards";

// const mySwapFunction = (fromAmount, fromCurrency, toAmount, toCurrency) => {
//   // logique pour swap
// };

const mySwapFunction = () => {};

const Invest = () => {
  // State to track if the star is favorited
  const [isFavorited, setIsFavorited] = useState(false);

  const { asset } = useParams(); // Assuming your route parameter is named 'asset'

  // Find the asset data based on the URL parameter
  const selectedAsset = AVAILABLE_TOKENS.find(
    (token) => token.ticker === asset
  );

  const trendDirectionn = selectedAsset?.chart?.trendDirection;

  // Check if trendDirectionn is one of the expected values, if not, default to 0
  const validTrendDirection: 0 | 1 | -1 =
    trendDirectionn === 0 || trendDirectionn === 1 || trendDirectionn === -1
      ? trendDirectionn
      : 0;
  // If the asset is not found, you could redirect or show an error message
  // For simplicity, this example will just return null

  // Function to toggle the favorite state
  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  const defaultView = (
    <div className="default-view">
      <h2>Welcome to the Investment Page</h2>
      <p>Select an asset to get started</p>
      <div className="asset-cards-container">
            {AVAILABLE_TOKENS.map((asset) => (
              <AssetCard key={asset.ticker} asset={asset} />
            ))}
          </div>
    </div>
  );

  if (!selectedAsset) {
    // Render the default view if no specific asset is selected
    return (
      <div>
        <Sidebar address="Qn4H232123212132123212" name="Test" />
        <Navbar address="Qn4H232123212132123212" name="Test" />
        <div className="containerd">
          {defaultView}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Sidebar address="Qn4H232123212132123212" name="Test" />
      <Navbar address="Qn4H232123212132123212" name="Test" />
      <div className="containerd">
        <div className="tokenName">
          <h2 className="titleToken">{selectedAsset.name}</h2>
          <h2 className="priceToken">${selectedAsset.price}</h2>
          <span
            className="star"
            onClick={toggleFavorite}
            style={{
              cursor: "pointer",
              color: isFavorited ? "orange" : "grey",
            }}
          >
            {isFavorited ? <FaStar /> : <FaRegStar />}
          </span>
        </div>
        <div className="tokenInfos">
          <Card cardTitle="Value" value={`$${selectedAsset.price}`} />
          <Card cardTitle="Market Cap" value={`$${selectedAsset.marketCap}`} />
          <Card cardTitle="Liquidity" value={`$${selectedAsset.liquidity}`} />
        </div>
        <div className="middle-part">
          <div className="tokenChart">
            <CryptoChart
              currencyName={`$${selectedAsset.chart?.currencyName}`}
              currencyPrice={`$${selectedAsset.chart?.currencyPrice}`}
              icon={<img src={bitcoinIcon} alt="Bitcoin" />}
              currencyShortName={`$${selectedAsset.chart?.currencyShortName}`}
              trend={`$${selectedAsset.chart?.trend}`}
              trendDirection={validTrendDirection}
              chartData={selectedAsset.chart?.chartData ?? []}
            />
          </div>
          <div className="infos-section">
            <div className="infos">
              <h2>Infos</h2>
              <p>{selectedAsset.description}</p>
            </div>
          </div>
        </div>
        <div className="end-part">
          <div className="swap-section">
            <SwapComponent onSwap={mySwapFunction} />
          </div>
          <FavAssetDisplay />
        </div>
      </div>
    </div>
  );
};

export default Invest;

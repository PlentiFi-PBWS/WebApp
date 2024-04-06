import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AssetCards.scss';

const AssetCard = ({ asset }: { asset: any }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/invest/${asset.ticker}`);
  };

  return (
    <div className="asset-card" onClick={handleCardClick}>
      <h3>{asset.ticker}</h3>
      <h4>{asset.price}$</h4>
      <p>{asset.description}</p>
      {/* Include other asset information you want to display */}
    </div>
  );
};

export default AssetCard;

import { CryptoCard } from 'react-ui-cards';
// import React from 'react';
// import bitcoinIcon from '../../assets/icons/Bitcoin.png';
// import ethereum_logo from '../../assets/icons/ethereum_logo.png';
import jeton from '../../assets/icons/jeton.png';
import './tokenChart.scss'; 

export const CryptoChart = () => <CryptoCard
    currencyName={"Portfolio"}
    currencyPrice={""}
    icon={<img src={jeton} alt="Bitcoin" />}
    currencyShortName={""}
    trend={"+9%"}
    trendDirection={1}
    chartData={[2, 19, 27, 40, 18, 32, 12, 72, 32, 22, 92, 52]}
    
/>
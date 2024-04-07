import { CryptoCard } from 'react-ui-cards';
import React from 'react';
import bitcoinIcon from '../../assets/icons/Bitcoin.png';
import { AVAILABLE_TOKENS } from '../../constants';
import './tokenChart.scss'; // Assume your CSS styles are here

type Props = {
    currencyName: string;
    currencyPrice: string;
    icon: JSX.Element;
    currencyShortName: string;
    trend: string;
    trendDirection:  0 | 1 | -1;
    chartData: number[];
  };

export const CryptoChart = (props: Props) => 

    <CryptoCard
    currencyName={props.currencyName}
    currencyPrice={props.currencyPrice}
    icon={<p></p>}
    currencyShortName={props.currencyShortName}
    trend={props.trend}
    trendDirection={props.trendDirection}
    chartData={props.chartData}
    
/>
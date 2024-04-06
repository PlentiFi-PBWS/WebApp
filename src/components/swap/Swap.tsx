import React, { useEffect, useState } from 'react';
import './SwapComponent.scss';
import { swap } from '../../background/txSetup';
import { AMM_CONTRACT, AVAILABLE_TOKENS, LOGIN_KEY, SMART_ACCOUNT_KEY } from '../../constants';
import { useParams } from 'react-router-dom';
import { log } from 'console';
import { formatNumber } from '../../utils/tokenAmountToString';

const getPrice = (ticker: string) => {
  return AVAILABLE_TOKENS.find(token => token.ticker === ticker)?.price || '1';
}

const SwapComponent = ({ onSwap }: { onSwap: Function }) => {
  const { asset } = useParams();
  // console.log('asset: ', asset);
  const [fromAmount, setFromAmount] = useState('0');
  const [fromCurrency, setFromCurrency] = useState(asset?.toUpperCase() === 'USDT' ? 'WBTC' : 'USDT');
  const [toAmount, setToAmount] = useState('0');
  const [toCurrency, setToCurrency] = useState(asset ? asset : 'USDT');

  const handleFromAmountChange = (e: any) => {
    if (Number(e.target.value) < 0) {
      setFromAmount('0');
      return;
    }
    setFromAmount(e.target.value);
    setToAmount(formatNumber((Number(e.target.value) * Number(getPrice(fromCurrency)) / Number(getPrice(toCurrency))).toString(), 17).toString());
  };

  const handleFromCurrencyChange = (e: any) => {
    setFromCurrency(e.target.value);
    // setToAmount(formatNumber((Number(e.target.value) * Number(getPrice(fromCurrency)) / Number(getPrice(toCurrency))).toString(), 17).toString());
  };

  const handleToAmountChange = (e: any) => {
    if (Number(e.target.value) < 0) {
      setToAmount('0');
      return;
    }
    setToAmount(e.target.value);
    setFromAmount(formatNumber((Number(e.target.value) * Number(getPrice(toCurrency)) / Number(getPrice(fromCurrency))).toString(), 17).toString());
  };

  const handleToCurrencyChange = (e: any) => {
    setToCurrency(e.target.value);
    // setFromAmount(formatNumber((Number(e.target.value) * Number(getPrice(toCurrency)) / Number(getPrice(fromCurrency))).toString(), 17).toString());
  };

  const handleSwap = async () => {
    const smartAccount = localStorage.getItem(SMART_ACCOUNT_KEY) || '';
    if (smartAccount) {
      // find the token address which matches the from and to currencies ticker
      const from = AVAILABLE_TOKENS.find(token => token.ticker.toUpperCase() === fromCurrency.toUpperCase())?.address || '';
      const to = AVAILABLE_TOKENS.find(token => token.ticker.toUpperCase() === toCurrency.toUpperCase())?.address || '';

      if (from || to) {
        // if decimal are > 18, remove the overflow
        const fromAmountDecimals = fromAmount.split('.')[1] ? fromAmount.split('.')[1].slice(0, 18) : '';
        const toAmountDecimals = toAmount.split('.')[1] ? toAmount.split('.')[1].slice(0, 18) : '';
        const fromAmountSecure = fromAmount.split('.')[0] + (fromAmountDecimals ? '.' + fromAmountDecimals : '');
        const toAmountSecure = toAmount.split('.')[0] + (toAmountDecimals ? '.' + toAmountDecimals : '');

        const login = localStorage.getItem(LOGIN_KEY) || '';

        if (login) {

          const txhash = 'txhashh'; // todo: call swap fct
          return txhash;
        }
        console.log("cannot swap: no login in local storage");
        return "no login in local storage";
      }
    }
    // }
  };

  return (
    <div className='swap-component'>
      <h4>Swap</h4>
      <div className="swap-container" >
        {/* <p>You sell:</p> */}
        <div className="swap-content">
        <div className="input-group">
          <select
            className="currency-select"
            value={fromCurrency}
            defaultValue={fromCurrency}
            onChange={handleFromCurrencyChange}
          >
            {
              AVAILABLE_TOKENS.map((token) => (
                <option key={token.ticker} value={token.ticker}>{token.ticker}</option>
              ))
            }
          </select>
          <p className='swap-label'>You Send</p>
          <input
            type="number"
            className="input-field"
            value={fromAmount}
            onChange={handleFromAmountChange}
          />
        </div>
        <div className="swap-icon" onClick={handleSwap}>
          ⇅
        </div>
        {/* <p>You buy:</p> */}
        <div className="input-group">
          <select
            className="currency-select"
            value={toCurrency}
            defaultValue={toCurrency}
            onChange={handleToCurrencyChange}
          >
            {
              AVAILABLE_TOKENS.map((token) => (
                <option key={token.ticker} value={token.ticker}>{token.ticker}</option>
              ))
            }
          </select>
          <p className='swap-label'>You receive</p>
          <input
            type="number"
            className="input-field"
            value={toAmount}
            onChange={handleToAmountChange}
          />
        </div>
        </div>
        <button className="swap-button" onClick={handleSwap}>Swap</button>
      </div>
    </div>
  );
}

export default SwapComponent;




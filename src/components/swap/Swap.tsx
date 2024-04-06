import React, { useEffect, useState } from 'react';
import './SwapComponent.scss';
import { swap } from '../../background/txSetup';
import { AMM_CONTRACT, AVAILABLE_TOKENS, LOGIN_KEY, MASTER_SEED_KEY, SMART_ACCOUNT_KEY, XRPL_TOKEN } from '../../constants';
import { useParams } from 'react-router-dom';
import { log } from 'console';
import { formatNumber } from '../../utils/tokenAmountToString';
import { ethers } from 'ethers';
import { swapXrpl } from '../../background/xrplSdk';

const getPrice = (ticker: string) => {
  return AVAILABLE_TOKENS.find(token => token.ticker === ticker)?.price || '1';
}

const SwapComponent = ({ onSwap }: { onSwap: Function }) => {
  const { asset } = useParams();
  // console.log('asset: ', asset);
  const [fromAmount, setFromAmount] = useState('0');
  const [fromCurrency, setFromCurrency] = useState(asset?.toUpperCase() === 'USD' ? 'WBTC' : 'USD');
  const [toAmount, setToAmount] = useState('0');
  const [toCurrency, setToCurrency] = useState(asset ? asset : 'USD');
  const [chain, setChain] = useState<'evm' | 'xrpl'>('evm');

  const handleFromAmountChange = (e: any) => {
    if (Number(e.target.value) < 0) {
      setFromAmount('0');
      return;
    }
    setFromAmount(e.target.value);
    if (toCurrency === 'XRP' && fromCurrency === 'WHT') {
      const fromPrice = 73;
      const toPrice = 0.89;
      setToAmount(formatNumber((Number(e.target.value) * fromPrice / toPrice).toString(), 5).toString());
    } else if (toCurrency === 'WHT' && fromCurrency === 'XRP') {
      const fromPrice = 0.89;
      const toPrice = 73;
      setToAmount(formatNumber((Number(e.target.value) * fromPrice / toPrice).toString(), 5).toString());
    } else {
      setToAmount(formatNumber((Number(e.target.value) * Number(getPrice(fromCurrency)) / Number(getPrice(toCurrency))).toString(), 17).toString());
    }
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
    if (toCurrency === 'XRP' && fromCurrency === 'WHT') {
      const fromPrice = 73;
      const toPrice = 0.89;
      setFromAmount(formatNumber((Number(e.target.value) * toPrice / fromPrice).toString(), 5).toString());
    } else if (toCurrency === 'WHT' && fromCurrency === 'XRP') {
      const fromPrice = 0.89;
      const toPrice = 73;
      setFromAmount(formatNumber((Number(e.target.value) * toPrice / fromPrice).toString(), 5).toString());
    } else {
      setFromAmount(formatNumber((Number(e.target.value) * Number(getPrice(toCurrency)) / Number(getPrice(fromCurrency))).toString(), 17).toString());
    }
  };

  const handleToCurrencyChange = (e: any) => {
    setToCurrency(e.target.value);
    // setFromAmount(formatNumber((Number(e.target.value) * Number(getPrice(toCurrency)) / Number(getPrice(fromCurrency))).toString(), 17).toString());
  };

  const handleSwap = async () => {
    const smartAccount = localStorage.getItem(SMART_ACCOUNT_KEY) || '';
    if (smartAccount) {
      console.log("useState: from: ", fromCurrency.toUpperCase(), " to: ", toCurrency.toUpperCase());
      // find the token address which matches the from and to currencies ticker
      let from = AVAILABLE_TOKENS.find(token => token.ticker.toUpperCase() === fromCurrency.toUpperCase())?.address || '';
      let to = AVAILABLE_TOKENS.find(token => token.ticker.toUpperCase() === toCurrency.toUpperCase())?.address || '';

      if ((fromCurrency.toUpperCase() === 'WHT' && toCurrency.toUpperCase() === 'XRP') || (fromCurrency.toUpperCase() === 'XRP' && toCurrency.toUpperCase() === 'WHT')) {
        from = fromCurrency.toUpperCase();
        to = toCurrency.toUpperCase();
      } else if ((fromCurrency.toUpperCase() !== 'WHT' && toCurrency.toUpperCase() === 'XRP') || (fromCurrency.toUpperCase() !== 'XRP' && toCurrency.toUpperCase() === 'WHT') || (fromCurrency.toUpperCase() === 'WHT' && toCurrency.toUpperCase() !== 'XRP') || (fromCurrency.toUpperCase() === 'XRP' && toCurrency.toUpperCase() !== 'WHT')) {
        throw new Error('Invalid swap pair: not on the same chain');
      }

      console.log("from: ", from, " to: ", to, " fromAmount: ", fromAmount, " toAmount: ", toAmount);

      if (from || to) {
        // if decimal are > 18, remove the overflow
        const fromAmountDecimals = fromAmount.split('.')[1] ? fromAmount.split('.')[1].slice(0, 18) : '';
        const toAmountDecimals = toAmount.split('.')[1] ? toAmount.split('.')[1].slice(0, 18) : '';
        const fromAmountSecure = fromAmount.split('.')[0] + (fromAmountDecimals ? '.' + fromAmountDecimals : '');
        const toAmountSecure = toAmount.split('.')[0] + (toAmountDecimals ? '.' + toAmountDecimals : '');

        const login = localStorage.getItem(LOGIN_KEY) || '';

        if (login) {
          if ((from === 'WHT' && to === 'XRP') || (from === 'XRP' && to === 'WHT')) {
            // HANDLE XRPL SWAP
            const xrp: { currency: string, amount: string, issuer: null | string } = {
              currency: 'XRP',
              amount: '0',
              issuer: null
            }
            const xrplToken: { currency: string, amount: string, issuer: null | string } = JSON.parse(localStorage.getItem(XRPL_TOKEN)!);

            const login = localStorage.getItem(LOGIN_KEY) || '';
            if (!login) {
              console.log("cannot swap: no login in local storage");
              return "no login in local storage";
            }
            const password = 'passwordd'; // todo
            if (from === 'XRP') {
              console.log(1);
              const result = (await swapXrpl(
                login,
                password,
                xrp,
                {
                  currency: xrplToken.currency,
                  amount: dropsFromXrp(toAmountSecure).toString(),
                  issuer: xrplToken.issuer
                },
                localStorage.getItem(MASTER_SEED_KEY)!
              ));
              console.log("result: ", result);
              return result;
            } else if (to === 'XRP') {
              console.log(2);
              return await swapXrpl(
                login,
                password,
                {
                  currency: xrplToken.currency,
                  amount: dropsFromXrp(fromAmountSecure).toString(),
                  issuer: xrplToken.issuer
                },
                xrp,
                localStorage.getItem(MASTER_SEED_KEY)!
              );
            }
          } else {
            // HANDLE EVM SWAP
            const txhash = await swap(login, from, to, ethers.utils.parseEther(fromAmountSecure).toBigInt(), ethers.utils.parseEther(toAmountSecure).toBigInt(), smartAccount, AMM_CONTRACT);
            console.log('swap txhash: ', txhash);
            console.log("swap values: \tinput: ", ethers.utils.parseEther(fromAmountSecure).toBigInt(), "\toutput: ", ethers.utils.parseEther(toAmountSecure).toBigInt());
            return txhash;
          }
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
              <option key='WHT' value='WHT'>WHT</option>
              <option key='XRP' value='XRP'>XRP</option>
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
              <option key='WHT' value='WHT'>WHT</option>
              <option key='XRP' value='XRP'>XRP</option>
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





/**
 * Convert an xrp value to drops
 * 
 * @param xrp - xrp value to convert
 * 
 * @returns - The corresponding drops value
 */
export function dropsFromXrp(xrp: Number | string): bigint {
  const xrpDecimals = 6;

  const strXrp: string = typeof xrp === 'string' ? xrp : xrp.toString();

  const [integer, decimals] = strXrp.split('.');

  if (!decimals) {
    return BigInt(integer) * BigInt(10 ** xrpDecimals);
  }

  if (decimals.length > xrpDecimals) {
    throw new Error(`Invalid xrp value: ${xrp} -> too many decimals`);
  }

  const decimalsPadded = decimals.padEnd(xrpDecimals, '0');
  console.log("original: ", xrp, "\ninteger: ", integer, "\ndecimals: ", decimals, "\ndecimalsPadded: ", decimalsPadded);
  return BigInt(`${integer}${decimalsPadded}`);
}
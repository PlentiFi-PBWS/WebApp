import React from 'react';
import {CryptoChart} from "../../TokenChart/index2";
import "./styles/token.scss"

const Tokens: React.FC = () => {
  return (
    <div>
      
      {/* <svg width="90%" height="300px" viewBox="0 0 2000 1000" xmlns="http://www.w3.org/2000/svg"><path d="M0 974.19c16.65-5.817 299.7-108.906 333-116.345 33.3-7.44 299.7-26.438 333-32.44 33.3-6.003 299.7-66.627 333-87.603 33.3-20.977 299.7-309.405 333-331.93 33.3-22.526 299.7-101.199 333-118.581 33.3-17.382 316.35-217.607 333-229.06l2 941.769H0Z" fill="#b2b2b31a"/><path d="M0 974.19c16.65-5.817 299.7-108.906 333-116.345 33.3-7.44 299.7-26.438 333-32.44 33.3-6.003 299.7-66.627 333-87.603 33.3-20.977 299.7-309.405 333-331.93 33.3-22.526 299.7-101.199 333-118.581 33.3-17.382 316.35-217.607 333-229.06" fill="none" stroke="#b2b2b3" stroke-width="6"/><g fill="#b2b2b3"><circle cy="974.19" r="12"/><circle cx="333" cy="857.845" r="12"/><circle cx="666" cy="825.404" r="12"/><circle cx="999" cy="737.802" r="12"/><circle cx="1332" cy="405.872" r="12"/><circle cx="1665" cy="287.291" r="12"/><circle cx="1998" cy="58.231" r="12"/></g></svg> */}
      <div className="tokenChart-invest">
            <CryptoChart />
          </div>
    </div>


  );
}

export default Tokens;

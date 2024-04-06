export const LOCAL: boolean = false; // if true, it will use local blockchain, otherwise it will use the testnet
/* -----------------------------SDK----------------------------- */
export const RPC = LOCAL ? 'http://127.0.0.1:7545' : "https://rpc-evm-sidechain.xrpl.org/";

export const ENTRYPOINT_CONTRACT = LOCAL ? '0xD5DFEaAC2c65971C35bdD8d595910a11F19D91dE' : "0x2A1D89DCc1C264FfDBD216F109b06Bf56bf83531"
export const WALLETFACTORY_CONTRACT = LOCAL ? '0x59A74CFE6d8Bd6283D898DFEA725Aab09738b01A' : "0x90Af0B16fE83C0AE987725D41f04949CB6664702";
export const WEBAUTHN_CONTRACT = LOCAL ? '0x7DD375f15FF1ca795e1C360983c3f646426aC119' : "0x8554E79514910b8C4ac587137689b5c9bC1be75E"

export const LOGIN_SERVICE_PORT = 4340

export const ENTROPY = 1234567890;
export const BUNDLER_BASE_URL = 'http://localhost:3001';
export const XRPL_BASE_LOGIN_SERVICE_URL = 'http://localhost:3002';

/* -----------------------------STORAGE KEYS----------------------------- */
export const SMART_ACCOUNT_KEY = "smart_account_key";
export const XRPL_SMART_ACCOUNT_KEY = "xrpl_smart_account_key";
export const LOGIN_KEY = "login_key";

/* -----------------------------AVAILABLE TOKENS----------------------------- */
export const AMM_CONTRACT = LOCAL ? "0x27e3Ce53ddE18E62f8A312648FAC60B6bE48731A" : "0xF0d7935a33b6126115D21Ec49403e4ce378A42Dd";

export const AVAILABLE_TOKENS = [
  // prices are mocked for the poc
  {
    id: 1,
    name: "Bitcoin",
    ticker: "WBTC",
    address: (LOCAL ? '0x54616B55E6a38a2144d6A90bBed8EDff46701521' : '0xbEeB29483e810290B2610593B30C589672CCE3c8'),
    decimals: 18,
    price: "64000",
    marketCap: "1.2T",
    liquidity: "600B",
    chart: {
      currencyName: "Bitcoin",
      currencyPrice: "64000",
      icon: "bitcoinIcon",
      currencyShortName: "BTC",
      trend: "12%",
      trendDirection: 1,
      chartData: [12, 19, 28, 40, 21, 32, 12, 98, 32, 42, 32, 52]
    },
    description: 'Bitcoin is a decentralized digital currency, without a central bank or single administrator, that can be sent from user to user on the peer-to-peer bitcoin network without the need for intermediaries.'
  },
  {
    id: 2,
    name: "USD",
    ticker: "USD",
    address: (LOCAL ? '0xDdE9C0b43cD8837C61C1968697CE3948804ba71c' : '0xfA41c676566422887f29FD095Fb8E8FdB2396548'),
    decimals: 18,
    price: "1",
    marketCap: "95B",
    liquidity: "20B",
  },
  {
    id: 3,
    name: "Apple Inc",
    ticker: "APPL",
    address: (LOCAL ? '0xdCCEf3A4d401c268347AB1Dc6bD90FF459f1Ae0E' : '0x26cA8F4556f2ACDd500F255898710E97Da67825d'),
    decimals: 18,
    price: "172",
    marketCap: "500B",
    liquidity: "25B",
  },
  {
    id: 4,
    name: "Brent Crude Oil",
    ticker: "BRENT",
    address: (LOCAL ? '0x51874962f773d7e953dEb0803e0369A10436d422' : '0xaE2274E71f2570d4ed4af0384B061b29Ce4b3F7a'),
    decimals: 18,
    price: "144",
    marketCap: "53M",
    liquidity: "1M",
  },
  {
    id: 5,
    name: "21 rue de Berri 75008 Paris, apprt 12",
    ticker: "21rB75008Apprt12",
    address: (LOCAL ? '0xDE21f73ad40ed22D723Fe170F1F4cCD08687B6BA' : '0x26F31025D1c0A8a6F6Be75885fCD9A8713e911c7'),
    decimals: 18,
    price: "53",
  },
  {
    id: 6,
    name: "US Treasury Bond 20 years",
    ticker: "USTB20",
    address: (LOCAL ? '0x190CD0b760699836A3d0210bDeC155e71849c1CE' : '0x4be29fA49717486b44465eBbeFF4b7103A676BDe'),
    decimals: 18,
    price: "14",
    marketCap: "1T",
    liquidity: "50B",
  },
  {
    id: 7,
    name: "Gold",
    ticker: "GOLD",
    address: (LOCAL ? '0x407Dfe12043288a49E55311F078CE5448b3EDC23' : '0xECa9ae3DF171f0EEAC0bA530A92cd6Ef48865D19'),
    decimals: 18,
    price: "504",
    marketCap: "11T",
    liquidity: "500B",
  },
];
export const LOCAL: boolean = false; // if true, it will use local blockchain, otherwise it will use the testnet
/* -----------------------------SDK----------------------------- */
export const RPC = "xrpl rpc";

export const ENTROPY = 1234567890;

/* -----------------------------STORAGE KEYS----------------------------- */
export const SMART_ACCOUNT_KEY = "smart_account_key";
export const LOGIN_KEY = "login_key";

/* -----------------------------AVAILABLE TOKENS----------------------------- */
export const AMM_CONTRACT = "amm";

export const AVAILABLE_TOKENS = [
  // prices are mocked for the poc
  {
    id: 1,
    name: "Bitcoin",
    ticker: "WBTC",
    address: "",
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
    ticker: "USDT",
    address: "",
    decimals: 18,
    price: "1",
    marketCap: "95B",
    liquidity: "20B",
  },
  {
    id: 3,
    name: "Apple Inc",
    ticker: "APPL",
    address: "",
    decimals: 18,
    price: "172",
    marketCap: "500B",
    liquidity: "25B",
  },
  {
    id: 4,
    name: "Brent Crude Oil",
    ticker: "BRENT",
    address: "",
    decimals: 18,
    price: "144",
    marketCap: "53M",
    liquidity: "1M",
  },
  {
    id: 5,
    name: "21 rue de Berri 75008 Paris, apprt 12",
    ticker: "21rB75008Apprt12",
    address: "",
    decimals: 18,
    price: "53",
  },
  {
    id: 6,
    name: "US Treasury Bond 20 years",
    ticker: "USTB20",
    address: "",
    decimals: 18,
    price: "14",
    marketCap: "1T",
    liquidity: "50B",
  },
  {
    id: 7,
    name: "Gold",
    ticker: "GOLD",
    address: "",
    decimals: 18,
    price: "504",
    marketCap: "11T",
    liquidity: "500B",
  },
];

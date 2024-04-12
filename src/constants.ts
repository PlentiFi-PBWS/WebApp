/* -----------------------------MOCKED----------------------------- */ // todo: unmock
export const LOGIN_SERVICE_PK="0x799e37f8ffbc46330f906c4dead6d9367eb91c7a7f1eb4eee27ae612bae9950b"; // address: 0xE9890962Af02D626E69A18fdFCC663da502ebe79

/* -----------------------------GENERAL----------------------------- */

/* -----------------------------SDK----------------------------- */
export const RPC="https://sepolia.infura.io/v3/afbecdcd59884b81a0e460a2f533d055";
export const BUNDLER="https://public.stackup.sh/api/v1/node/ethereum-sepolia";
// export const PAYMASTER="https://paymasterURL";

export const ENTRYPOINT_CONTRACT="0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
export const WALLET_FACTORY_CONTRACT= "0x1B9554908E5fD36797345b67f6dd0D7Ed5eF06Af";// original: "0x019C256074D423a7dC157d9D9a72D16Bcf47D301"
export const WEBAUTHN_CONTRACT="0xbBc76f5b09462e397FBA811E1aAa738874bCD839"


/* -----------------------------STORAGE KEYS----------------------------- */
export const SMART_ACCOUNT_KEY = "smart_account_key"; // smart account address // todo: rename??
export const LOGIN_DATA_KEY = "login_data_key";
export const ACCOUNT_PASSWORD = "account_password";

/* -----------------------------AVAILABLE TOKENS----------------------------- */
export const AMM_CONTRACT = "";

export const AVAILABLE_TOKENS = [
  // prices are mocked for the poc
  {
    id: 1,
    name: "Bitcoin",
    ticker: "WBTC",
    address: '0xEF6fd31E3F18a17A07680615DD16974970Ca03A5',
    decimals: 18,
    price: "64000",
    marketCap: "1.2T",
    liquidity: "600B",
    chart: {
      currencyName: "Bitcoin",
      currencyPrice: "64000",
      icon: "bitcoinIcon",
      currencyShortName: "",
      trend: "12%",
      trendDirection: 1,
      chartData: [12, 19, 28, 40, 21, 32, 12, 98, 32, 42, 32, 52]
    },
    description: 'Bitcoin is a decentralized digital currency, without a central bank or single administrator, that can be sent from user to user on the peer-to-peer bitcoin network without the need for intermediaries.'
  },
  {
    id: 2,
    name: "USDT",
    ticker: "USDT",
    address: '0x7f9D9e2c5aCEf21d21F08f10cADeD593Cd7bA5ba',
    decimals: 18,
    price: "1",
    marketCap: "95B",
    liquidity: "20B",
    chart: {
      currencyName: "USD",
      currencyPrice: "1", // Price of USD would typically be "1" if it's being treated as equivalent to USD
      icon: "dollarIcon", // Replace with actual path to USD icon image
      currencyShortName: "",
      trend: "0%", // USD doesn't usually have a trend percentage since it's a stable currency, but adjust if necessary
      trendDirection: 0, // 0 can signify no change/stable, 1 for up, -1 for down
      chartData: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] // Assuming stable value over time for the chart data
    },
    description: 'USD, or United States Dollar, is the official currency of the United States and its territories per the Coinage Act of 1792. It is the most widely used currency in the world and is the world’s primary reserve currency.'
  },
  {
    id: 3,
    name: "Apple Inc",
    ticker: "APPL",
    address: '0x8F92ADdD18f25125A7DCD5D388b376646d75B546',
    decimals: 18,
    price: "172",
    marketCap: "500B",
    liquidity: "25B",
    chart: {
      currencyName: "Apple Inc",
      currencyPrice: "172",
      icon: "appleIcon", // Replace with actual path to Apple Inc icon image
      currencyShortName: "AAPL",
      trend: "5%", // Example trend percentage, replace with real data if available
      trendDirection: 1, // Assume an upward trend, use -1 for downward, 0 for no change
      chartData: [160, 165, 162, 168, 172, 170, 173, 175, 180, 178, 176, 179] // Mock chart data representing stock price movement
    },
    description: 'Apple Inc. is an American multinational technology company that specializes in consumer electronics, software and online services. It is the world’s largest technology company by revenue (totaling $274.5 billion in 2020)'
  },
  {
    id: 4,
    name: "Brent Crude Oil",
    ticker: "BRENT",
    address: '0xCD2A993b46EeD25762115c3E4004C75E1b5aa974',
    decimals: 18,
    price: "144",
    marketCap: "53M",
    liquidity: "1M",
    chart: {
      currencyName: "Brent Crude Oil",
      currencyPrice: "144",
      icon: "oilIcon", // Replace with actual path to the Brent Crude Oil icon image
      currencyShortName: "BRENT",
      trend: "0%", // Example trend percentage, could be adjusted based on actual market data
      trendDirection: 0, // 0 for stable, 1 for an upward trend, -1 for a downward trend
      chartData: [140, 142, 141, 143, 145, 144, 146, 147, 145, 148, 147, 146] // Mock chart data representing price movement
    },
    description: 'Brent Crud is one of the leading global benchmark for crude oil, used to price two-thirds of the world’s internationally traded crude oil supplies. It is sourced from the North Sea.'
  },
  {
    id: 5,
    name: "21 rue de Berri 75008 Paris, apprt 12",
    ticker: "15 blvrd hssmnn",
    address: '0xbBE0Fc4daA3DE0Cb8c8331E526aDaea54A1A3072',
    decimals: 18,
    price: "53",
    description: 'This asset represents a fractional investment in a luxurious apartment located in the 8th arrondissement of Paris. Situated at "21 rue de Berri", this property is in the heart of Paris, a short walk from the Champs-Élysées and Parc Monceau.'
  },
  {
    id: 6,
    name: "US Treasury Bond 20 years",
    ticker: "USTB20",
    address: '0xE0616E6404bB4F99c2A1C4Db91484E38ee4d53b2',
    decimals: 18,
    price: "14",
    marketCap: "1T",
    liquidity: "50B",
    chart: {
      currencyName: "Brent Crude Oil",
      currencyPrice: "144",
      icon: "oilBarrelIcon", // Replace with actual path to Brent Crude Oil icon image
      currencyShortName: "OIL",
      trend: "-3%", // Example trend percentage, adjust based on actual market data
      trendDirection: -1, // Assume a downward trend, use 1 for upward, 0 for no change
      chartData: [150, 148, 145, 143, 144, 146, 148, 147, 144, 142, 140, 141] // Mock chart data representing price movement
    },
    description: 'Brent Crude is a major trading classification of sweet light crude oil that serves as a major benchmark price for purchases of oil worldwide. It is extracted from the North Sea and comprises Brent Blend, Forties Blend, Oseberg and Ekofisk crudes.'
  },
  {
    id: 7,
    name: "Gold",
    ticker: "GOLD",
    address: '0x90A42De35852d4af5FCB3B5234Be4CAaeC9E0E6A',
    decimals: 18,
    price: "504",
    marketCap: "11T",
    liquidity: "500B",
    chart: {
      currencyName: "Gold",
      currencyPrice: "504",
      icon: "goldIcon", // Replace with actual path to Gold icon image
      currencyShortName: "GOLD",
      trend: "1%", // Example trend percentage, adjust based on actual market data
      trendDirection: 1, // Assume an upward trend, use -1 for downward, 0 for no change
      chartData: [500, 502, 504, 506, 508, 510, 512, 514, 516, 518, 520, 522] // Mock chart data representing price movement
    },
    description: 'Gold is a chemical element with the symbol Au (from Latin: aurum) and atomic number 79, making it one of the higher atomic number elements that occur naturally. It is a bright, slightly reddish yellow, dense, soft, malleable, and ductile metal. Gold is a precious metal used for coinage, jewelry, and other arts throughout recorded history.'
  },
];
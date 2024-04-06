import { EVMNetwork } from '.';

export const sepolia = {
  chainID: '11155111',
  family: 'EVM',
  name: 'Sepolia',
  provider: 'https://sepolia.infura.io/v3/bdabe9d2f9244005af0f566398e648da',
  baseAsset: {
    symbol: 'ETH',
    name: 'ETH',
    decimals: 18,
    image:
      'https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/6ed5f/eth-diamond-black.webp',
  },
  factoryAddress: "0x9406Cc6185a346906296840746125a0E44976454",
} as EVMNetwork;

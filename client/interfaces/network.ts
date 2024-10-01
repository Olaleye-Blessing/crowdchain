export interface IWalletNetworkInfo {
  name: string;
  chainId: number;
  ensAddress: string;
}

export type ISupportedNetworks =
  | "anvil"
  // | "arbitrum-sepolia"
  | "sepolia";

export interface IWalletNetworkConnection {
  chainId: number;
  rpcUrls: Array<string>;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorerUrls?: Array<string>;
}

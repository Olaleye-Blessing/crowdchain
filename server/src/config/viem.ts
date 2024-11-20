import { createPublicClient, defineChain, http } from 'viem';
import { sepolia } from 'viem/chains';
import { envVars } from '../utils/env-data';

const anvil = defineChain({
  id: 7001,
  name: 'Anvil',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: [envVars.ANVIL_RPC] },
  },
  testnet: true,
});

export const publicClient = createPublicClient({
  chain: envVars.NODE_ENV === 'production' ? sepolia : anvil,
  transport: http(),
});

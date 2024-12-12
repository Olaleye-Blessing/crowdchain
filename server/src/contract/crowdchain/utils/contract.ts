import { CROWDCHAIN_ADDRESS } from '../../../config/constants';
import { crowdchainAbi } from './abi';

export const crowdchainContract = {
  address: CROWDCHAIN_ADDRESS,
  abi: crowdchainAbi,
} as const;

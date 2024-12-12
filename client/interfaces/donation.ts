import { Address } from "viem";

export interface IDonation {
  amount: number;
  coin: Address;
  coinUnit: string;
  donor: Address;
  timestamp: number;
}

export interface IDonationChain {
  amount: bigint;
  coin: Address;
  donor: Address;
  timestamp: bigint;
}

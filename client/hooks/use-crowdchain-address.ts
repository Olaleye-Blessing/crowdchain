import { wagmiCrowdContractAddress } from "@/utils/networks";
import { useChainId } from "wagmi";

export const useCrowdchainAddress = () =>
  wagmiCrowdContractAddress(useChainId());

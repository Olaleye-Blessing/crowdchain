import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { toast } from "./use-toast";
import { defaultNetworkId, wagmiCrowdchainInfos } from "@/utils/networks";

export const useAccountCheck = () => {
  const { chainId: currentChainId, isConnected } = useAccount();
  const configChainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const supportedNetwork = wagmiCrowdchainInfos[defaultNetworkId];

  const isAccountConnected = (alert = true) => {
    if (!isConnected && alert) {
      toast({
        title: "Connect your wallet.",
        variant: "destructive",
      });
    }

    return isConnected;
  };

  const switchToCorrectNetwork = async () => {
    try {
      await switchChainAsync({ chainId: configChainId });

      toast({ title: `Switched to the ${supportedNetwork.name}.` });

      return true;
    } catch (error) {
      toast({
        title: `Manually switch to the ${supportedNetwork.name} in your wallet.`,
        variant: "destructive",
      });

      return false;
    }
  };

  const isCorrectNetwork = () => currentChainId === configChainId;

  return { isCorrectNetwork, isAccountConnected, switchToCorrectNetwork };
};

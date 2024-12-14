"use client";

import { cn } from "@/lib/utils";
import { defaultNetworkId, wagmiCrowdchainInfos } from "@/utils/networks";
import { useAccountCheck } from "@/hooks/use-account-check";

export default function WrongNetworkAlert() {
  const { isCorrectNetwork, isAccountConnected, switchToCorrectNetwork } =
    useAccountCheck();

  const showBanner = isAccountConnected(false) && !isCorrectNetwork();

  return (
    <div
      aria-hidden={!showBanner}
      className={cn(
        "transition-all duration-300 h-0 bg-red-200 text-red-800 text-center overflow-hidden",
        showBanner ? "sticky top-14 left-0 h-auto px-4 py-2 z-[48]" : "h-0",
      )}
    >
      <div className="layout p-0">
        <p>
          You are on a non-supported network. Switch to{" "}
          <button
            type="button"
            className="text-green-800"
            onClick={async () => await switchToCorrectNetwork()}
          >
            {wagmiCrowdchainInfos[defaultNetworkId].name}.
          </button>
        </p>
      </div>
    </div>
  );
}

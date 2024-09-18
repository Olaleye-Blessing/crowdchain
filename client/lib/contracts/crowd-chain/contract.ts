import { ethers } from "ethers";
import { crowdChainAddress } from "./address";
import { crowdChainABI } from "./abi";

export const crowdChainContract = (signer: ethers.providers.JsonRpcSigner) =>
  new ethers.Contract(crowdChainAddress, crowdChainABI, signer);

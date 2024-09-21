import { Contract } from "ethers";

export const campaignDonorEventFilter = (
  readonlyContract: Contract,
  id: number,
) => readonlyContract.filters.NewDonation(null, id, null);

import { Contract } from "ethers";

export const campaignDonorEventFilter = (
  readonlyContract: Contract,
  id: number,
) => readonlyContract.filters.NewDonation(null, id, null);

export const campaignRefundEventFilter = (
  readonlyContract: Contract,
  id: number,
) => readonlyContract.filters.DonationRefunded(null, id, null);

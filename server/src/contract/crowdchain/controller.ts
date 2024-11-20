import * as crowdchainService from './donation.service';
import { catchAsync } from '../../utils/catch-async';
import { sendResponse } from '../../utils/send-response';

export const getRecentDonations = catchAsync(async (req, res) => {
  const donations = await crowdchainService.getRecentDonations();

  sendResponse(res, 200, donations);
});

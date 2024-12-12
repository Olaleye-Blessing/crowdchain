import { catchAsync } from '../../utils/catch-async';
import { sendResponse } from '../../utils/send-response';
import { CrowdchainStatsService } from './services/stats';

export const getRecentDonations = catchAsync(async (req, res) => {
  sendResponse(res, 200, await CrowdchainStatsService.getRecentDonations());
});

export const getRecentUpdates = catchAsync(async (req, res) => {
  sendResponse(res, 200, await CrowdchainStatsService.getRecentUpdates());
});

export const getTotalStats = catchAsync(async (req, res) => {
  sendResponse(res, 200, await CrowdchainStatsService.getTotalStats());
});

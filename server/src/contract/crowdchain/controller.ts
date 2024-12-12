import { catchAsync } from '../../utils/catch-async';
import { sendResponse } from '../../utils/send-response';
import { CrowdchainStatsService } from './services/stats';
import { CrowdchainCampaignService } from './services/campaigns';

export const getRecentDonations = catchAsync(async (req, res) => {
  sendResponse(res, 200, await CrowdchainStatsService.getRecentDonations());
});

export const getRecentUpdates = catchAsync(async (req, res) => {
  sendResponse(res, 200, await CrowdchainStatsService.getRecentUpdates());
});

export const getTotalStats = catchAsync(async (req, res) => {
  sendResponse(res, 200, await CrowdchainStatsService.getTotalStats());
});

export const getSupportedCoins = catchAsync(async (req, res) => {
  sendResponse(res, 200, await CrowdchainStatsService.getSupportedCoins());
});

export const getCampaigns = catchAsync(async (req, res) => {
  sendResponse(res, 200, await CrowdchainCampaignService.getCampaigns(req));
});

export const getOwnerCampaigns = catchAsync(async (req, res, next) => {
  sendResponse(
    res,
    200,
    await CrowdchainCampaignService.getOwnerCampaigns(req, next),
  );
});

import { catchAsync } from '../../utils/catch-async';
import { sendResponse } from '../../utils/send-response';
import { CrowdchainEventService } from './service';

export const getRecentDonations = catchAsync(async (req, res) => {
  sendResponse(res, 200, await CrowdchainEventService.getRecentDonations());
});

export const getRecentUpdates = catchAsync(async (req, res) => {
  sendResponse(res, 200, await CrowdchainEventService.getRecentUpdates());
});

export const getTotalStats = catchAsync(async (req, res) => {
  sendResponse(res, 200, await CrowdchainEventService.getTotalStats());
});

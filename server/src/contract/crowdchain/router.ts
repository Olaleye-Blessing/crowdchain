import express from 'express';
import * as crowdchainController from './controller';

const router = express.Router();

router.get('/recentDonations', crowdchainController.getRecentDonations);
router.get('/recentUpdates', crowdchainController.getRecentUpdates);
router.get('/totalStats', crowdchainController.getTotalStats);

export default router;

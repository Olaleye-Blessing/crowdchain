import express from 'express';
import * as crowdchainController from './controller';

const router = express.Router();

router.get('/recentDonations', crowdchainController.getRecentDonations);

export default router;

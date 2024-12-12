import dotenv from 'dotenv';
dotenv.config();

import './utils/global-patches';
import app from './app';
import { connectDBs } from './dbs/init';
import { CrowdchainStatsService } from './contract/crowdchain/services/stats';

const port = process.env.PORT || 7000;

const main = async () => {
  const server = app.listen(port, () => {
    console.log(`[server]: Server is running on port: ${port}`);
  });

  await connectDBs();

  await CrowdchainStatsService.startPeriodicUpdates();

  process.on('unhandledRejection', (err: Error) => {
    console.log('____ 🔥 Unhandled rejection ____');
    console.log(err.message);
    server.close(() => {
      CrowdchainStatsService.stopPeriodicUpdates();

      process.exit(1);
    });
  });
};

main();

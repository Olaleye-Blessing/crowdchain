import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDBs } from './dbs/init';
import { startPeriodicUpdates } from './contract/crowdchain/donation.service';

const port = process.env.PORT || 7000;

const main = async () => {
  const server = app.listen(port, () => {
    console.log(`[server]: Server is running on port: ${port}`);
  });

  await connectDBs();

  await startPeriodicUpdates();

  process.on('unhandledRejection', (err: Error) => {
    console.log('____ 🔥 Unhandled rejection ____');
    console.log(err.message);
    server.close(() => {
      process.exit(1);
    });
  });
};

main();

import { connectMongoDB } from './mongodb';
import { connectRedisDB } from './redis';

export const connectDBs = async () => {
  await Promise.allSettled([connectMongoDB(), connectRedisDB()]);
};

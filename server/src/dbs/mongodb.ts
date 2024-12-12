import mongoose from 'mongoose';
import { envVars } from '../utils/env-data';

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(envVars.MONGO_URL);
    console.log('✅ Mongo DB connection successful');
  } catch (error) {
    console.log('Error connecting to mongoDB', error);
  }
};

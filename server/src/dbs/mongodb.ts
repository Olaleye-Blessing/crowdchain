import mongoose from 'mongoose';

export const connectMongoDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/crowdchain');
    console.log('✅ Mongo DB connection successful');
  } catch (error) {
    console.log('Error connecting to mongoDB', error);
  }
};

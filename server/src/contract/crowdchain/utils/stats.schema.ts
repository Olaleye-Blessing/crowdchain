import mongoose from 'mongoose';

const TotalStatsSchema = new mongoose.Schema({
  totalDonated: { type: Number, default: 0 },
  totalDonors: { type: Number, default: 0 },
  totalCampaigns: { type: Number, default: 0 },
  lastProcessedBlock: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

const TotalStats = mongoose.model('TotalStats', TotalStatsSchema);

export default TotalStats;

import { donationEvent } from './utils/abi';
import { CROWDCHAIN_ADDRESS } from '../../config/constants';
import { formatEther, parseAbiItem } from 'viem';
import { IDonation } from './interface';
import { publicClient } from '../../config/viem';
import { redisClient } from '../../dbs/redis';

const ONE_HOUR = 3600000;
const cacheKey = 'crowdchainRecentDonations';

// Number of blocks to look back (approximately 1 hour worth of blocks)
const BLOCK_RANGE = 300; // ~1 hour of blocks (assuming 12 sec/block)
let updateInterval: NodeJS.Timeout | null = null;

export const updateRecentDonations = async () => {
  try {
    const currentBlock = await publicClient.getBlockNumber();

    const startBlock = Number(currentBlock) - BLOCK_RANGE;
    const fromBlock = BigInt(startBlock < 0 ? 0 : startBlock);

    const logs = await publicClient.getLogs({
      address: CROWDCHAIN_ADDRESS as `0x${string}`,
      event: parseAbiItem(donationEvent),
      fromBlock,
      toBlock: currentBlock,
    });

    if (logs.length === 0) return [];

    const donations: IDonation[] = await Promise.all(
      logs.map(async (log) => {
        const block = await publicClient.getBlock({
          blockNumber: log.blockNumber,
        });

        return {
          donor: log.args.donor!,
          campaignId: Number(log.args.campaignId!),
          amount: formatEther(log.args.amount!),
          campaignTitle: log.args.campaignTitle!,
          timestamp: Number(block.timestamp),
          blockNumber: Number(log.blockNumber),
        };
      }),
    );

    const recentDonations = donations
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      .slice(0, 10);

    await redisClient.set(cacheKey, JSON.stringify(recentDonations));

    return recentDonations;
  } catch (error) {
    console.log("'Error updating recent donations:'", error);
    throw error;
  }
};

export const startPeriodicUpdates = async (intervalMs = ONE_HOUR) => {
  await updateRecentDonations();

  updateInterval = setInterval(async () => {
    try {
      await updateRecentDonations();
    } catch (error) {
      console.error('Failed to update recent donations:', error);
    }
  }, intervalMs);
};

export const stopPeriodicUpdates = () => {
  if (!updateInterval) return;

  clearInterval(updateInterval);
  updateInterval = null;
};

export const getRecentDonations = async () => {
  try {
    const cacheDonations = await redisClient.get(cacheKey);

    return cacheDonations
      ? (JSON.parse(cacheDonations) as IDonation[])
      : await updateRecentDonations();
  } catch (error) {
    console.log('__ THERE IS AN ERROR __', error);
    throw new Error('Internal server error');
  }
};

export const calculateBlockRange = async (
  targetHours: number = 1,
): Promise<number> => {
  try {
    const currentBlock = await publicClient.getBlockNumber();
    const currentBlockData = await publicClient.getBlock({
      blockNumber: currentBlock,
    });
    const oneHourAgoBlock = await publicClient.getBlock({
      blockNumber: currentBlock - BigInt(BLOCK_RANGE),
    });

    // Calculate average block time
    const timeDiff =
      Number(currentBlockData.timestamp) - Number(oneHourAgoBlock.timestamp);
    const blockDiff = BLOCK_RANGE;
    const avgBlockTime = timeDiff / blockDiff;

    // Calculate blocks needed for target hours
    return Math.ceil((targetHours * 3600) / avgBlockTime);
  } catch (error) {
    console.log('Error calculating block range:', error);
    return BLOCK_RANGE; // Return default if calculation fails
  }
};

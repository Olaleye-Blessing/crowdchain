/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AbiEvent, Address, formatEther, parseAbiItem } from 'viem';
import { publicClient } from '../../config/viem';
import { redisClient } from '../../dbs/redis';
import { CROWDCHAIN_ADDRESS } from '../../config/constants';
import { IDonation, IUpdate, ITotalStats, IBLOCK_RANGES } from './interface';
import { DONATION_EVENT, UPDATE_EVENT } from './utils/abi';

export class CrowdchainEventService {
  private static updateInterval: NodeJS.Timeout | null = null;

  private static readonly RECENT_CACHE_KEYS = {
    recentDonations: 'crowdchain:recentDonations',
    recentUpdates: 'crowdchain:recentUpdates',
  };

  private static readonly CACHE_KEYS = {
    ...this.RECENT_CACHE_KEYS,
    totalStats: 'crowdchain:totalStats',
  };

  // Block ranges
  private static readonly BLOCK_RANGES: IBLOCK_RANGES = {
    RECENT: 300, // ~1 hour (12 sec/block)
    TOTAL: 3600, // ~12 hours for total stats
  };

  public static async getRecentDonations(): Promise<IDonation[]> {
    return await this.getData<IDonation[]>(
      'recentDonations',
      () => this.updateRecentDonations(),
      'Failed to fetch recent donations',
    );
  }

  public static async getRecentUpdates(): Promise<IUpdate[]> {
    return await this.getData<IUpdate[]>(
      'recentUpdates',
      () => this.updateRecentUpdates(),
      'Failed to fetch recent updates',
    );
  }

  public static async getTotalStats(): Promise<ITotalStats> {
    return await this.getData<ITotalStats>(
      'totalStats',
      () => this.updateTotalStats(),
      'Failed to fetch recent updates',
    );
  }

  public static async startPeriodicUpdates(): Promise<void> {
    await this.updateAllData();

    this.updateInterval = setInterval(
      async () => {
        try {
          await this.updateAllData();
        } catch (error) {
          console.error('Failed to update blockchain data:', error);
        }
      },
      30 * 60 * 1000,
    ); // Update every 30 minutes
  }

  public static stopPeriodicUpdates(): void {
    if (!this.updateInterval) return;

    clearInterval(this.updateInterval);
    this.updateInterval = null;
  }

  private static async updateAllData(): Promise<void> {
    await Promise.allSettled([
      this.updateRecentDonations(),
      this.updateRecentUpdates(),
      this.updateTotalStats(),
    ]);
  }

  private static async getData<Data>(
    key: keyof typeof this.CACHE_KEYS,
    fn: () => Promise<Data>,
    errMsg: string,
  ): Promise<Data> {
    try {
      const cached = await redisClient.get(this.CACHE_KEYS[key]);

      return cached ? JSON.parse(cached) : await fn();
    } catch (error) {
      console.error(errMsg, error);
      throw new Error(errMsg);
    }
  }

  private static async getBlockRange(type: keyof IBLOCK_RANGES): Promise<{
    fromBlock: bigint;
    toBlock: bigint;
  }> {
    const currentBlock = await publicClient.getBlockNumber();
    const fromBlock = currentBlock - BigInt(this.BLOCK_RANGES[type]);

    return {
      fromBlock: fromBlock < 0n ? 0n : fromBlock,
      toBlock: currentBlock,
    };
  }

  private static async updateRecentDonations(): Promise<IDonation[]> {
    const parseDonation = (data: any) => ({
      donor: data.donor! as Address,
      campaignId: Number(data.campaignId!),
      amount: formatEther(data.amount!),
      campaignTitle: data.campaignTitle! as string,
    });

    const donations = await this.updateRecentEvent<IDonation>(
      'recentDonations',
      parseAbiItem(DONATION_EVENT),
      parseDonation,
    );

    return donations;
  }

  private static async updateRecentUpdates(): Promise<IUpdate[]> {
    const parseUpdate = (data: any) => ({
      campaignId: Number(data.campaignId!),
      updateId: Number(data.updateId!),
      owner: data.owner! as Address,
      title: data.title! as string,
    });

    const updates = await this.updateRecentEvent<IUpdate>(
      'recentUpdates',
      parseAbiItem(UPDATE_EVENT),
      parseUpdate,
    );

    return updates;
  }

  private static async updateRecentEvent<Data>(
    key: keyof typeof this.RECENT_CACHE_KEYS,
    event: AbiEvent,
    constructData: (data: any) => Data,
  ) {
    try {
      const { fromBlock, toBlock } = await this.getBlockRange('RECENT');

      const logs = await publicClient.getLogs({
        address: CROWDCHAIN_ADDRESS,
        event,
        fromBlock,
        toBlock,
      });

      if (logs.length === 0) return [];

      const recentData = logs
        .sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber))
        .slice(0, 10)
        .map((log) => constructData(log.args));

      await redisClient.set(this.CACHE_KEYS[key], JSON.stringify(recentData));

      return recentData;
    } catch (error) {
      console.error(`Error updating ${key}`, error);
      throw error;
    }
  }

  private static async updateTotalStats(): Promise<ITotalStats> {
    try {
      const { fromBlock, toBlock } = await this.getBlockRange('TOTAL');

      const logs = await publicClient.getLogs({
        address: CROWDCHAIN_ADDRESS,
        event: parseAbiItem(DONATION_EVENT),
        fromBlock,
        toBlock,
      });

      const uniqueDonors = new Set<string>();
      let totalAmount = 0n;

      logs.forEach((log) => {
        uniqueDonors.add(log.args.donor as string);
        totalAmount += log.args.amount as bigint;
      });

      const stats = {
        totalDonated: +formatEther(totalAmount),
        totalDonors: uniqueDonors.size,
      };

      await redisClient.set(this.CACHE_KEYS.totalStats, JSON.stringify(stats));

      return stats;
    } catch (error) {
      console.error('Error updating total stats:', error);
      throw error;
    }
  }
}

/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AbiEvent, Address, erc20Abi, formatUnits, parseAbiItem } from 'viem';
import { publicClient } from '../../../config/viem';
import { redisClient } from '../../../dbs/redis';
import { CROWDCHAIN_ADDRESS, ETH_ADDRESS } from '../../../config/constants';
import {
  IDonation,
  IUpdate,
  ITotalStats,
  IBLOCK_RANGES,
  ISupportedCoinsDetails,
} from '../interface';
import { DONATION_EVENT, UPDATE_EVENT } from '../utils/abi';
import { envVars } from '../../../utils/env-data';
import { crowdchainContract } from '../utils/contract';
import TotalStats from '../utils/stats.schema';

export class CrowdchainStatsService {
  private static MAX_BLOCK_RANGE = 500n;
  private static DECIMAL_PRECISION = 18;
  private static updateInterval: NodeJS.Timeout | null = null;
  private static updateIntervalTime =
    envVars.NODE_ENV === 'production'
      ? 30 * 60 * 1000 // 30 mins
      : 5 * 60 * 1000; // 5 mins

  private static readonly RECENT_CACHE_KEYS = {
    recentDonations: 'crowdchain:recentDonations',
    recentUpdates: 'crowdchain:recentUpdates',
  };

  private static readonly CACHE_KEYS = {
    ...this.RECENT_CACHE_KEYS,
    totalStats: 'crowdchain:totalStats',
    supportedCoins: 'crowdchain:supportedCoins',
    lastProcessedBlock: 'crowdchain:lastProcessedBlock',
  };

  private static readonly BLOCK_RANGES: IBLOCK_RANGES = {
    RECENT: 300, // ~1 hour (12 sec/block)
    TOTAL: 3600, // ~12 hours for total stats
  };

  public static async getRecentDonations(): Promise<IDonation[]> {
    return await this.getData<IDonation[]>(
      'recentDonations',
      () => (async () => (await this.updateStats()).donations)(),
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
      () => (async () => (await this.updateStats()).stats)(),
      'Failed to fetch recent updates',
    );
  }

  public static async startPeriodicUpdates(): Promise<void> {
    await this.updateAllData();

    this.updateInterval = setInterval(async () => {
      try {
        await this.updateAllData();
      } catch (error) {
        console.error('Failed to update blockchain data:', error);
      }
    }, this.updateIntervalTime);
  }

  public static async getSupportedCoins() {
    try {
      const _supportedCoins = await redisClient.get(
        this.CACHE_KEYS.supportedCoins,
      );

      if (_supportedCoins)
        return JSON.parse(_supportedCoins) as ISupportedCoinsDetails;

      const _coins = (
        await publicClient.readContract({
          ...crowdchainContract,
          functionName: 'getSupportedCoins',
        })
      ).slice(1);

      const _decimals = await Promise.all(
        _coins.map((coin) =>
          publicClient.readContract({
            address: coin,
            abi: erc20Abi,
            functionName: 'decimals',
          }),
        ),
      );

      const _coinsName = await Promise.all(
        _coins.map((coin) =>
          publicClient.readContract({
            address: coin,
            abi: erc20Abi,
            functionName: 'name',
          }),
        ),
      );

      const supportedCoins: ISupportedCoinsDetails = {};

      supportedCoins[ETH_ADDRESS] = { name: 'ETH', decimal: 18 };

      _coins.forEach((coin, index) => {
        supportedCoins[coin] = {
          name: _coinsName[index],
          decimal: _decimals[index],
        };
      });

      await redisClient.set(
        this.CACHE_KEYS.supportedCoins,
        JSON.stringify(supportedCoins),
      );

      return supportedCoins;
    } catch (error) {
      console.log('__ ERROR __', error);
      throw Error('Unable to get supported coins');
    }
  }

  public static stopPeriodicUpdates(): void {
    if (!this.updateInterval) return;

    clearInterval(this.updateInterval);
    this.updateInterval = null;
  }

  private static async updateAllData(): Promise<void> {
    await Promise.allSettled([
      // this.updateRecentDonations(),
      this.updateRecentUpdates(),
      this.updateStats(),
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

  // This is no longer needed as updateStats also updates donations
  // private static async updateRecentDonations(): Promise<IDonation[]> {
  //   const supportedCoins = await this.getSupportedCoins();

  //   const parseDonation = (data: any) => {
  //     const coin = supportedCoins[data.coin];

  //     return {
  //       donor: data.donor! as Address,
  //       campaignId: Number(data.campaignId!),
  //       amount: formatUnits(data.amount!, coin?.decimal || 18),
  //       campaignTitle: data.campaignTitle! as string,
  //       coinUnit: coin?.name || 'ETH',
  //     };
  //   };

  //   const donations = await this.updateRecentEvent<IDonation>(
  //     'recentDonations',
  //     parseAbiItem(DONATION_EVENT),
  //     parseDonation,
  //   );

  //   return donations;
  // }

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

  // updates donations stats, including recent donations
  private static async updateStats(): Promise<{
    stats: ITotalStats;
    donations: IDonation[];
  }> {
    try {
      const [existingStatsJson, currentBlock, supportedCoins] =
        await Promise.all([
          redisClient.get(this.CACHE_KEYS.totalStats),
          publicClient.getBlockNumber(),
          this.getSupportedCoins(),
        ]);

      let existingStats: ITotalStats;
      if (existingStatsJson) {
        existingStats = JSON.parse(existingStatsJson) as ITotalStats;
      } else {
        existingStats = (await TotalStats.findOne({})) || {
          totalDonated: 0,
          totalDonors: 0,
          totalCampaigns: 0,
          lastProcessedBlock: 0,
        };
      }

      const lastProcessedBlock = BigInt(existingStats.lastProcessedBlock);

      const fromBlock = lastProcessedBlock;
      let toBlock = lastProcessedBlock + this.MAX_BLOCK_RANGE;
      if (toBlock > currentBlock) toBlock = currentBlock;

      const [logs, totalCampaigns] = await Promise.all([
        publicClient.getLogs({
          address: CROWDCHAIN_ADDRESS,
          event: parseAbiItem(DONATION_EVENT),
          fromBlock,
          toBlock,
        }),
        publicClient.readContract({
          ...crowdchainContract,
          functionName: 'totalCampaigns',
        }),
      ]);

      const recentDonationsStr = await redisClient.get(
        this.CACHE_KEYS.recentDonations,
      );
      let recentDonations: IDonation[] = recentDonationsStr
        ? JSON.parse(recentDonationsStr)
        : [];
      const uniqueDonors = new Set<string>();
      const coinsValue: { [key: PropertyKey]: bigint } = {};

      Object.keys(supportedCoins).forEach((key) => {
        coinsValue[key] = 0n;
      });
      logs.forEach((log) => {
        const donor = log.args.donor as Address;

        uniqueDonors.add(donor);
        coinsValue[log.args.coin!] += log.args.amount!;

        const coin = supportedCoins[log.args.coin!];

        recentDonations.unshift({
          donor,
          campaignId: Number(log.args.campaignId!),
          amount: formatUnits(log.args.amount!, coin?.decimal || 18),
          campaignTitle: log.args.campaignTitle! as string,
          coinUnit: coin?.name || 'ETH',
        });
      });

      // maintain latest 10 donations
      recentDonations = recentDonations.slice(0, 10);

      const coinValuesInUsd = await Promise.all(
        Object.entries(coinsValue).map(([coinAddress, amount]) => {
          return publicClient.readContract({
            ...crowdchainContract,
            functionName: 'coinValueInUSD',
            args: [coinAddress as Address, amount],
          });
        }),
      );

      const totalAmount = coinValuesInUsd.reduce(
        (total, current) => total + current,
        0n,
      );

      const stats = {
        totalDonors: uniqueDonors.size + existingStats.totalDonors,
        totalCampaigns: +formatUnits(totalCampaigns, 0),
        totalDonated:
          +formatUnits(totalAmount, this.DECIMAL_PRECISION) +
          existingStats.totalDonated,
        lastProcessedBlock: +toBlock.toString(),
      };

      await Promise.all([
        redisClient.set(
          this.CACHE_KEYS.recentDonations,
          JSON.stringify(recentDonations),
        ),
        redisClient.set(this.CACHE_KEYS.totalStats, JSON.stringify(stats)),
        // mongoose for backup for when redis keys are cleared because of the free version of Redis service
        TotalStats.findOneAndUpdate({}, stats, { upsert: true }),
      ]);

      return { stats, donations: recentDonations };
    } catch (error) {
      console.error('Error updating total stats:', error);
      throw error;
    }
  }
}

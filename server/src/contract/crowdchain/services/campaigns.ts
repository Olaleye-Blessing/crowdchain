/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request } from 'express';
import { redisClient } from '../../../dbs/redis';
import { publicClient } from '../../../config/viem';
import { crowdchainContract } from '../utils/contract';
import { ICampaignDetailsChain } from '../interface';
import { envVars } from '../../../utils/env-data';
import { Address } from 'viem';
import { AppError } from '../../../utils/errors/app-error';

const perPage = BigInt(envVars.NODE_ENV === 'production' ? 20 : 2);

export class CrowdchainCampaignService {
  public static async getCampaigns(req: Request) {
    const page = Number(req.query.page || 0);
    const category = (req.query.category as string).toLowerCase() || 'all';

    const cacheKey = `crowdchain:campaigns_${category}_${page}`;

    const cachedCampaigns = await redisClient.get(cacheKey);

    if (cachedCampaigns) return JSON.parse(cachedCampaigns);

    return await this._getCampaigns({
      functionName:
        category === 'all' ? 'getCampaigns' : 'getCampaignsByCategory',
      args:
        category === 'all'
          ? [BigInt(page), perPage]
          : [category, BigInt(page), perPage],
      cacheKey,
    });
  }

  public static async getOwnerCampaigns(req: Request, next: NextFunction) {
    const address = req.params.address as Address;

    if (!address) return next(new AppError('Provide an address', 400));

    const page = Number(req.query.page || 0);
    const cacheKey = `crowdchain:c_owners_${address}_${page}`;

    const cachedCampaigns = await redisClient.get(cacheKey);

    if (cachedCampaigns) return JSON.parse(cachedCampaigns);

    return await this._getCampaigns({
      functionName: 'getOwnerCampaigns',
      args: [address, BigInt(page), perPage],
      cacheKey,
    });
  }

  private static async _getCampaigns({
    functionName,
    args,
    cacheKey,
  }: {
    functionName: string;
    args: any[];
    cacheKey: string;
  }) {
    const result = (await publicClient.readContract({
      ...crowdchainContract,
      functionName: functionName as any,
      args: args as any,
    })) as unknown as readonly [readonly ICampaignDetailsChain[], bigint];

    if (result[0].length === 0)
      return { campaigns: [], total: result[1].toString() };

    const data = { campaigns: result[0], total: result[1].toString() };

    await redisClient.set(cacheKey, JSON.stringify(data), {
      EX: 5 * 60, // 5 mins,
    });

    return { ...data };
  }
}

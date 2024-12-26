import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().min(3000),
  ALLOWED_ORIGINS: z.string(),
  NODE_ENV: z
    .union([
      z.literal('development'),
      z.literal('test'),
      z.literal('production'),
    ])
    .default('development'),
  CROWDCHAIN_ADDRESS: z.string(),
  CROWDCHAIN_DEPLOYMENT_BLOCK: z.coerce.number(),
  ANVIL_RPC: z.string(),
  REDIS_URL: z.string(),
  MONGO_URL: z.string(),
  BASE_SEPOLIA_ALCHEMY_RPC_URL: z.string(),
  FILEBASE_BUCKET_NAME: z.string(),
  FILEBASE_S3_KEY: z.string(),
  FILEBASE_S3_SECRET: z.string(),
});

export type Environment = z.infer<typeof envSchema>;

export const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.log('There is an error with the server environment variables');
  console.error(parsedEnv.error.issues);
  process.exit(1);
}

export const envVars = parsedEnv.data;

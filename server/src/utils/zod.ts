import { z } from 'zod';

export const nonEmptyStringSchema = (message = 'is required') =>
  z.string().trim().min(1, { message });

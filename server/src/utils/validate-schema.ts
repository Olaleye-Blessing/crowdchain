/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { z, ZodError } from 'zod';
import { AppError } from './errors/app-error';

type TSchema = z.ZodObject<any, any> | z.ZodEffects<z.ZodObject<any, any>>;

type IValidatePayload = {
  schema: TSchema;
  path?: keyof Request;
  errCode?: number;
};

export const validateData =
  ({ schema, path = 'body', errCode = 400 }: IValidatePayload) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req[path]);

      next();
    } catch (error) {
      if (!(error instanceof ZodError))
        return next(new AppError('Internal Server error', 500));

      const messages = error.errors
        .reduce((msgs, current) => {
          msgs += `${current.path[0]}: ${current.message}.\n`;

          return msgs;
        }, '')
        .trim();

      return next(new AppError(messages, errCode));
    }
  };

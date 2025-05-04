import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { envVars } from './utils/env-data';
import { globalErrorHanlder } from './utils/errors/global-err-handler';
import crowdchainRoute from './contract/crowdchain/router';
import ipfsRoute from './ipfs/router';

const app = express();

if (envVars.NODE_ENV !== 'production') app.use(morgan('dev'));

const allowedOrigins = envVars.ALLOWED_ORIGINS.split(',').map((origin) => {
  if (!origin.startsWith('/')) return origin;

  return new RegExp(origin.slice(1, -1));
});

app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/ipfs', ipfsRoute);
app.use('/api/v1/crowdchain', crowdchainRoute);

app.get('/keep-alive', (req, res) => {
  res.status(200).json({ status: 'success' });
});

app.use(globalErrorHanlder);

export default app;

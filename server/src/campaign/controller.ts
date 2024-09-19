import { PinataSDK } from 'pinata-web3';
import { catchAsync } from '../utils/catch-async';
import { AppError } from '../utils/errors/app-error';
import { sampleImgsHashes } from '../utils/pinata';

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.PINATA_GATEWAY,
});

export const uploadImage = catchAsync(async (req, res, next) => {
  const image = req.file;

  if (!image) return next(new AppError('Provide an image', 400));

  if (process.env.NODE_ENV !== 'production') {
    const imgIndex = Math.floor(Math.random() * sampleImgsHashes.length);

    return res.status(201).json({
      status: 'success',
      data: {
        image: {
          IpfsHash: sampleImgsHashes[imgIndex],
          PinSize: 419402,
          Timestamp: '2024-09-19T16:25:34.098Z',
        },
        imgBaseUrl:
          'https://aquamarine-definite-canidae-414.mypinata.cloud/ipfs/',
      },
    });
  }

  const file = new File([image.buffer], image.originalname, {
    type: image.mimetype,
  });

  try {
    const uploadImage = await pinata.upload.file(file);
    return res.status(201).json({
      status: 'success',
      data: { image: { ...uploadImage } },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return next(new AppError('Internal server error', 500));
  }
});

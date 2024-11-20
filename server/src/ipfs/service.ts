import { PinataSDK } from 'pinata-web3';
import { sampleImgsHashes } from './utils/pinata';
import { envVars } from '../utils/env-data';

const pinata = new PinataSDK({
  pinataJwt: envVars.PINATA_JWT,
  pinataGateway: envVars.PINATA_GATEWAY,
});

export const uploadImage = async (image: Express.Multer.File) => {
  if (process.env.NODE_ENV !== 'production') {
    const imgIndex = Math.floor(Math.random() * sampleImgsHashes.length);

    const data = {
      image: {
        IpfsHash: sampleImgsHashes[imgIndex],
        PinSize: 419402,
        Timestamp: new Date().toISOString(),
      },
      imgBaseUrl:
        'https://aquamarine-definite-canidae-414.mypinata.cloud/ipfs/',
    };

    return { data, error: null };
  }

  try {
    const file = new File([image.buffer], image.originalname, {
      type: image.mimetype,
    });

    const uploadedImage = await pinata.upload.file(file);

    const data = { image: { ...uploadedImage } };

    return { data, error: null };
  } catch (error) {
    console.log('_ ERROR __', error);
    return { data: null, error: 'Internal server error' };
  }
};

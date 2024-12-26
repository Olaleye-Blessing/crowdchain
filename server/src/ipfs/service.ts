import { ObjectManager } from '@filebase/sdk';
import { sampleIpfsImgs } from './utils/sample';
import { envVars } from '../utils/env-data';

const objectManager = new ObjectManager(
  envVars.FILEBASE_S3_KEY,
  envVars.FILEBASE_S3_SECRET,
  {
    bucket: envVars.FILEBASE_BUCKET_NAME,
  },
);

export const uploadImage = async (image: Express.Multer.File) => {
  if (process.env.NODE_ENV !== 'production') {
    const imgIndex = Math.floor(Math.random() * sampleIpfsImgs.length);

    const data = { image: sampleIpfsImgs[imgIndex] };

    return { data, error: null };
  }

  try {
    const upload = await objectManager.upload(
      image.originalname,
      image.buffer,
      undefined,
      undefined,
    );

    return {
      data: {
        image: `https://dark-scarlet-puma.myfilebase.com/ipfs/${upload.cid}`,
      },
      error: null,
    };
  } catch (error) {
    console.log('_ ERROR __', error);
    return { data: null, error: 'Internal server error' };
  }
};

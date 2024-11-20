import express from 'express';
import * as ipfsController from './controller';
import { imgsUpload } from '../utils/multer';

const router = express.Router();

router.post('/image', imgsUpload.single('image'), ipfsController.uploadImage);

export default router;

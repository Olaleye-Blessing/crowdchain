import { catchAsync } from '../utils/catch-async';
import { AppError } from '../utils/errors/app-error';
import { sendResponse } from '../utils/send-response';
import * as ipfsService from './service';

export const uploadImage = catchAsync(async (req, res, next) => {
  const image = req.file;

  if (!image) return next(new AppError('Provide an image', 400));

  const { data, error } = await ipfsService.uploadImage(image);

  if (data) return sendResponse(res, 201, data);

  return next(new AppError(error, 400));
});

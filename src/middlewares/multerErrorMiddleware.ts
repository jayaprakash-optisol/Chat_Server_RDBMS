import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import Logging from '../library/Logging';
import multer from 'multer';

export const multerError: ErrorRequestHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      Logging.error('file size should be below 5 MB');
      return res
        .status(400)
        .json({ message: 'file size should be below 5 MB' });
    }
  }
  next();
};

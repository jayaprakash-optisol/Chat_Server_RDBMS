import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { config } from '../config/config';
import Logging from '../library/Logging';

const userRepository = AppDataSource.getRepository(User);

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decodedToken: any = jwt.verify(token, config.jwt.secret);

      req.user = await userRepository.findOne({
        where: { id: decodedToken.id },
      });

      next();
    } catch (error) {
      Logging.error(error);
      res.status(401).json({ message: 'Not Authorized token failed' });
    }
  }
  if (!token) {
    return res.status(401).json({ message: 'Authorization failed no token' });
  }
};

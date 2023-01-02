import { NextFunction, Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import { User } from '../entity/User';
import { AppDataSource } from '../data-source';
import { v4 as uuidv4 } from 'uuid';

import { generateToken } from '../config/generateToken';
import Logging from '../library/Logging';
import { Like } from 'typeorm';

const userRepository = AppDataSource.getRepository(User);

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password, profilePhoto } = req.body;

  if (!name || !email || !password) {
    return res.status(404).send({ message: 'Please enter all the fields' });
  }

  const isUserExists = await userRepository.findOne({
    where: { email },
  });

  if (isUserExists) {
    return res.status(400).send({ message: 'User already exists' });
  }

  const hashedPassword = await bcryptjs.hash(password, 10);

  const user = await userRepository.save({
    id: uuidv4(),
    name,
    email,
    password: hashedPassword,
    profilePhoto: profilePhoto || '',
  });
  if (user) {
    const { name, email, profilePhoto } = user;
    res.status(201).json({
      name,
      email,
      profilePhoto,
      token: await generateToken(user.id),
    });
  } else {
    res.status(400).send({ message: 'failed to create user' });
  }
};

// api/user?search={{username || email}}
const fetchUsers = async (req: Request, res: Response) => {
  try {
    const keyword: any = req.query?.search
      ? {
          where: [
            { name: Like(`%${req.query?.search}%`) },
            { email: Like(`%${req.query?.search}%`) },
          ],
        }
      : {};

    const users = (await userRepository.find(keyword)).filter(
      (user) => user.id !== req.user?.id
    );

    res.status(200).send({ users });
  } catch (error) {
    Logging.error(error);
    res.status(404).send({ message: 'Failed to retrieve users' });
  }
};

const fetchUser = async (req: Request, res: Response) => {
  try {
    const user = await userRepository.findOne({ where: { id: req.params.id } });

    res.status(200).send(user);
  } catch (error) {
    Logging.error(error);
    res.status(404).send({ message: 'Failed to retrieve users' });
  }
};

const authUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = await userRepository.findOne({
      select: [
        'id',
        'name',
        'email',
        'password',
        'isAdmin',
        'profilePhoto',
        'createdAt',
        'updatedAt',
      ],
      where: { email },
    });
    if (user && (await bcryptjs.compare(password, user?.password))) {
      Logging.info('User Authenticated Successfully');
      res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto,
        token: await generateToken(user.id),
      });
    } else {
      Logging.error('Invalid Credentials');
      res.status(401).json({ message: 'Invalid Credentials' });
    }
  } catch (error) {
    Logging.error(error);
    res.status(401).json({ message: 'Authorization failed' });
  }
};

export default { registerUser, fetchUsers, authUser, fetchUser };

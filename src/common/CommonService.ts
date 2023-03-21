import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { Request, Response } from 'express';
import Logging from '../library/Logging';
import { In } from 'typeorm';

const userRepository = AppDataSource.getRepository(User);

export const fetchUserById = async (id: number) => {
  try {
    const loggedUser = await userRepository.findOneOrFail({
      where: { id },
    });
    return loggedUser;
  } catch (error) {
    Logging.error(error);
    return error;
  }
};

export const fetchUsersByIds = async (ids: []) => {
  try {
    let users = await userRepository.findBy({
      id: In(ids),
    });
    return users;
  } catch (error) {
    Logging.error(error);
    return error;
  }
};

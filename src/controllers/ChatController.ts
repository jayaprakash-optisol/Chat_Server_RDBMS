import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { Chat } from '../entity/Chat';
import Logging from '../library/Logging';
import { fetchUserById, fetchUsersByIds } from '../common/CommonService';

const chatRepository = AppDataSource.getRepository(Chat);
const userRepository = AppDataSource.getRepository(User);

const accessChat = async (req: Request, res: Response) => {
  const { userId } = req.body;
  console.log('userId', userId);

  const chatIds = [req.user.id, userId];

  if (!userId) {
    Logging.error('UserId not found in request');
    return res.status(400).json({ message: 'UserId not found' });
  }

  let isChat = await chatRepository
    .createQueryBuilder('chat')
    .leftJoinAndSelect('chat.users', 'user')
    .leftJoinAndSelect('chat.latestMessages', 'message')
    .leftJoinAndSelect('chat.groupAdmin', 'admin')
    .where('user.id IN (:...userIds)', { userIds: chatIds })
    .andWhere('user.id IN (:...userIds)', { userIds: chatIds })
    .getOne()
    .then((res: any) => res)
    .catch((error) => res.status(404).json(error));

  if (isChat && isChat?.users?.length > 1) {
    res.send(isChat);
  } else {
    try {
      const loggedUser = await userRepository.findOneOrFail({
        where: { id: req.user.id },
      });

      const userToChat = await userRepository.findOneOrFail({
        where: { id: userId },
      });

      const chat = new Chat();
      chat.chatName = 'sender';
      chat.isGroupChat = false;
      chat.users = [loggedUser, userToChat];

      await AppDataSource.manager.save(chat);
      res.status(200).json(chat);
    } catch (error) {
      Logging.error(error);
      res.status(401).json({ message: error });
    }
  }
};

const fetchChats = async (req: Request, res: Response) => {
  try {
    const chats = await chatRepository.find({
      relations: {
        users: true,
        groupAdmin: true,
      },
      order: {
        updatedAt: 'DESC',
      },
    });

    const updatedChats = Array.from(
      chats?.map((chat) => {
        const [x] = chat.users
          ?.map((user) => user.id === req.user.id && chat)
          .filter((i) => i !== false);
        if (x) return x;
      }),
    ).filter((e) => e !== undefined);

    res.status(200).json(updatedChats);
  } catch (error) {
    Logging.error(error);
    res.status(400).json({ message: 'Failed to fetch chats' });
  }
};

const createGroupChat = async (req: Request, res: Response) => {
  const { users, name } = req.body;
  if (!users || !name) {
    return res.status(404).json({ message: 'All fields are required' });
  }
  let parsedUserIds = JSON.parse(users);

  try {
    const loggedUser: any = await fetchUserById(req.user.id);
    const groupChatUsers: any = await fetchUsersByIds(parsedUserIds);

    if (groupChatUsers && groupChatUsers?.length < 2) {
      return res
        .status(400)
        .json({ message: 'Two users are required for group chat' });
    }
    if (!loggedUser) return res.status(400).json('User not found');
    const groupChat = new Chat();
    groupChat.chatName = name;
    groupChat.groupAdmin = loggedUser;
    groupChat.users = [...groupChatUsers, loggedUser];
    groupChat.isGroupChat = true;

    await AppDataSource.manager.save(groupChat);
    res.status(201).json(groupChat);
  } catch (error) {
    Logging.error(error);
    res.status(400).json({ error, message: 'Failed to create group chat' });
  }
};

const renameGroup = async (req: Request, res: Response) => {
  const { chatId, chatName } = req.body;
  try {
    const updatedChat = await chatRepository.findOneOrFail({
      where: { id: chatId },
      relations: {
        users: true,
        groupAdmin: true,
      },
    });
    updatedChat.chatName = chatName;
    await AppDataSource.manager.save(updatedChat);
    res.status(201).json(updatedChat);
  } catch (error) {
    Logging.error(error);
    res.status(400).json({ message: 'failed to rename group', error });
  }
};

const addToGroup = async (req: Request, res: Response) => {
  const { chatId, userId } = req.body;

  try {
    const updatedChat = await chatRepository.findOneOrFail({
      where: { id: chatId },
      relations: {
        users: true,
        groupAdmin: true,
      },
    });

    const userToAdd: any = await fetchUserById(userId);
    const isUserExists = updatedChat.users.some((user) => user.id === userId);

    if (isUserExists)
      return res.status(400).json({ message: 'User already exists in group' });

    updatedChat.users.push(userToAdd);
    await AppDataSource.manager.save(updatedChat);
    res.status(201).json(updatedChat);
  } catch (error) {
    Logging.error(error);
    res.status(400).json({ message: 'failed to add user to group', error });
  }
};

const removeFromGroup = async (req: Request, res: Response) => {
  const { chatId, userId } = req.body;

  try {
    const updatedChat = await chatRepository.findOneOrFail({
      where: { id: chatId },
      relations: {
        users: true,
        groupAdmin: true,
      },
    });

    const updatedUsers = updatedChat?.users.filter(
      (user) => user.id !== userId,
    );
    updatedChat.users = updatedUsers;

    await AppDataSource.manager.save(updatedChat);

    res.status(201).json(updatedChat);
  } catch (error) {
    Logging.error(error);
    res
      .status(400)
      .json({ message: 'failed to remove user from group', error });
  }
};

export default {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};

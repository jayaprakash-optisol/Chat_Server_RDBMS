import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Chat } from '../entity/Chat';
import { Message } from '../entity/Message';
import Logging from '../library/Logging';
import { fetchUserById } from '../common/CommonService';

const messageRepository = AppDataSource.getRepository(Message);
const chatRepository = AppDataSource.getRepository(Chat);

const sendMessage = async (req: Request, res: Response) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    Logging.error('Invalid data passed');
    return res.status(404).json({ message: 'Invalid data passed' });
  }

  try {
    const sender: any = await fetchUserById(req.user.id);
    const chat = await chatRepository.findOneOrFail({
      where: { id: chatId },
      relations: {
        users: true,
        groupAdmin: true,
      },
    });

    const message = new Message();
    message.sender = sender;
    message.content = content;
    message.chat = chat;

    await AppDataSource.manager.save(message);
    chat.latestMessageId = message.id;
    await AppDataSource.manager.save(chat);

    res.status(201).json({ ...message, chat: { ...chat } });
  } catch (error) {
    Logging.error(error);
    return res.status(400).json({ message: 'failed to send message', error });
  }
};

const allMessages = async (req: Request, res: Response) => {
  try {
    const messages = await messageRepository.find({
      where: {
        chat: {
          id: req.params.chatId,
        },
      },
      relations: {
        chat: {
          users: true,
          latestMessages: true,
          groupAdmin: true,
        },
        sender: true,
      },
    });

    res.status(201).json(messages);
  } catch (error) {
    Logging.error(error);
    return res.status(400).json({ message: 'failed to fetch messages', error });
  }
};

export default {
  sendMessage,
  allMessages,
};

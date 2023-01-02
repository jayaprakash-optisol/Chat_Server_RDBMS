import { Server, Socket } from 'socket.io';
import { config } from '../config/config';
import Logging from '../library/Logging';

const socketConnection = async (server: any) => {
  const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: config.server.socket_url,
    },
  });

  io.on('connection', (socket: Socket) => {
    Logging.info('<-- Connected to socket -->');

    socket.on('setup', (userData) => {
      socket.join(userData.id);
      socket.emit('Connected');
    });

    socket.on('join chat', (room) => {
      socket.join(room);
      Logging.info(`User joined room ${room}`);
    });

    socket.on('typing', (room) => {
      socket.in(room).emit('typing');
    });
    socket.on('typing stopped', (room) => {
      socket.in(room).emit('typing stopped');
    });

    socket.on('new message', (newMessage) => {
      let chat = newMessage.chat;
      if (!chat?.users) return Logging.warn('No Users');

      chat?.users?.forEach((user: any) => {
        if (user.id === newMessage.sender.id) return;

        socket.in(user.id).emit('message received', newMessage);
      });
    });

    socket.off('setup', (userData) => {
      Logging.info('User Disconnected');
      socket.leave(userData.id);
    });
  });
};

export { socketConnection };

import {
  beforeAll,
  describe,
  expect,
  it,
  jest,
  afterAll,
  afterEach,
} from '@jest/globals';
import request from 'supertest';
import { Express } from 'express';
import { AppDataSource } from '../data-source';
import { app, server } from '../server';
import { Chat } from '../entity/Chat';
import { User } from '../entity/User';

describe('Chat Controller', () => {
  let mockServer: Express;
  let token: string;
  let requestPromise: request.Test;
  let chatRepository: any;
  let userRepository: any;

  beforeAll(async () => {
    mockServer = app;
    await AppDataSource.initialize();
    chatRepository = AppDataSource.getRepository(Chat);
    userRepository = AppDataSource.getRepository(User);

    requestPromise = request(mockServer).post('/api/user/login').send({
      email: 'jai@123.com',
      password: 'test123',
    });
    const res = await requestPromise;
    token = res.body.token || '';
  });

  afterEach(async () => {
    jest.clearAllMocks();
    if (requestPromise) {
      requestPromise.abort();
    }
  });

  afterAll(async () => {
    await AppDataSource.destroy();
    await server.close();
  });

  it('Fetch Chats', async () => {
    requestPromise = request(mockServer)
      .get('/api/chat/fetch')
      .set('Authorization', `Bearer ${token}`);

    const res = await requestPromise;
    expect(res.status).toEqual(200);
  });

  it('should get authorization error', async () => {
    requestPromise = request(mockServer).get('/api/chat/fetch');
    // .set('Authorization', `Bearer ${token}`);

    const res = await requestPromise;
    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual({ message: 'Authorization failed no token' });
  });
});

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
import { User } from '../entity/User';

describe('User Controller', () => {
  let mockServer: Express;
  let token: string;
  let requestPromise: request.Test;
  let userRepository: any;

  beforeAll(async () => {
    mockServer = app;
    await AppDataSource.initialize();
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
    await userRepository.delete({ email: 'jestTest@test.com' });
    await server.close();
    await AppDataSource.destroy();
  });

  it('should get invalid credentials', async () => {
    requestPromise = request(mockServer).post('/api/user/login').send({
      email: 'jai@123.com',
      password: 'test123_4',
    });
    const res = await requestPromise;
    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual({ message: 'Invalid Credentials' });
  });

  it('Fetch Users', async () => {
    requestPromise = request(mockServer)
      .get('/api/user/fetch')
      .set('Authorization', `Bearer ${token}`)
      .query('search=u');
    const res = await requestPromise;
    expect(res.statusCode).toEqual(200);
  });

  it('Register User', async () => {
    requestPromise = request(mockServer).post('/api/user/register').send({
      name: 'jest-test',
      email: 'jestTest@test.com',
      password: 'test123',
    });
    const res = await requestPromise;
    expect(res.statusCode).toEqual(201);
  });

  it('should return error 404 all fields are required', async () => {
    requestPromise = request(mockServer).post('/api/user/register').send({
      name: 'jest-test',
      email: 'jestTest@test.com',
      // password: 'test123',
    });
    const res = await requestPromise;
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ message: 'Please enter all the fields' });
  });

  it('should return user already exists', async () => {
    requestPromise = request(mockServer).post('/api/user/register').send({
      name: 'jest-test',
      email: 'jestTest@test.com',
      password: 'test123',
    });
    const res = await requestPromise;
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({ message: 'User already exists' });
  });
});

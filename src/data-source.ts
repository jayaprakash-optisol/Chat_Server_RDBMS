import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from './config/config';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: config.mysql.host,
  port: config.mysql.port,
  username: config.mysql.username,
  password: config.mysql.password,
  database: config.mysql.database,
  synchronize: false,
  logging: false,
  entities: ['src/entity/**/*.ts'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
});

AppDataSource.initialize()
  .then(async () => {
    console.log('<-- Database Initialized -->');
  })
  .catch((error) => console.log(error));

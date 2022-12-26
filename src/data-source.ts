import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from './config/config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.pgsql.host,
  port: config.pgsql.port,
  username: config.pgsql.username,
  password: config.pgsql.password,
  database: config.pgsql.database,
  synchronize: true,
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

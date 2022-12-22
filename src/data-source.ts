import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'dev',
  password: 'Local@123',
  database: 'chat_app',
  synchronize: true,
  logging: false,
  entities: ['src/entity/**/*.ts'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  // migrationsTableName: 'migrations',
});

AppDataSource.initialize()
  .then(async () => {
    // console.log('Initialized Database');
  })
  .catch((error) => console.log(error));

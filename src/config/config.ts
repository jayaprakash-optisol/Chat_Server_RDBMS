import dotenv from 'dotenv';
dotenv.config();

const PGSQL_USERNAME: string = process.env.PGSQL_USERNAME || '';
const PGSQL_PASSWORD: any = process.env.PGSQL_PASSWORD || '';
const PGSQL_DATABASE_NAME: any = process.env.PGSQL_DATABASE_NAME || '';
const PGSQL_HOST: any = process.env.PGSQL_HOST || '';
const PGSQL_PORT: any = process.env.PGSQL_PORT || '';

const STAGE: any = process.env.STAGE || 'development';

const JWT_SECRET: any = process.env.JWT_SECRET;

const SERVER_PORT: number = Number(process.env.SERVER_PORT) || 5000;
const SOCKET_URL: string = process.env.SOCKET_URL || '';

export const config = {
  stage: STAGE,
  pgsql: {
    host: PGSQL_HOST,
    username: PGSQL_USERNAME,
    password: PGSQL_PASSWORD,
    database: PGSQL_DATABASE_NAME,
    port: parseInt(PGSQL_PORT),
  },
  server: {
    port: SERVER_PORT,
    socket_url: SOCKET_URL,
  },
  jwt: {
    secret: JWT_SECRET,
  },
};

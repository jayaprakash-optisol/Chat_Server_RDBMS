import dotenv from 'dotenv';
dotenv.config();

const MYSQL_USERNAME: string = process.env.MYSQL_USERNAME || '';
const MYSQL_PASSWORD: any = process.env.MYSQL_PASSWORD || '';
const MYSQL_DATABASE_NAME: any = process.env.MYSQL_DATABASE_NAME || '';
const MYSQL_HOST: any = process.env.MYSQL_HOST || '';
const MYSQL_PORT: any = process.env.MYSQL_PORT || '';

const STAGE: any = process.env.STAGE || 'development';

const JWT_SECRET: any = process.env.JWT_SECRET;

const SERVER_PORT: number = Number(process.env.SERVER_PORT) || 5000;
const SOCKET_URL: string = process.env.SOCKET_URL || '';

const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
const BUCKET_NAME = process.env.BUCKET_NAME;
const AWS_REGION = process.env.AWS_REGION;

export const config = {
  stage: STAGE,
  mysql: {
    host: MYSQL_HOST,
    username: MYSQL_USERNAME,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE_NAME,
    port: parseInt(MYSQL_PORT),
  },
  server: {
    port: SERVER_PORT,
    socket_url: SOCKET_URL,
  },
  jwt: {
    secret: JWT_SECRET,
  },
  aws: {
    access_id: AWS_ACCESS_KEY,
    secret_key: AWS_SECRET_KEY,
    bucket_name: BUCKET_NAME,
    region: AWS_REGION,
  },
};

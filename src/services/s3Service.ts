import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { config } from '../config/config';
import { v4 as uuidv4 } from 'uuid';

export const s3Upload = async (files: any[]) => {
  const accessKeyId: any = config.aws.access_id;
  const secretAccessKey: any = config.aws.secret_key;
  const region: any = config.aws.region;

  const s3Client = new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  const params = files.map((file: any) => {
    return {
      Bucket: config.aws.bucket_name,
      Key: `uploads/${uuidv4()}-${file.originalname}`,
      Body: file.buffer,
    };
  });

  return await Promise.all(
    params.map((param) => s3Client.send(new PutObjectCommand(param)))
  );
};

export const checkBucket = async (bucket: string) => {
  try {
  } catch (error) {}
};

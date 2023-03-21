import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { config } from '../config/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

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

  if (!files) return;

  const params = files?.map((file: any) => {
    return {
      Bucket: config.aws.bucket_name,
      Key: `uploads/${file.originalname}`,
      Body: file.buffer,
    };
  });

  return await Promise.all(
    params?.map(async (param) => {
      try {
        const isUploaded = await s3Client.send(new PutObjectCommand(param));

        if (isUploaded) {
          const command = new GetObjectCommand({
            Bucket: param.Bucket,
            Key: param.Key,
          });

          const signedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 600,
          });

          return {
            Key: param.Key,
            url: signedUrl,
          };
        }
      } catch (error) {
        return error;
      }
    }),
  );
};

export const checkBucket = async (bucket: string) => {
  try {
  } catch (error) {}
};

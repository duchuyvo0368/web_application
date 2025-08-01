// src/upload/s3-multipart.util.ts
import {
    S3Client,
    CreateMultipartUploadCommand,
    UploadPartCommand,
    CompleteMultipartUploadCommand,
    CompletedPart,
    AbortMultipartUploadCommand
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { config } from 'dotenv';

config();

const s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export const initiateMultipartUpload = async (Key: string, ContentType: string) => {
    const command = new CreateMultipartUploadCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key,
        ContentType,
    });

    const response = await s3.send(command);
    return response.UploadId!;
};

export const uploadPart = async (
    Key: string,
    uploadId: string,
    partNumber: number,
    body: Buffer,
) => {
    const command = new UploadPartCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key,
        UploadId: uploadId,
        PartNumber: partNumber,
        Body: Readable.from(body),
    });

    const response = await s3.send(command);
    return response.ETag!;
};

export const completeMultipartUpload = async (
    Key: string,
    uploadId: string,
    parts: CompletedPart[],
) => {
    const command = new CompleteMultipartUploadCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key,
        UploadId: uploadId,
        MultipartUpload: {
            Parts: parts,
        },
    });

    return await s3.send(command);
};

export const abortMultipartUpload = async (Key: string, uploadId: string) => {
    const command = new AbortMultipartUploadCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key,
        UploadId: uploadId,
    });

    return await s3.send(command);
};

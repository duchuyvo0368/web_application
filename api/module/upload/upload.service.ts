import { Injectable, BadRequestException, Inject, forwardRef, InternalServerErrorException } from '@nestjs/common';
import { UserService } from './../user/user.service';
import { MulterS3File } from './utils/multe.s3.file';
import { SuccessResponse } from '../../utils/success.response';
import { abortMultipartUpload, completeMultipartUpload, initiateMultipartUpload, uploadPart } from './utils/s3-multipart.util';
import { Readable } from 'stream';
import {
    S3Client,
    CreateMultipartUploadCommand,
    UploadPartCommand,
    CompleteMultipartUploadCommand,
    AbortMultipartUploadCommand,
    CompletedPart,
} from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as path from 'path';
import { s3 } from './utils/multer.config'
@Injectable()
export class UploadService {
    constructor() { }

    private generateFileUrl(file: MulterS3File): string {
        if (file.location) return file.location; // S3
        const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
        return `${baseUrl}/uploads/${file.filename}`; // Local fallback
    }

    async handleUpload(file: MulterS3File, type: string) {
        if (!file) throw new BadRequestException('No file uploaded');

        const fileUrl = this.generateFileUrl(file);

        return new SuccessResponse({
            message: `${type} image uploaded successfully`,
            metadata: {
                url: fileUrl,
                key: file.key || file.filename,
                originalName: file.originalname,
                size: file.size,
                mimetype: file.mimetype,
                bucket: file.bucket || 'local',
            },
        });
    }



    async uploadFileToS3Multipart(
        filePath: string,
        key: string,
        contentType: string,
    ): Promise<string> {
        const Bucket = process.env.AWS_BUCKET_NAME!;
        const fileBuffer = fs.readFileSync(filePath);
        const partSize = 5 * 1024 * 1024; // 5MB
        const fileSize = fileBuffer.length;
        const totalParts = Math.ceil(fileSize / partSize);

        let uploadId: string | undefined;
        const parts: CompletedPart[] = [];

        try {
            const initiateRes = await s3.send(
                new CreateMultipartUploadCommand({ Bucket, Key: key, ContentType: contentType }),
            );
            uploadId = initiateRes.UploadId!;

            for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
                const start = (partNumber - 1) * partSize;
                const end = Math.min(start + partSize, fileSize);
                const partBuffer = fileBuffer.slice(start, end);

                const uploadPartRes = await s3.send(
                    new UploadPartCommand({
                        Bucket,
                        Key: key,
                        UploadId: uploadId,
                        PartNumber: partNumber,
                        Body: Readable.from(partBuffer),
                    }),
                );

                parts.push({
                    ETag: uploadPartRes.ETag!,
                    PartNumber: partNumber,
                });
            }

            await s3.send(
                new CompleteMultipartUploadCommand({
                    Bucket,
                    Key: key,
                    UploadId: uploadId,
                    MultipartUpload: { Parts: parts },
                }),
            );

            return `https://${Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        } catch (err) {
            if (uploadId) {
                await s3.send(
                    new AbortMultipartUploadCommand({
                        Bucket,
                        Key: key,
                        UploadId: uploadId,
                    }),
                );
            }

            throw new Error('Multipart upload failed');
        }
    }
}

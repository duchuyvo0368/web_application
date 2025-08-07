// upload.controller.ts
import {
    Controller,
    Post,
    UploadedFiles,
    UseInterceptors,
    BadRequestException,
    UseGuards,
    Body,
    Get,
    Query,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadService } from './upload.service';
import { AuthGuard } from 'module/auth/guards/access-token.guard';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

   
    @Post('create-multipart')
    @ApiOperation({ summary: 'Create a multipart upload session' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                fileName: { type: 'string', example: 'my-video.mp4' },
                contentType: { type: 'string', example: 'video/mp4' },
            },
            required: ['fileName', 'contentType'],
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Multipart upload session created',
    })
    async createMultipart(@Body() body: { fileName: string; contentType: string }) {
        return this.uploadService.createMultipartUpload(body.fileName, body.contentType);
    }

    @Get('presigned-url')
    @ApiOperation({ summary: 'Get a presigned URL to upload a specific part' })
    @ApiQuery({ name: 'uploadId', type: String, required: true })
    @ApiQuery({ name: 'key', type: String, required: true })
    @ApiQuery({ name: 'partNumber', type: String, required: true, example: '1' })
    @ApiQuery({ name: 'contentType', type: String, required: false })
    @ApiResponse({
        status: 200,
        description: 'Presigned URL generated',
        schema: {
            type: 'object',
            properties: {
                url: {
                    type: 'string',
                    example: 'https://s3.amazonaws.com/bucket/uploads/my-video.mp4?partNumber=1&...',
                },
            },
        },
    })
    async getPresignedUrl(
        @Query('uploadId') uploadId: string,
        @Query('key') key: string,
        @Query('partNumber') partNumber: string,
    ) {
        return {
            url: await this.uploadService.getPresignedUrl(uploadId, key, parseInt(partNumber)),
        };
    }

    @Post('complete-multipart')
    @ApiOperation({ summary: 'Complete the multipart upload' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                key: { type: 'string', example: 'uploads/my-video.mp4' },
                uploadId: { type: 'string', example: 'ABC123UPLOADID' },
                parts: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            ETag: { type: 'string', example: '"etag-123abc456def"' },
                            PartNumber: { type: 'number', example: 1 },
                        },
                        required: ['ETag', 'PartNumber'],
                    },
                },
            },
            required: ['key', 'uploadId', 'parts'],
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Multipart upload completed successfully',
        schema: {
            type: 'object',
            properties: {
                location: {
                    type: 'string',
                    example: 'https://s3.amazonaws.com/bucket/uploads/my-video.mp4',
                },
            },
        },
    })
    async complete(@Body() body: { key: string; uploadId: string; parts: { ETag: string; PartNumber: number }[] }) {
        return {
            location: await this.uploadService.completeMultipartUpload(body.key, body.uploadId, body.parts),
        };
    }
}



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

@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

   
    @Post('create-multipart')
    async createMultipart(@Body() body: { fileName: string; contentType: string }) {
        return this.uploadService.createMultipartUpload(body.fileName, body.contentType);
    }

    @Get('presigned-url')
    async getPresignedUrl(
        @Query('uploadId') uploadId: string,
        @Query('key') key: string,
        @Query('partNumber') partNumber: string,
        @Query('contentType') contentType: string,
    ) {
        return {
            url: await this.uploadService.getPresignedUrl(uploadId, key, parseInt(partNumber)),
        };
    }

    @Post('complete-multipart')
    async complete(@Body() body: { key: string; uploadId: string; parts: { ETag: string; PartNumber: number }[] }) {
        return {
            location: await this.uploadService.completeMultipartUpload(body.key, body.uploadId, body.parts),
        };
    }
}



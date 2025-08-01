// upload.controller.ts
import {
    Controller,
    Post,
    UploadedFiles,
    UseInterceptors,
    BadRequestException,
    UseGuards,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadService } from './upload.service';
import { AuthGuard } from 'module/auth/guards/access-token.guard';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    // @Post('multipart')
    // @UseGuards(AuthGuard)
    // @UseInterceptors(
    //     AnyFilesInterceptor({
    //         storage: diskStorage({
    //             destination: './uploads',
    //             filename: (req, file, cb) => {
    //                 const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    //                 cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
    //             },
    //         }),
    //         limits: {
    //             fileSize: 100 * 1024 * 1024, // 100MB mỗi file
    //             files: 10, // tối đa 10 file/lần
    //         },
    //     }),
    // )
    // @Post('create-multipart')
    // async createMultipart(@Body() body: { fileName: string; contentType: string }) {
    //     return this.uploadService.createMultipartUpload(body.fileName, body.contentType);
    // }

    // @Get('presigned-url')
    // async getPresignedUrl(
    //     @Query('uploadId') uploadId: string,
    //     @Query('key') key: string,
    //     @Query('partNumber') partNumber: string,
    //     @Query('contentType') contentType: string,
    // ) {
    //     return {
    //         url: await this.uploadService.getPresignedUrl(uploadId, key, parseInt(partNumber), contentType),
    //     };
    // }

    // @Post('complete-multipart')
    // async complete(@Body() body: { key: string; uploadId: string; parts: { ETag: string; PartNumber: number }[] }) {
    //     return {
    //         location: await this.uploadService.completeMultipartUpload(body.key, body.uploadId, body.parts),
    //     };
    // }
}

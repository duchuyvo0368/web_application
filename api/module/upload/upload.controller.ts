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

    @Post('multipart')
    @UseGuards(AuthGuard)
    @UseInterceptors(
        AnyFilesInterceptor({
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
                },
            }),
            limits: {
                fileSize: 100 * 1024 * 1024, // 100MB mỗi file
                files: 10, // tối đa 10 file/lần
            },
        }),
    )
    async uploadMultipart(@UploadedFiles() files: Express.Multer.File[]) {
        if (!files || files.length === 0) {
            throw new BadRequestException('No files uploaded');
        }

        const results = await Promise.all(
            files.map(async (file) => {
                const key = `posts/${file.filename}`;
                const url = await this.uploadService.uploadFileToS3Multipart(
                    file.path,
                    key,
                    file.mimetype,
                );
                return { url };
            }),
        );

        return {
            message: 'Upload success',
            files: results,
        };
    }
}

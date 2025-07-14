// src/upload/upload.controller.ts
import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    BadRequestException,
    Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';
import * as multer from 'multer';
import { storage } from './utils/multer.config'; 
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '../../utils/success.response';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
    @ApiOperation({ summary: 'Upload avatar' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @Post('avatar')
    @UseInterceptors(
        FileInterceptor('file', {
            storage,
            limits: { fileSize: 10 * 1024 * 1024 }, // 3MB
            fileFilter(req, file, cb) {
                const allowedExt = ['.jpeg', '.jpg', '.png', '.gif'];
                const ext = path.extname(file.originalname).toLowerCase();
                if (!allowedExt.includes(ext)) {
                    return cb(new Error(`Định dạng không hỗ trợ: ${ext}`), false);
                }
                cb(null, true);
            },
        }),
    )
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) throw new BadRequestException('Không có file nào được gửi');
        return new SuccessResponse({
            message: 'Followed successfully',
            metadata: {
                filename: file.filename,
                originalname: file.originalname,
                size: file.size,
                path: file.path,
            }
        });
        
    }
    
}
  
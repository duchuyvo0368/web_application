// src/upload/upload.controller.ts
import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    UseGuards,
    Req,
    Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiBody,
    ApiConsumes,
    ApiOperation,
    ApiTags,
    ApiBearerAuth,
    ApiParam,
} from '@nestjs/swagger';
import { uploadConfig } from './utils/multer.config';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { UploadService } from './upload.service';
import { NotFoundError } from 'utils/error.response';

interface MulterS3File extends Express.Multer.File {
    key?: string;
    location?: string;
    bucket?: string;
    etag?: string;
}

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    @Post('/:type')
    @ApiOperation({ summary: 'Upload file by type (avatar, post, ...)' })
    @ApiParam({
        name: 'type',
        required: true,
        description: 'Type of image (avatar, post, cover, etc.)',
    })
    @ApiConsumes('multipart/form-data')
    @ApiBearerAuth()
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Image file (JPEG, PNG, GIF, WebP) - Max 5MB',
                },
            },
            required: ['file'],
        },
    })
    @UseGuards(AccessTokenGuard)
    @UseInterceptors(FileInterceptor('file', uploadConfig))
    async uploadFile(
        @Param('type') type: string,
        @UploadedFile() file: MulterS3File,
        @Req() req: any,
    ) {
        if (type!== 'avatar' && type !== 'post') {
            return new NotFoundError(`Invalid upload type: ${type}. Allowed types are 'avatar' and 'post'.`);
        }
        return this.uploadService.handleUpload(file, req.user.userId, type);
      
    }
}

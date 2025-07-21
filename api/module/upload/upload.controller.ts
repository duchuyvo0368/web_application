// src/upload/upload.controller.ts
import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    UseGuards,
    Req,
    Param,
    Body,
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
import { UploadService } from './upload.service';
import { NotFoundError } from 'utils/error.response';
import { AuthGuard } from 'module/auth/guards/access-token.guard';
import { UserService } from 'module/user/user.service';

interface MulterS3File extends Express.Multer.File {
    key?: string;
    location?: string;
    bucket?: string;
    etag?: string;
}

@ApiTags('User')
@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService, private readonly userService: UserService) { }

    @Post()
    @ApiOperation({ summary: 'Upload file (avatar or post)' })
    @ApiConsumes('multipart/form-data')
    @ApiBearerAuth()
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                type: {
                    type: 'avatar',
                    description: "Upload type (avatar or post)"
                },
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Image file (JPEG, PNG, etc.) - Max 5MB'
                }
            },
            required: ['file', 'type']
        }
    })
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('file', uploadConfig))
    async uploadFile(
        @Body('type') type: string,
        @UploadedFile() file: MulterS3File,
        @Req() req: any
    ) {
        if (type !== 'avatar' && type !== 'post') {
            return new NotFoundError(`Invalid upload type: ${type}. Allowed types are 'avatar' and 'post'.`);
        }
        // if (!isAdmin && userId && userId !== currentUserId) {
        //     throw new ForbiddenException("You don't have permission to upload for another user.");
        // }

        const uploadResult = await this.uploadService.handleUpload(file, type, req.user.userId);


        return uploadResult;

    }

}

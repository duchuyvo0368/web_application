// src/upload/upload.module.ts
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { UserModule } from 'module/user/user_module';

@Module({
    imports: [MulterModule.register({}), UserModule],
    controllers: [UploadController],
    providers: [UploadService],
})
export class UploadModule { }

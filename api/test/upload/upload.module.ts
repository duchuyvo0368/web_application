// src/upload/upload.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { UserModule } from 'module/user/user_module';
import { AuthModule } from 'module/auth/module.auth';
import { UploadController } from './upload.controller';

@Module({
    imports: [MulterModule.register({})],
    providers: [UploadService],
    controllers:[UploadController],
    exports: [UploadService]
})
export class UploadModule { }

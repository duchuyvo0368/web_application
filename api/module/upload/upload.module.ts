// src/upload/upload.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { UserModule } from 'module/user/user_module';
import { AuthModule } from 'module/auth/module.auth';

@Module({
    imports: [MulterModule.register({}), UserModule,forwardRef(() => AuthModule)],
    controllers: [UploadController],
    providers: [UploadService],
})
export class UploadModule { }

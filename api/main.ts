import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();
import { AllExceptionsFilter } from './utils/asyncHandler';
import { checkOverload, countConnect } from './module/helpers/check.connect';
import { GlobalExceptionFilter } from './utils/index';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('v1/api');
    //app.use(checkOverload);
    //app.use(countConnect)
    app.enableCors({
        origin: 'http://localhost:3000',
        credentials: true,
    });
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.use(cookieParser());
    const config = new DocumentBuilder()
        .setTitle('Social Network API')
        .setDescription('API mô tả các chức năng mạng xã hội')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
    await app.listen(5000);
}
bootstrap();





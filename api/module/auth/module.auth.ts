// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from '../user/user.model'; // hoặc đường dẫn đúng tới user.model
import { KeyTokenModule } from '../token/keyToken.module';
import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@Module({
    imports: [
        MongooseModule.forFeature(
            [{ name: User.name, schema: UserSchema }],
            'MONGODB_CONNECTION',
        ),
        JwtModule.register({}), 
        KeyTokenModule, 
    ],
    controllers: [AuthController],
    providers: [AuthService, AccessTokenGuard, RefreshTokenGuard],
    exports: [
        RefreshTokenGuard,
        RefreshTokenGuard,
        AuthService,              
        MongooseModule,          
    ],
})
export class AuthModule { }

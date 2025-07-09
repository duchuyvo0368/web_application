
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.model';
import { User } from './user.model';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import config from '../database/config';
import { AuthModule } from '../auth/module.auth';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },

        ], 'MONGODB_CONNECTION'), AuthModule
    ],
    controllers: [UserController],
    providers: [
        UserService,
    ],
    exports: [MongooseModule],
})
export class UserModule { }

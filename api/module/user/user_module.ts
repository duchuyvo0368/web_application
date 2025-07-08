
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.model';
import { User } from './user.model';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import config from '../database/config';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },

        ], 'MONGODB_CONNECTION')
    ],
    controllers: [UserController],
    providers: [
        UserService,
    ],
    exports: [MongooseModule],
})
export class UserModule { }

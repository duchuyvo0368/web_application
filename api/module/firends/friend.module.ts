import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendRelation, FriendSchema } from './friend.model';
import { FriendsController } from './friends.controller';
import { FriendService } from './friends.service';
import config from '../database/config';
import { AuthModule } from '../auth/module.auth';
import { UserModule } from '../user/user.module';
import { FriendRepository } from './friend.repository';
import { NotificationsModule } from 'module/notification/notification.module';

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: FriendRelation.name,
                    schema: FriendSchema,
                },
            ],
            'MONGODB_CONNECTION',
        ),
        forwardRef(() => AuthModule),
        forwardRef(() => UserModule),
        forwardRef(() => NotificationsModule),
    ],
    controllers: [FriendsController],
    providers: [FriendService, FriendRepository],
    exports: [MongooseModule, FriendService],
})
export class FriendModule { }

import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendRelation, FriendSchema } from './entities/friend.model';
import { FriendsController } from './friends.controller';
import { FriendService } from './friends.service';
import config from '../database/config';
import { AuthModule } from '../auth/module.auth';
import { UserModule } from '../user/user_module';

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
    ],
    controllers: [FriendsController],
    providers: [FriendService],
    exports: [MongooseModule, FriendService],
})
export class FriendModule { }

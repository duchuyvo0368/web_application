import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/module.auth';
import { Follow, FollowSchema } from './entities/follow.model';

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: Follow.name,
                    schema: FollowSchema,
                },
            ],
            'MONGODB_CONNECTION',
        ),
        //AuthModule

    ],
    // controllers: [FriendsController],
    // providers: [FriendService],
    exports: [MongooseModule],
})
export class FriendModule { }

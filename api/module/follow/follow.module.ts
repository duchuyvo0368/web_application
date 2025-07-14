import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/module.auth';
import { Follow, FollowSchema } from './entities/follow.model';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';

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
        AuthModule

    ],
    controllers: [FollowController],
    providers: [FollowService],
    exports: [MongooseModule],
})
export class FollowModule { }

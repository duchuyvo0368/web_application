import { forwardRef, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from 'module/auth/module.auth';
import { Post, PostSchema } from './posts.model';
import { FriendModule } from 'module/firends/friend.module';
import { UploadService } from 'module/upload/upload.service';
import { UploadModule } from 'module/upload/upload.module';
import { FeelModule } from 'module/feels/feels.module';

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                { name: Post.name, schema: PostSchema },
            ],
            'MONGODB_CONNECTION'
        ),
        AuthModule,
        FriendModule,
      //  FeelModule,
        forwardRef(() => UploadModule)

    ],
    controllers: [PostsController],
    providers: [PostsService],
    exports: [MongooseModule, PostsService],
})
export class PostsModule { }

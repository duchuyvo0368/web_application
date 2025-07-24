import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from 'module/auth/module.auth';
import { Post, PostSchema } from './post.entity';
import { FriendModule } from 'module/firends/friend.module';

@Module({
     imports: [
          MongooseModule.forFeature(
               [
                    { name: Post.name, schema: PostSchema },
               ],
               'MONGODB_CONNECTION'
          ),
          AuthModule,
          FriendModule

     ],
     controllers: [PostsController],
     providers: [PostsService],
     exports: [MongooseModule, PostsService],
})
export class PostsModule { }

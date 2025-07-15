import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './entities/post.entity';
import { AuthModule } from 'module/auth/module.auth';

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: Post.name,
                    schema: PostSchema,
                },
            ],
            'MONGODB_CONNECTION',
        ),
        AuthModule

    ],
    controllers: [PostsController],
    providers: [PostsService],
})
export class PostsModule { }

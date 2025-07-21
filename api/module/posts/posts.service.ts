import { PostsModule } from 'module/posts/posts.module';
import { Post, PostRelation } from './entities/post.entity';
import { extractMetadata } from './../../utils/extractMetadata'
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import { Injectable } from '@nestjs/common';
import { logger } from 'utils/logger';


@ApiTags('Post')
@Injectable()
export class PostsService {

    constructor(
        @InjectModel(Post.name, 'MONGODB_CONNECTION')
        private postModel: Model<PostRelation>,
    ) { }


    private async extractLinkMetadata(content: string) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const match = content.match(urlRegex);
        if (!match) return null;

        const url = match[0];
        return await extractMetadata(url);
    }

    async createPost(data: {
        userId: string;
        title: string;
        content: string;
        images?: string;
        post_link_meta?: string;
        privacy?: 'public' | 'friend';
    }) {
        let metadata = null;
        logger.info(`Incoming post data: ${JSON.stringify(data)}`);

        if (data.post_link_meta) {
            logger.info(`Extracting metadata from: ${data.post_link_meta}`);
            metadata = await this.extractLinkMetadata(data.post_link_meta);
        }

        const created = await this.postModel.create({
            ...data,
            post_link_meta: metadata,
        });

        return created;
    }



    findAll() {
        return `This action returns all posts`;
    }

    findOne(id: number) {
        return `This action returns a #${id} post`;
    }



    remove(id: number) {
        return `This action removes a #${id} post`;
    }
}





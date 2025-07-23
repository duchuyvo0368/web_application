import { PostsModule } from 'module/posts/posts.module';
import { Post, PostRelation } from './post.entity';
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


     async extractLinkMetadata(content: string) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const match = content.match(urlRegex);
        if (!match) return null;

        const url = match[0];
        return await extractMetadata(url);
    }
    private extractHashtags(content: string): string[] {
        const regex = /#(\w+)/g;
        const matches = [...content.matchAll(regex)];
        return matches.map(match => match[1].toLowerCase()); // chuyển về lowercase để đồng nhất
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

        // if (data.post_link_meta) {
        //     logger.info(`Extracting metadata from: ${data.post_link_meta}`);
        //     metadata = await this.extractLinkMetadata(data.post_link_meta);
        // }

        const hashtags = this.extractHashtags(data.content);

        const created = await this.postModel.create({
            ...data,
            post_link_meta: metadata,
            hashtags,
        });

        return created;
    }




    async getAllFriendPosts(userId: string, page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        const [posts, totalItems] = await Promise.all([
            this.postModel.find({
                userId: { $ne: userId },
                privacy: 'public',
            })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),

            this.postModel.countDocuments({
                userId: { $ne: userId },
                privacy: 'public',
            })
        ]);

        const totalPages = Math.ceil(totalItems / limit);

        return {
            data: posts,
            pagination: {
                page,
                limit,
                totalItems,
                totalPages
            }
        };
    }



}





import { PostsModule } from 'module/posts/posts.module';
import { Post, PostRelation } from './post.entity';
import { extractMetadata } from './../../utils/extractMetadata';
import { InjectModel } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import { BadRequestException, Injectable } from '@nestjs/common';
import { logger } from 'utils/logger';
import { FriendService } from 'module/firends/friends.service';
import { Model, Types } from 'mongoose';
import { UploadModule } from 'module/upload/upload.module';
import { UploadService } from 'module/upload/upload.service';

@ApiTags('Post')
@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name, 'MONGODB_CONNECTION')
        private postModel: Model<PostRelation>,
        private friendService: FriendService,
        private readonly uploadService: UploadService,
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
        return matches.map((match) => match[1].toLowerCase());
    }

    async createPost(
        data: {
            title: string;
            content: string;
            post_link_meta?: {
                post_link_url: string;
                post_link_title?: string;
                post_link_description?: string;
                post_link_content?: string;
                post_link_image?: string;
            } | null;
            privacy?: string;
            hashtags?: string;
        },
        userId: string,
        images?: Express.Multer.File[],
        videos?: Express.Multer.File[],
    ) {
        const imageUrls: string[] = [];
        const videoUrls: string[] = [];

        if (images && images.length > 0) {
            for (const file of images) {
                const result = await this.uploadService.handleUpload(file, 'post');
                if (result.metadata?.url) imageUrls.push(result.metadata.url);
            }
        }

        if (videos && videos.length > 0) {
            for (const file of videos) {
                const result = await this.uploadService.handleUpload(file, 'post');
                if (result.metadata?.url) videoUrls.push(result.metadata.url);
            }
        }

        const newPostData = {
            userId,
            title: data.title || '',
            content: data.content || '',
            privacy: data.privacy || 'public',
            hashtags: data.hashtags ? [data.hashtags] : [],
            post_link_meta: data.post_link_meta || null,
            images: imageUrls,
            videos: videoUrls,
            likesCount: 0,
            commentsCount: 0,
        };

        const post = await this.postModel.create(newPostData);
        return post;
    }






    //friends and public



    async getFeedPosts(userId: string, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [friendIds, followIds] = await Promise.all([
            this.friendService.getFriendUserIds(userId),
            this.friendService.getFollowingUserIds(userId),
        ]);

        //loc va xoa id trung nhau
        const relatedUserIds = [...new Set([...friendIds, ...followIds])].filter(id => id !== userId);

        const relatedQuery = {
            userId: { $in: relatedUserIds },
            $or: [
                { userId: { $in: friendIds }, privacy: { $in: ['public', 'friend'] } },
                { userId: { $in: followIds }, privacy: 'public' },
            ],
        };

        let myPost = null;
        let relatedLimit = limit;

        if (page === 1) {
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

            myPost = await this.postModel.findOne({ userId, privacy: { $in: ['public', 'friend'] }, createdAt: { $gte: oneDayAgo }, })
                .sort({ createdAt: -1 })
                .populate('userId', 'name avatar')
                .lean();
            if (myPost) {
                relatedLimit = limit - 1;
            }
        }

        const [relatedPosts, totalRelatedItems] = await Promise.all([
            this.postModel.find(relatedQuery)
                .sort({ createdAt: -1 })
                .populate('userId', 'name avatar')
                .skip(page === 1 ? skip : skip)
                .limit(relatedLimit)
                .lean(),
            this.postModel.countDocuments(relatedQuery),
        ]);

        const data = page === 1 && myPost ? [myPost, ...relatedPosts] : relatedPosts;
        const totalItems = totalRelatedItems + (page === 1 && myPost ? 1 : 0);

        return {
            data,
            pagination: {
                page,
                limit,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
            },
        };
    }


    //bai viet theo id
    async getPostsByUser(id: string, userId: string, page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        // Xem chính mình
        if (id === userId) {
            const [data, totalItems] = await Promise.all([
                this.postModel
                    .find({ userId: id })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                this.postModel.countDocuments({ userId: id }),
            ]);

            return {
                data,
                pagination: {
                    page,
                    limit,
                    totalItems,
                    totalPages: Math.ceil(totalItems / limit),
                },
            };
        }

        // Kiểm tra xem id này có phải bạn bè không
        const isFriend = await this.friendService.getFriendUserIds(userId);

        // Là bạn bè
        if (!isFriend) {
            return this.getFeedPosts(id, page, limit);
        }

        // chỉ lấy bài viết public
        const query = {
            userId: id,
            privacy: 'public',
        };

        const [data, totalItems] = await Promise.all([
            this.postModel
                .find(query)
                .populate('userId', 'name')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            this.postModel.countDocuments(query),
        ]);

        return {
            data,
            pagination: {
                page,
                limit,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
            },
        };
    }




}

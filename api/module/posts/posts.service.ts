import { PostsModule } from 'module/posts/posts.module';
import { Post, PostRelation } from './posts.model';
import { extractMetadata } from './../../utils/extractMetadata';
import { InjectModel } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import { BadRequestException, Injectable } from '@nestjs/common';
import { logger } from 'utils/logger';
import { FriendService } from 'module/firends/friends.service';
import { Model, Types } from 'mongoose';
import { UploadModule } from 'module/upload/upload.module';
import { UploadService } from 'module/upload/upload.service';
import { CreatePostDto } from './create-post.dto';

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


    async createPost(data: CreatePostDto, userId: string): Promise<Post> {
        const newPostData = {
            userId,
            title: data.title || '',
            content: data.content || '',
            privacy: data.privacy || 'public',
            hashtags: data.hashtags ?? [],
            post_link_meta: data.post_link_meta || null,
            images: data.images || [],
            videos: data.videos || [],
            feel: [],
            friends_tagged: data.friends_tagged || [],
            comments:0,
            views: 0,
        };

        logger.info(`Creating post with data:`, newPostData);

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

        // Lọc trùng ID
        const relatedUserIds = [...new Set([...friendIds, ...followIds])].filter(id => id !== userId);

        const relatedQuery = {
            userId: { $in: relatedUserIds },
            $or: [
                { userId: { $in: friendIds }, privacy: { $in: ['public', 'friend'] } },
                { userId: { $in: followIds }, privacy: 'public' },
            ],
        };

        let myPosts: any[] = [];
        let relatedLimit = limit;

        if (page === 1) {
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000); // 1 giờ trước

            myPosts = await this.postModel.find({
                userId,
                privacy: { $in: ['public', 'friend'] },
                createdAt: { $gte: oneHourAgo },
            })
                .sort({ createdAt: -1 })
                .populate('userId', 'name avatar')
                .populate('friends_tagged', 'email name avatar')
                .lean();

            if (myPosts.length > 0) {
                relatedLimit = limit - myPosts.length;
            }
        }

        const [relatedPosts, totalRelatedItems] = await Promise.all([
            this.postModel.find(relatedQuery)
                .sort({ createdAt: -1 })
                .populate('userId', 'name avatar')
                .skip(page === 1 ? skip : skip)
                .limit(relatedLimit)
                .lean()
                ,
            this.postModel.countDocuments(relatedQuery),
        ]);

        const data = page === 1 && myPosts.length > 0
            ? [...myPosts, ...relatedPosts]
            : relatedPosts;

        const totalItems = totalRelatedItems + (page === 1 ? myPosts.length : 0);

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

      
        if (id === userId) {
            const [data, totalItems] = await Promise.all([
                this.postModel
                    .find({ userId: id })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean()
                    ,
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

        const isFriend = await this.friendService.getFriendUserIds(userId);

       
        if (!isFriend) {
            return this.getFeedPosts(id, page, limit);
        }

      
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


    // nhiều loại cảm xúc
    async likePost(postId: string, userId: string, feel: 'like' | 'love' | 'haha') {
        const post = await this.postModel.findById(postId);
        if (!post) throw new Error('Post not found');

        const currentFeel = post.feel.get(userId);

        if (currentFeel === feel) {
         
            return post;
        }

       
        if (currentFeel) {
            const oldCount = post.feelCount.get(currentFeel) || 0;
            post.feelCount.set(currentFeel, Math.max(oldCount - 1, 0));
        }

     
        post.feel.set(userId, feel);
        const newCount = post.feelCount.get(feel) || 0;
        post.feelCount.set(feel, newCount + 1);

        await post.save();
        return post;
    }

    async unlikePost(postId: string, userId: string) {
        const post = await this.postModel.findById(postId);
        if (!post) throw new Error('Post not found');

        const currentFeel = post.feel.get(userId);
        if (currentFeel) {
            post.feel.delete(userId);
            const count = post.feelCount.get(currentFeel) || 0;
            post.feelCount.set(currentFeel, Math.max(count - 1, 0));
        }

        await post.save();
        return post;
    }

    async handleFeel(postId: string, userId: string, feel?: 'like' | 'love' | 'haha') {
        if (!userId) throw new Error('userId is required');

        const post = await this.postModel.findById(postId);
        if (!post) throw new Error('Post not found');

        const currentFeel = post.feel.get(userId);

        if (!feel || currentFeel === feel) {
            await this.unlikePost(postId, userId);
        } else {
            await this.likePost(postId, userId, feel);
        }

        const updatedPost = await this.postModel.findById(postId);
        return {
            message: 'Update feel successfully',
            userFeel: updatedPost?.feel.get(userId) || null,
            feelCounts: Object.fromEntries(updatedPost?.feelCount || []),
        };
    }



   





}

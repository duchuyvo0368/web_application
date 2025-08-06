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
import { async } from 'rxjs';
import { FriendRelation } from '../firends/model/friend.model';
import { PostRepository } from './post.reponsitory';
import { convertToObject } from 'utils/index';

@ApiTags('Post')
@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name, 'MONGODB_CONNECTION')
        private postModel: Model<PostRelation>,
        private friendService: FriendService,
        private readonly postRepository: PostRepository,
    ) { }

    async extractLinkMetadata(content: string) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const match = content.match(urlRegex);
        if (!match) return null;

        const url = match[0];
        return await extractMetadata(url);
    }


    async createPost(data: CreatePostDto, userId: string): Promise<Post> {
        const newPostData: Partial<Post> = {
            userId: new Types.ObjectId(userId),
            title: data.title || '',
            content: data.content || '',
            privacy: data.privacy || 'public',
            hashtags: data.hashtags ?? [],
            post_link_meta: data.post_link_meta?.post_link_url
                ? {
                    post_link_url: data.post_link_meta.post_link_url,
                    post_link_title: data.post_link_meta.post_link_title,
                    post_link_description: data.post_link_meta.post_link_description,
                    post_link_content: data.post_link_meta.post_link_content,
                    post_link_image: data.post_link_meta.post_link_image,
                }
                : undefined,
            images: data.images || [],
            videos: data.videos || [],
            feel: new Map<string, string>(),
            friends_tagged: (data.friends_tagged || []).map((id) => new Types.ObjectId(id)),
            comments: 0,
            views: 0,
        };

        logger.info(`Creating post with data:`, newPostData);

        return this.postRepository.createPost(newPostData, userId);
    }









    //friends and public


    async getFeedPosts(userId: string, page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        const [friendIds, followIds] = await Promise.all([
            this.friendService.getFriendUserIds(userId),
            this.friendService.getFollowingUserIds(userId),
        ]);

        let myPosts: any[] = [];
        let relatedLimit = limit;

        if (page === 1) {
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
            myPosts = await this.postRepository.findMyRecentPosts(userId, oneHourAgo);
            if (myPosts.length > 0) relatedLimit = limit - myPosts.length;
        }

        const { posts: relatedPosts, count: totalRelatedItems } =
            await this.postRepository.findRelatedPosts(friendIds, followIds, relatedLimit, skip);

        const data = page === 1 && myPosts.length > 0 ? [...myPosts, ...relatedPosts] : relatedPosts;
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







    // nhiều loại cảm xúc
    async likePost(postId: string, userId: string, feel: 'like' | 'love' | 'haha') {
        const post = await this.postRepository.findById(postId);
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

        await this.postRepository.save(post);
        return post;
    }

    async unlikePost(postId: string, userId: string) {
        const post = await this.postRepository.findById(postId);
        if (!post) throw new Error('Post not found');

        const currentFeel = post.feel.get(userId);
        if (currentFeel) {
            post.feel.delete(userId);
            const count = post.feelCount.get(currentFeel) || 0;
            post.feelCount.set(currentFeel, Math.max(count - 1, 0));
        }
        await this.postRepository.save(post)
        return post;
    }

    async handleFeel(postId: string, userId: string, feel?: 'like' | 'love' | 'haha') {
        if (!userId) throw new Error('userId is required');

        const post = await this.postRepository.findById(postId);
        if (!post) throw new Error('Post not found');

        const currentFeel = post.feel.get(userId);

        if (!feel || currentFeel === feel) {
            await this.unlikePost(postId, userId);
        } else {
            await this.likePost(postId, userId, feel);
        }

        const updatedPost = await this.postRepository.findById(postId);
        return {
            message: 'Update feel successfully',
            userFeel: updatedPost?.feel.get(userId) || null,
            feelCounts: Object.fromEntries(updatedPost?.feelCount || []),
        };
    }










    private async getAccessLevel(userId: string, requesterId: string): Promise<'owner' | 'friend' | 'public'> {
        if (userId === requesterId) return 'owner';

        const isFriend = await this.friendService.isFriend(userId, requesterId);
        logger.info(`isFriend: ${isFriend}`);
        return isFriend ? 'friend' : 'public';
    }

    private buildPostQuery(userId: string, accessLevel: 'owner' | 'friend' | 'public') {
        switch (accessLevel) {
            case 'owner':
                return { userId };
            case 'friend':
                return { userId, privacy: { $in: ['public', 'friend'] } };
            case 'public':
                return { privacy: 'public' };
            default:
                return { userId, privacy: 'public' };
        }
    }
    async getPostsByUserWithAccess(
        userId: string,
        requesterId: string,
        page = 1,
        limit = 10,
    ) {
        const accessLevel = await this.getAccessLevel(userId, requesterId);
        logger.info(`accessLevel: ${accessLevel}`);
        const query = this.buildPostQuery(userId, accessLevel);

        return this.postRepository.findPostsByQuery(query, page, limit);
    }

}

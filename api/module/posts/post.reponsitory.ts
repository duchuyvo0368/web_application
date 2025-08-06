import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Post, PostRelation } from "./posts.model";
import { CreatePostDto } from "./create-post.dto";
import { logger } from "utils/logger";
import { Document } from 'mongoose';

export class PostRepository {
    constructor(
        @InjectModel(Post.name, 'MONGODB_CONNECTION')
        private postModel: Model<PostRelation>,
    ) { }

    async createPost(data: Partial<Post>, userId: string): Promise<Post> {
        return this.postModel.create({
            ...data,
            userId,
            createdAt: new Date(),
        });
    }
    async findMyRecentPosts(userId: string, limitDate: Date) {
        return this.postModel
            .find({
                userId,
                privacy: { $in: ['public', 'friend'] },
                createdAt: { $gte: limitDate },
            })
            .sort({ createdAt: -1 })
            .populate('userId', 'name avatar')
            .populate('friends_tagged', 'email name avatar')
            .lean();
    }

    async findRelatedPosts(friendIds: string[], followIds: string[], limit: number, skip: number) {
        const relatedUserIds = [...new Set([...friendIds, ...followIds])].filter(
            (id) => id !== undefined,
        );

        const query = {
            userId: { $in: relatedUserIds },
            $or: [
                { userId: { $in: friendIds }, privacy: { $in: ['public', 'friend'] } },
                { userId: { $in: followIds }, privacy: 'public' },
            ],
        };

        const posts = await this.postModel
            .find(query)
            .sort({ createdAt: -1 })
            .populate('userId', 'name avatar')
            .skip(skip)
            .limit(limit)
            .lean();

        const count = await this.postModel.countDocuments(query);

        return { posts, count };
    }

    async findById(postId: string) {
        return await this.postModel.findById(postId);
    }


    async save(post: PostRelation): Promise<PostRelation> {
        const createdPost = new this.postModel(post); 
        return createdPost.save();
    }
    async findPostsByQuery(query: any, page = 1, limit = 10): Promise<PostRelation[]> {
        return this.postModel
            .find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('userId', 'name avatar')
            .populate('friends_tagged', 'email name avatar')
    }
}
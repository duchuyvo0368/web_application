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


    //tim kiem theo id của post
    async findById(postId: string) {
        return await this.postModel.findById(postId);
    }


    //luu like,love,haha
    async save(post: PostRelation): Promise<PostRelation> {
        const createdPost = new this.postModel(post);
        return createdPost.save();
    }

    async updatePost(postId: string, data: any) {
        return this.postModel.findByIdAndUpdate(postId, data, { new: true });
    }
    
    //lay ra post theo query
    async findPosts(query: any, page:number, limit:number): Promise<any[]> {
        return this.postModel
            .find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('userId', 'name avatar')
            .populate('friends_tagged', 'email name avatar').lean();
    }

    async deletePost(postId: string) {
        return this.postModel.findByIdAndDelete(postId);
    }
    async findPostsByQuery(query: any, page:number, limit:number): Promise<any[]> {
        return this.findPosts(query, page, limit);
    }
    async findFriendPosts(friendIds: string[], limit: number, page: number) {
        const filteredFriendIds = friendIds.filter(id => !!id);
        if (filteredFriendIds.length === 0) return { posts: [], count: 0 };

        const query = {
            userId: { $in: filteredFriendIds },
            privacy: { $in: ['public', 'friend'] },
        };

        const posts = await this.findPosts(query, page, limit);
        const count = await this.postModel.countDocuments(query);

        return { posts, count };
    }

    async findFollowPosts(followIds: string[], limit: number, page: number) {
        const filteredFollowIds = followIds.filter(id => !!id);
        if (filteredFollowIds.length === 0) return { posts: [], count: 0 };

        const query = {
            userId: { $in: filteredFollowIds },
            privacy: 'public',
        };

        const posts = await this.findPosts(query, page, limit);
        const count = await this.postModel.countDocuments(query);

        return { posts, count };
    }


    async findMyRecentPosts(userId: string, limitDate: Date,page:number,limit:number) {
        const query = {
            userId,
            privacy: { $in: ['public', 'friend'] },
            createdAt: { $gte: limitDate },
        }
        return this.findPosts(query,page,limit)

    }


}
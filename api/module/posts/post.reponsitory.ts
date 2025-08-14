import { InjectModel } from "@nestjs/mongoose";
import { Model, PipelineStage } from "mongoose";
import { Post, PostRelation } from "./posts.model";
import { CreatePostDto } from "./create-post.dto";
import { logger } from "utils/logger";
import { Document } from 'mongoose';

export class PostRepository {
    constructor(
        @InjectModel(Post.name, 'MONGODB_CONNECTION')
        private readonly postModel: Model<PostRelation>,
    ) { }

    //tạo post
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

    //update post
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
    async findPostAll(query: any): Promise<any[]> {
        return this.postModel
            .find(query)
            .sort({ createdAt: -1 })
            .populate('userId', 'name avatar')
            .populate('friends_tagged', 'email name avatar').lean();
    }
    //xoa post
    async deletePost(postId: string) {
        return this.postModel.findByIdAndDelete(postId);
    }
    async findPostsByQuery(query: any, page:number, limit:number): Promise<any[]> {
        return this.findPosts(query, page, limit);
    }
    

  
    async findFeedAggregate(
        userId: string,
        friendIds: string[],
        followIds: string[],
        sixHoursAgo: Date,
        page: number,
        limit: number
    ) {
        const onlyFollowIds = followIds.filter(id => !friendIds.includes(id));
        const skip = (page - 1) * limit;

        const pipeline: PipelineStage[] = [
            {
                $match: {
                    $or: [
                        { userId: userId, privacy: { $in: ['public', 'friend'] }, createdAt: { $gte: sixHoursAgo } },
                        { userId: { $in: friendIds }, privacy: { $in: ['public', 'friend'] } },
                        { userId: { $in: onlyFollowIds }, privacy: 'public' }
                    ]
                }
            },
            { $sort: { createdAt: -1 } },
            {
                $facet: {
                    paginatedResults: [{ $skip: skip }, { $limit: limit }],
                    totalCount: [{ $count: 'count' }]
                }
            }
        ];

        const result = await this.postModel.aggregate(pipeline).exec();

        let posts = result[0]?.paginatedResults || [];
        posts = await this.postModel.populate(posts, [
            { path: 'userId', select: 'name avatar' },
            { path: 'friends_tagged', select: 'email name avatar' }
        ]);
        const totalItems = result[0]?.totalCount[0]?.count || 0;
        const totalPages = Math.ceil(totalItems / limit);

        return { posts, totalItems, totalPages };
    }

    

}
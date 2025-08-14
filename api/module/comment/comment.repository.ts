import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from './comment.model'; // Điều chỉnh path schema
import { convertToObject } from 'utils/index';

@Injectable()
export class CommentRepository {
    constructor(
        @InjectModel(Comment.name, 'MONGODB_CONNECTION') private readonly commentModel: Model<CommentDocument>,
    ) { }

    async findById(id: string): Promise<any | null> {
        return this.commentModel.findById(id).exec();
    }

    async updateRightValues(postId: string, rightValue: number): Promise<any> {
        return this.commentModel.updateMany(
            {
                comment_post_id: new Types.ObjectId(postId),
                comment_right: { $gte: rightValue },
            },
            { $inc: { comment_right: 2 } },
        ).exec();
    }

    async updateLeftValues(productId: string, rightValue: number): Promise<any> {
        return this.commentModel.updateMany(
            {
                comment_productID: new Types.ObjectId(productId),
                comment_left: { $gte: rightValue },
            },
            { $inc: { comment_left: 2 } },
        ).exec();
    }

    async findMaxRightValue(postId: string): Promise<number | null> {
        const doc = await this.commentModel
            .findOne({ comment_post_id: new Types.ObjectId(postId) })
            .sort({ comment_right: -1 })
            .select('comment_right')
            .exec();

        return doc ? doc.comment_right : null;
    }

    async create(
        commentPostId: string,
        commentUserId: string,
        commentContent: string,
        commentParentId: string | null,
        commentLeft: number,
        commentRight: number
    ): Promise<any> {
        const newComment = new this.commentModel({
            comment_post_id: commentPostId,
            comment_user_id: commentUserId,
            comment_content: commentContent,
            comment_parent_id: commentParentId,
            comment_left: commentLeft,
            comment_right: commentRight,
        })

        const saved = await newComment.save();
        const { comment_left, comment_right, ...rest } = saved.toObject(); 
        return rest;
    }

    async findCommentsByParentRange(
        postId: string,
        left: number,
        right: number,
    ): Promise<any[]> {
        return this.commentModel
            .find({
                comment_post_id: new Types.ObjectId(postId),
                comment_left: { $gt: left },
                comment_right: { $lte: right },
            })
            .select('comment_left comment_right comment_content comment_parent_id')
            .sort({ comment_left: 1 })
            .exec();
    }

    async findRootComments(postId: string): Promise<CommentDocument[]> {
        return this.commentModel
            .find({
                comment_post_id: new Types.ObjectId(postId),
                comment_parent_id: null,
            })
            .select('comment_left comment_right comment_content comment_parent_id')
            .sort({ comment_left: 1 })
            .exec();
    }

    async deleteCommentsByRange(
        postId: string,
        leftValue: number,
        rightValue: number,
    ): Promise<any> {
        return this.commentModel.deleteMany({
            comment_post_id: new Types.ObjectId(postId),
            comment_left: { $gte: leftValue, $lte: rightValue },
        }).exec();
    }

    async decrementRightValues(
        postId: string,
        rightValue: number,
        width: number,
    ): Promise<any> {
        return this.commentModel.updateMany(
            {
                comment_post_id: new Types.ObjectId(postId),
                comment_right: { $gt: rightValue },
            },
            { $inc: { comment_right: -width } },
        ).exec();
    }

    async decrementLeftValues(
        postId: string,
        rightValue: number,
        width: number,
    ): Promise<any> {
        return this.commentModel.updateMany(
            {
                comment_post_id: new Types.ObjectId(postId),
                comment_left: { $gt: rightValue },
            },
            { $inc: { comment_left: -width } },
        ).exec();
    }


    async findCommentsByPostId(postId: string): Promise<CommentDocument[]> {
        return this.commentModel
            .find({
                comment_post_id: postId,
            })
            .select('id comment_user_id  comment_post_id comment_parent_id  comment_content ')
            .sort({ comment_left: 1 })
            .exec();
    }
}
